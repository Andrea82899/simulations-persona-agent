import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generatePersona, generatePersonaReply, generateSummary } from '../server/lib/ollama'
import type { ChatMessage, PersonaProfile } from '../types/persona'

const persona: PersonaProfile = {
  name: 'Mara Keller',
  background: 'Produktmanagerin in einem kleinen B2B-SaaS-Team.',
  motivation: 'Sie will schneller belastbare Kundensignale bekommen.',
  painPoints: ['wenig Zeit', 'zu wenige Interviewpartner'],
  decisionBehavior: 'Sie testet pragmatisch und achtet auf konkrete Zeitersparnis.',
  tone: 'direkt, freundlich, kritisch'
}

beforeEach(() => {
  vi.stubGlobal('useRuntimeConfig', () => ({
    ollamaHost: 'http://localhost:11434',
    ollamaModel: 'llama3.1:8b'
  }))
  vi.stubGlobal('createError', (input: any) => new Error(input.statusMessage))
})

describe('Ollama-Client', () => {
  it('parst eine strukturierte Persona aus einer Modellantwort', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        message: {
          content: JSON.stringify({
            ...persona,
            painPoints: ['Ich bin oft überfordert von Konflikten im Team', 'Ich brauche mehr Struktur.']
          })
        }
      })
    })))

    const result = await generatePersona('Ein Research-Tool soll getestet werden.', 'B2B-Produktteams')

    expect(result.name).toBe('Mara Keller')
    expect(result.painPoints.length).toBeGreaterThan(0)
    expect(result.painPoints.join(' ')).not.toContain('überfordert')
    expect(result.painPoints.join(' ')).toContain('Klärungsbedarf')
  })

  it('fragt die Persona streng in Rolle an', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ message: { content: 'Das klingt hilfreich, aber ich bin sonst schnell überfordert und würde zuerst echte Beispiele sehen wollen.' } })
    }))
    vi.stubGlobal('fetch', fetchMock)

    const messages: ChatMessage[] = [{
      id: 1,
      sessionId: 1,
      role: 'user',
      content: 'Würdest du das nutzen?',
      createdAt: new Date().toISOString()
    }]

    const reply = await generatePersonaReply({
      scenario: 'Ein lokales Research-Tool.',
      targetAudience: 'B2B-Produktteams',
      persona,
      messages,
      userMessage: 'Was brauchst du dafür?'
    })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).toContain('bleibst streng in dieser Rolle')
    expect(body.messages[0].content).toContain('Swissness')
    expect(body.messages[0].content).toContain('lösungsorientiert')
    expect(body.messages[0].content).toContain('Überforderung')
    expect(reply).toContain('echte Beispiele')
    expect(reply).not.toContain('überfordert')
  })

  it('fordert Swissness und konstruktive Persona-Generierung an', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ message: { content: JSON.stringify(persona) } })
    }))
    vi.stubGlobal('fetch', fetchMock)

    await generatePersona('Ein Research-Tool soll getestet werden.', 'Schweizer B2B-Produktteams')

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).toContain('Swissness')
    expect(body.messages[0].content).toContain('Schweizer Hochdeutsch')
    expect(body.messages[0].content).toContain('Verbesserungspotenzial')
    expect(body.messages[0].content).toContain('Zielgruppe strikt ein')
    expect(body.messages[1].content).toContain('exakt erfüllt')
  })

  it('parst eine strukturierte Zusammenfassung', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        message: {
          content: JSON.stringify({
            insights: ['Schnelligkeit ist zentral.'],
            needs: ['Nachvollziehbare Simulationen.'],
            objections: ['Zu wenig Vertrauen in synthetisches Feedback.'],
            patterns: ['Pragmatische Bewertung.'],
            recommendations: ['Als Ergänzung zu Interviews positionieren.']
          })
        }
      })
    })))

    const result = await generateSummary({
      scenario: 'Ein lokales Research-Tool.',
      targetAudience: 'B2B-Produktteams',
      persona,
      messages: []
    })

    expect(result.needs).toContain('Nachvollziehbare Simulationen.')
  })

  it('fordert eine schweizerisch-sachliche Auswertung an', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        message: {
          content: JSON.stringify({
            insights: ['Schnelligkeit ist zentral.'],
            needs: ['Nachvollziehbare Simulationen.'],
            objections: ['Konkrete Beispiele schaffen Vertrauen.'],
            patterns: ['Pragmatische Bewertung.'],
            recommendations: ['Als Ergänzung zu Interviews positionieren.']
          })
        }
      })
    }))
    vi.stubGlobal('fetch', fetchMock)

    await generateSummary({
      scenario: 'Ein lokales Research-Tool.',
      targetAudience: 'Schweizer B2B-Produktteams',
      persona,
      messages: []
    })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).toContain('Swissness')
    expect(body.messages[0].content).toContain('Klärungspunkte')
    expect(body.messages[1].content).toContain('schweizerisch-sachlicher Tonalität')
  })
})
