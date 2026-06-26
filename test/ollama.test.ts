import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generatePersonaReply, generateSummary } from '../server/lib/ollama'
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
    expect(body.messages[0].content).toContain('Du bist Lukas Berger')
    expect(body.messages[0].content).toContain('keine Meta-Analyse')
    expect(body.messages[0].content).toContain('fühlst dich im Kern nicht genug wertgeschätzt')
    expect(body.messages[0].content).toContain('offene Fragen')
    expect(body.keep_alive).toBe('10m')
    expect(body.options.num_ctx).toBe(2048)
    expect(body.options.num_predict).toBe(80)
    expect(reply).toContain('echte Beispiele')
    expect(reply).not.toContain('überfordert')
  })

  it('sendet im Chat nur die letzten acht Verlaufsnachrichten an Ollama', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ message: { content: 'Ich brauche zuerst einen konkreten nächsten Schritt.' } })
    }))
    vi.stubGlobal('fetch', fetchMock)

    const messages: ChatMessage[] = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      sessionId: 1,
      role: index % 2 === 0 ? 'user' : 'persona',
      content: `Nachricht ${index + 1}`,
      createdAt: new Date().toISOString()
    }))

    await generatePersonaReply({
      scenario: 'Ein lokales Research-Tool.',
      targetAudience: 'B2B-Produktteams',
      persona,
      messages,
      userMessage: 'Was brauchst du dafür?'
    })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    const sentContents = body.messages.map((message: { content: string }) => message.content)

    expect(sentContents).not.toContain('Nachricht 1')
    expect(sentContents).not.toContain('Nachricht 4')
    expect(sentContents).toContain('Nachricht 5')
    expect(sentContents).toContain('Nachricht 12')
  })

  it('parst eine strukturierte Zusammenfassung', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        message: {
          content: JSON.stringify({
            strength: 'Du hast konkret beschrieben, worum es geht.',
            strengthQuote: 'Mir ist aufgefallen, dass zwei Termine nicht gehalten wurden.',
            improvement: 'Der Wunsch könnte noch machbarer formuliert werden.',
            improvementQuote: 'Das muss besser werden.',
            exampleSentences: [
              'Ich wünsche mir, dass du spätestens am Vortag meldest, wenn ein Termin wackelt.',
              'Lass uns vereinbaren, welche Informationen in der Übergabe zwingend enthalten sind.'
            ],
            wwwFeedback: {
              perception: 'Die Wahrnehmung war teilweise konkret.',
              effect: 'Die Wirkung wurde erkennbar benannt.',
              wish: 'Der Wunsch braucht mehr Klarheit.'
            }
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

    expect(result.strength).toContain('konkret')
    expect(result.exampleSentences).toHaveLength(2)
  })

  it('fordert ein getrenntes WWW-Abschlusscoaching an', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        message: {
          content: JSON.stringify({
            strength: 'Guter Einstieg.',
            strengthQuote: 'Ich schätze deine Arbeit.',
            improvement: 'Konkreter Wunsch fehlt.',
            improvementQuote: 'Mach es einfach besser.',
            exampleSentences: [
              'Bitte melde dich künftig spätestens am Vortag.',
              'Ich wünsche mir eine Übergabe mit den drei offenen Punkten.'
            ],
            wwwFeedback: {
              perception: 'Teilweise konkret.',
              effect: 'Wirkung knapp benannt.',
              wish: 'Noch zu allgemein.'
            }
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
    expect(body.messages[0].content).toContain('Kommunikations-Coach')
    expect(body.messages[0].content).toContain('Bewerte ausschliesslich die Führungskraft')
    expect(body.messages[0].content).toContain('WWW-Modell')
    expect(body.messages[1].content).toContain('Abschluss-Coaching')
  })
})
