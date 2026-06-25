import { describe, expect, it } from 'vitest'
import { nextFeedbackCountdown } from '../app/composables/useCoachCadence'
import { buildTrainingContext, focusOptions, scenarioPresets } from '../app/composables/useSimulationCatalog'

describe('Simulationskatalog', () => {
  it('setzt beim Trainingsfall den passenden Fokus', () => {
    const preset = scenarioPresets.find((item) => item.title === 'Stille lesen')

    expect(preset?.focus).toBe('Stille aushalten')
    expect(focusOptions).toContain(preset?.focus)
  })

  it('erstellt einen Trainingskontext mit Fokus und Schwierigkeit', () => {
    const context = buildTrainingContext({
      scenario: 'Ein Meeting verliert den Fokus.',
      targetAudience: 'Führungskräfte in der Schweiz.',
      trainingFocus: 'Fokus halten',
      difficulty: 'schwer'
    })

    expect(context.scenario).toContain('Trainingsfokus: Fokus halten.')
    expect(context.scenario).toContain('Schwierigkeitsgrad: schwer.')
    expect(context.scenario).toContain('testet Interventionen aktiv')
    expect(context.targetAudience).toContain('Trainingssetting für Fokus halten')
  })
})

describe('Coach-Cadence', () => {
  it('gibt Feedback erst nach zehn Interaktionen als nächsten Auto-Impuls an', () => {
    expect(nextFeedbackCountdown(0, false)).toBe(10)
    expect(nextFeedbackCountdown(1, true)).toBe(9)
    expect(nextFeedbackCountdown(9, true)).toBe(1)
    expect(nextFeedbackCountdown(10, true)).toBe(10)
  })
})

