import { describe, expect, it } from 'vitest'
import { nextFeedbackCountdown } from '../app/composables/useCoachCadence'
import { buildTrainingContext, focusOptions, scenarioPresets } from '../app/composables/useSimulationCatalog'
import { filterSessionsByQuery, groupSessionsByPersona, limitSessions } from '../app/composables/useSessionHistory'
import type { SessionListItem } from '../app/composables/useSimulationCatalog'

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

const sessions: SessionListItem[] = [
  {
    id: 1,
    scenario: 'Feedbackgespräch mit starker Reaktion',
    targetAudience: 'Führungskräfte',
    createdAt: '2026-06-25T10:00:00.000Z',
    personaName: 'Miriam'
  },
  {
    id: 2,
    scenario: 'Projektmeeting entgleitet',
    targetAudience: 'Projektleitung',
    createdAt: '2026-06-25T10:05:00.000Z',
    personaName: 'Rajani'
  },
  {
    id: 3,
    scenario: 'Leistungsproblem ansprechen',
    targetAudience: 'Führungskräfte',
    createdAt: '2026-06-25T10:10:00.000Z',
    personaName: 'Miriam'
  }
]

describe('Session-Historie', () => {
  it('gruppiert gespeicherte Simulationen unter der jeweiligen Persona', () => {
    const groups = groupSessionsByPersona(sessions)

    expect(groups).toHaveLength(2)
    expect(groups[0].personaName).toBe('Miriam')
    expect(groups[0].sessions.map((session) => session.id)).toEqual([1, 3])
    expect(groups[1].personaName).toBe('Rajani')
  })

  it('filtert und begrenzt die Historie vor der Anzeige', () => {
    const filtered = filterSessionsByQuery(sessions, 'projekt')
    const limited = limitSessions(sessions, false, 2)

    expect(filtered.map((session) => session.id)).toEqual([2])
    expect(limited.map((session) => session.id)).toEqual([1, 2])
  })
})
