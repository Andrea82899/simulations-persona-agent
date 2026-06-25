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
  insights: ['Das Tool muss schnelle erste Hypothesen liefern.'],
  needs: ['Klare, speicherbare Simulationen.'],
  objections: ['Skepsis gegenüber rein synthetischem Feedback.'],
  patterns: ['Zeitdruck prägt die Bewertung.'],
  recommendations: ['Simulationen klar als Ergänzung zu echten Interviews positionieren.']
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
    expect(stored.summary?.recommendations).toContain('Simulationen klar als Ergänzung zu echten Interviews positionieren.')
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

  it('speichert einen Chat-Zug mit optionalem Coach-Feedback zusammen', () => {
    const session = createSession({
      scenario: 'Ein Research-Tool für frühes Produktfeedback.',
      targetAudience: 'Produktteams in kleinen B2B-Softwarefirmen.',
      persona
    })

    saveChatTurn({
      sessionId: session.id,
      userMessage: 'Wie reagierst du auf den Vorschlag?',
      personaReply: 'Ich sehe den Nutzen, möchte aber zuerst klare Beispiele.',
      coachFeedback: {
        effect: 'Die Frage öffnet den Dialog.',
        technique: 'Offene Frage',
        improvement: 'Noch konkreter nach dem nächsten Schritt fragen.',
        alternative: 'Was wäre für dich ein sinnvoller erster Test?'
      }
    })

    const stored = getSession(session.id)

    expect(stored.messages.map((message) => message.role)).toEqual(['user', 'persona'])
    expect(stored.coachFeedback[0].userMessageId).toBe(stored.messages[0].id)
    expect(stored.coachFeedback[0].alternative).toContain('sinnvoller erster Test')
  })
})
