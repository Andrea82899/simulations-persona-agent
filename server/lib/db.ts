import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { ChatMessage, CoachFeedback, PersonaProfile, SessionSummary, StoredSession } from '../../types/persona'

let db: Database.Database | null = null

function now() {
  return new Date().toISOString()
}

export function getDb() {
  if (db) return db

  const config = useRuntimeConfig()
  const databasePath = resolve(String(config.databasePath))
  mkdirSync(dirname(databasePath), { recursive: true })
  db = new Database(databasePath)
  db.pragma('journal_mode = WAL')
  migrate(db)
  return db
}

export function resetDbForTests(database: Database.Database) {
  db = database
  migrate(db)
}

function migrate(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS personas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      profile_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      persona_id INTEGER NOT NULL,
      scenario TEXT NOT NULL,
      target_audience TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (persona_id) REFERENCES personas(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'persona')),
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL UNIQUE,
      summary_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS coach_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      user_message_id INTEGER NOT NULL UNIQUE,
      feedback_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id),
      FOREIGN KEY (user_message_id) REFERENCES messages(id)
    );
  `)
}

export function createSession(input: {
  scenario: string
  targetAudience: string
  persona: PersonaProfile
}) {
  const database = getDb()
  const createdAt = now()
  const personaResult = database.prepare(`
    INSERT INTO personas (name, profile_json, created_at)
    VALUES (?, ?, ?)
  `).run(input.persona.name, JSON.stringify(input.persona), createdAt)

  const sessionResult = database.prepare(`
    INSERT INTO sessions (persona_id, scenario, target_audience, created_at)
    VALUES (?, ?, ?, ?)
  `).run(personaResult.lastInsertRowid, input.scenario, input.targetAudience, createdAt)

  return getSession(Number(sessionResult.lastInsertRowid))
}

export function listSessions() {
  return getDb().prepare(`
    SELECT
      sessions.id,
      sessions.scenario,
      sessions.target_audience as targetAudience,
      sessions.created_at as createdAt,
      personas.name as personaName
    FROM sessions
    JOIN personas ON personas.id = sessions.persona_id
    ORDER BY sessions.created_at DESC, sessions.id DESC
  `).all()
}

export function getSession(id: number): StoredSession {
  const database = getDb()
  const session = database.prepare(`
    SELECT
      sessions.id,
      sessions.scenario,
      sessions.target_audience as targetAudience,
      sessions.created_at as createdAt,
      personas.profile_json as personaJson
    FROM sessions
    JOIN personas ON personas.id = sessions.persona_id
    WHERE sessions.id = ?
  `).get(id) as any

  if (!session) {
    throw createError({ statusCode: 404, statusMessage: 'Simulation nicht gefunden.' })
  }

  const messages = database.prepare(`
    SELECT id, session_id as sessionId, role, content, created_at as createdAt
    FROM messages
    WHERE session_id = ?
    ORDER BY id ASC
  `).all(id) as ChatMessage[]

  const summaryRow = database.prepare(`
    SELECT summary_json as summaryJson
    FROM summaries
    WHERE session_id = ?
  `).get(id) as any

  const coachRows = database.prepare(`
    SELECT
      id,
      session_id as sessionId,
      user_message_id as userMessageId,
      feedback_json as feedbackJson,
      created_at as createdAt
    FROM coach_feedback
    WHERE session_id = ?
    ORDER BY id ASC
  `).all(id) as any[]

  return {
    id: session.id,
    scenario: session.scenario,
    targetAudience: session.targetAudience,
    createdAt: session.createdAt,
    persona: JSON.parse(session.personaJson),
    messages,
    coachFeedback: coachRows.map((row) => ({
      id: row.id,
      sessionId: row.sessionId,
      userMessageId: row.userMessageId,
      createdAt: row.createdAt,
      ...JSON.parse(row.feedbackJson)
    })),
    summary: summaryRow ? JSON.parse(summaryRow.summaryJson) : null
  }
}

export function addMessage(sessionId: number, role: 'user' | 'persona', content: string) {
  const result = getDb().prepare(`
    INSERT INTO messages (session_id, role, content, created_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionId, role, content, now())
  return Number(result.lastInsertRowid)
}

export function saveChatTurn(input: {
  sessionId: number
  userMessage: string
  personaReply: string
  coachFeedback?: Omit<CoachFeedback, 'id' | 'sessionId' | 'userMessageId' | 'createdAt'> | null
}) {
  const database = getDb()
  const insertMessage = database.prepare(`
    INSERT INTO messages (session_id, role, content, created_at)
    VALUES (?, ?, ?, ?)
  `)
  const insertFeedback = database.prepare(`
    INSERT INTO coach_feedback (session_id, user_message_id, feedback_json, created_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_message_id) DO UPDATE SET
      feedback_json = excluded.feedback_json,
      created_at = excluded.created_at
  `)

  return database.transaction(() => {
    const createdAt = now()
    const userResult = insertMessage.run(input.sessionId, 'user', input.userMessage, createdAt)
    insertMessage.run(input.sessionId, 'persona', input.personaReply, createdAt)
    const userMessageId = Number(userResult.lastInsertRowid)

    if (input.coachFeedback) {
      insertFeedback.run(input.sessionId, userMessageId, JSON.stringify(input.coachFeedback), createdAt)
    }

    return userMessageId
  })()
}

export function saveCoachFeedback(sessionId: number, userMessageId: number, feedback: Omit<CoachFeedback, 'id' | 'sessionId' | 'userMessageId' | 'createdAt'>) {
  getDb().prepare(`
    INSERT INTO coach_feedback (session_id, user_message_id, feedback_json, created_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_message_id) DO UPDATE SET
      feedback_json = excluded.feedback_json,
      created_at = excluded.created_at
  `).run(sessionId, userMessageId, JSON.stringify(feedback), now())
}

export function deleteCoachFeedback(sessionId: number, userMessageId: number) {
  getDb().prepare(`
    DELETE FROM coach_feedback
    WHERE session_id = ? AND user_message_id = ?
  `).run(sessionId, userMessageId)
}

export function saveSummary(sessionId: number, summary: SessionSummary) {
  getDb().prepare(`
    INSERT INTO summaries (session_id, summary_json, created_at)
    VALUES (?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET
      summary_json = excluded.summary_json,
      created_at = excluded.created_at
  `).run(sessionId, JSON.stringify(summary), now())
}
