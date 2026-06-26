import Database from 'better-sqlite3'
import { beforeEach, describe, expect, it } from 'vitest'
import { addMessage, createSession, getSession, listSessions, resetDbForTests, saveChatTurn, saveSummary } from '../server/lib/db'
import type { PersonaProfile, SessionSummary } from '../types/persona'

const persona: PersonaProfile = {
  name: 'Mara Keller',
  background: 'Produktmanagerin in einem kleinen B2B-SaaS-Team.',
  motivation: 'Sie will schneller belastbare Kundensignale bekommen.',
  painPoints: ['wenig Zeit', 'zu wenige Interviewpartner'],
  decisionBehavior: 'Sie testet pragmatisch und achtet auf konkrete Zeitersparnis.',
  tone: 'direkt, freundlich, kritisch'
}

const summary: SessionSummary = {
  strength: 'Die Führungskraft beschreibt eine konkrete Beobachtung.',
  strengthQuote: 'Mir ist aufgefallen, dass zwei Termine nicht gehalten wurden.',
  improvement: 'Der Wunsch soll noch machbarer werden.',
  improvementQuote: 'Das muss besser werden.',
  exampleSentences: [
    'Ich wünsche mir, dass du spätestens am Vortag meldest, wenn ein Termin wackelt.',
    'Lass uns vereinbaren, welche Informationen in der Übergabe zwingend enthalten sind.'
  ],
  wwwFeedback: {
    perception: 'Konkrete Wahrnehmung ist vorhanden.',
    effect: 'Die Wirkung wird knapp sichtbar.',
    wish: 'Der Wunsch braucht mehr Klarheit.'
  }
}

beforeEach(() => {
  resetDbForTests(new Database(':memory:'))
})

describe('SQLite-Persistenz', () => {
  it('speichert Sessions, Persona, Nachrichten und Zusammenfassung', () => {
    const session = createSession({
      scenario: 'Ein Research-Tool für frühes Produktfeedback.',
      targetAudience: 'Produktteams in kleinen B2B-Softwarefirmen.',
      persona
    })

    addMessage(session.id, 'user', 'Was wäre dein erster Einwand?')
    addMessage(session.id, 'persona', 'Ich müsste wissen, wie belastbar diese Simulation ist.')
    saveSummary(session.id, summary)

    const stored = getSession(session.id)

    expect(stored.persona.name).toBe('Mara Keller')
    expect(stored.messages.map((message) => message.role)).toEqual(['user', 'persona'])
    expect(stored.summary?.exampleSentences).toContain('Ich wünsche mir, dass du spätestens am Vortag meldest, wenn ein Termin wackelt.')
  })

  it('listet gespeicherte Sessions mit der neuesten zuerst', () => {
    createSession({
      scenario: 'Erstes Szenario mit längerem Text.',
      targetAudience: 'Zielgruppe eins.',
      persona
    })
    const second = createSession({
      scenario: 'Zweites Szenario mit längerem Text.',
      targetAudience: 'Zielgruppe zwei.',
      persona: { ...persona, name: 'Jonas Weber' }
    })

    const sessions = listSessions() as Array<{ id: number, personaName: string }>

    expect(sessions[0].id).toBe(second.id)
    expect(sessions[0].personaName).toBe('Jonas Weber')
  })

  it('speichert einen Chat-Zug chronologisch', () => {
    const session = createSession({
      scenario: 'Ein Research-Tool für frühes Produktfeedback.',
      targetAudience: 'Produktteams in kleinen B2B-Softwarefirmen.',
      persona
    })

    saveChatTurn({
      sessionId: session.id,
      userMessage: 'Wie reagierst du auf den Vorschlag?',
      personaReply: 'Ich sehe den Nutzen, möchte aber zuerst klare Beispiele.'
    })

    const stored = getSession(session.id)

    expect(stored.messages.map((message) => message.role)).toEqual(['user', 'persona'])
    expect(stored.messages[0].content).toContain('Wie reagierst du')
    expect(stored.messages[1].content).toContain('klare Beispiele')
  })
})
