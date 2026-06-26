import { describe, expect, it } from 'vitest'
import { getMoodBarometer } from '../app/composables/useMoodBarometer'
import { buildTrainingContext, defaultScenario, scenarioPresets, simulationTemplates } from '../app/composables/useSimulationCatalog'
import type { ChatMessage } from '../types/persona'

describe('Simulationskatalog', () => {
  it('setzt Feedbackgespräche als Trainingsfall', () => {
    const preset = scenarioPresets.find((item) => item.title === 'Deadline ansprechen')

    expect(preset?.focus).toBe('Klarheit schaffen')
    expect(defaultScenario).toContain('Lukas Berger')
  })

  it('erstellt einen Trainingskontext für Lukas Berger', () => {
    const context = buildTrainingContext({
      scenario: 'Zwei Deadlines wurden verpasst.',
      targetAudience: 'Führungskräfte in der Schweiz.',
      trainingFocus: 'Fokus halten',
      difficulty: 'schwer'
    })

    expect(context.scenario).toContain('schwieriges Feedbackgespräch')
    expect(context.scenario).toContain('Lukas Berger bleibt dieselbe Person')
    expect(context.targetAudience).toContain('Persona und Coach bleiben getrennte Rollen')
  })

  it('zeigt genau Lukas Berger als feste Trainingsperson', () => {
    expect(simulationTemplates.map((template) => template.persona.name)).toEqual([
      'Lukas Berger'
    ])
  })
})

describe('Stimmungsbarometer', () => {
  it('öffnet Lukas bei Wertschätzung, offenen Fragen und konkretem Wunsch', () => {
    const messages: ChatMessage[] = [{
      id: 1,
      sessionId: 1,
      role: 'user',
      content: 'Ich schätze deine fachliche Arbeit. Mir ist aufgefallen, dass zwei Termine nicht gehalten wurden. Was brauchst du, damit wir den nächsten Schritt verbindlich vereinbaren können?',
      createdAt: new Date().toISOString()
    }]

    expect(getMoodBarometer(messages).label).toBe('offen')
  })

  it('macht Lukas bei pauschalen Vorwürfen verschlossener', () => {
    const messages: ChatMessage[] = [{
      id: 1,
      sessionId: 1,
      role: 'user',
      content: 'Du bist schon wieder schuld, weil du immer schludrig arbeitest.',
      createdAt: new Date().toISOString()
    }]

    expect(getMoodBarometer(messages).label).toBe('verschlossen')
  })
})
