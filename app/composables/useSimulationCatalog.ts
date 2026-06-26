import type { PersonaProfile } from '../../types/persona'

export type SessionListItem = {
  id: number
  scenario: string
  targetAudience: string
  createdAt: string
  personaName: string
}

export type SimulationTemplate = {
  id: string
  pattern: string
  typicalSentence: string
  exercise: string
  learningGoal: string
  successCriteria: string
  goodIntervention: string
  commonMistake: string
  scenario: string
  targetAudience: string
  persona: PersonaProfile
}

export type ScenarioPreset = {
  title: string
  focus: string
  fit: string
  scenario: string
}

export type PhraseGroup = {
  title: string
  phrases: string[]
}

export const defaultScenario = 'Du führst ein Feedbackgespräch mit Lukas Berger. Er hat in den letzten Wochen zwei Deadlines gerissen und eine Übergabe so unvollständig gemacht, dass Kolleginnen und Kollegen nacharbeiten mussten. Ziel ist ein klares, wertschätzendes Gespräch mit konkreter Beobachtung, Wirkung und Wunsch.'
export const defaultTargetAudience = 'Führungskräfte in der Schweiz, die schwierige Feedback- und Kritikgespräche sicher üben wollen. Der Trainingspartner bleibt Lukas Berger und reagiert glaubwürdig aus seiner festen Biografie.'

export const focusOptions = [
  'Fokus halten',
  'Reframing',
  'Grenzen setzen',
  'Stille aushalten',
  'Emotion anerkennen',
  'Interessen klären',
  'Konflikt moderieren',
  'Verbindlichkeit schaffen',
  'Klarheit schaffen',
  'Entscheidung vorbereiten'
] as const

export const difficultyOptions = [
  { value: 'leicht', label: 'Leicht' },
  { value: 'mittel', label: 'Mittel' },
  { value: 'schwer', label: 'Schwer' }
] as const

export const scenarioPresets: ScenarioPreset[] = [
  {
    title: 'Deadline ansprechen',
    focus: 'Klarheit schaffen',
    fit: 'Zwei Termine gerissen',
    scenario: 'Du sprichst mit Lukas Berger über zwei gerissene Deadlines in den letzten Wochen. Wichtig ist, konkret zu bleiben, die Wirkung aufs Team zu benennen und einen machbaren Wunsch zu formulieren.'
  },
  {
    title: 'Übergabe klären',
    focus: 'Wirkung benennen',
    fit: 'Team musste nacharbeiten',
    scenario: 'Du sprichst mit Lukas Berger über eine unvollständige Übergabe. Kolleginnen und Kollegen mussten nacharbeiten. Trainiert wird, die Wirkung klar zu benennen, ohne Lukas abzuwerten.'
  },
  {
    title: 'Wertschätzung zuerst',
    focus: 'Wertschätzung zeigen',
    fit: 'Lukas wird defensiv',
    scenario: 'Du willst Lukas Berger auf seine zuletzt nachlassende Verlässlichkeit ansprechen. Der Einstieg soll seine fachliche Stärke anerkennen, bevor du Beobachtung, Wirkung und Wunsch formulierst.'
  },
  {
    title: 'Verbindlich abschliessen',
    focus: 'Wunsch formulieren',
    fit: 'Konkrete Vereinbarung',
    scenario: 'Du übst den Abschluss des Feedbackgesprächs mit Lukas Berger. Ziel ist ein klarer, machbarer Wunsch und eine konkrete Vereinbarung für die nächste Übergabe.'
  }
]

export const phraseLibrary: PhraseGroup[] = [
  {
    title: 'Wahrnehmung',
    phrases: [
      'Mir ist aufgefallen, dass die letzten zwei Termine nicht gehalten wurden.',
      'Bei der Übergabe vom Donnerstag fehlten aus meiner Sicht drei zentrale Informationen.',
      'Ich möchte zuerst konkret beschreiben, was ich beobachtet habe.'
    ]
  },
  {
    title: 'Wirkung',
    phrases: [
      'Das hat dazu geführt, dass das Team kurzfristig nacharbeiten musste.',
      'Bei mir entsteht dadurch der Eindruck, dass wir früher klären müssen, wenn etwas nicht reicht.',
      'Für die Planung macht es einen Unterschied, ob wir uns auf den Termin verlassen können.'
    ]
  },
  {
    title: 'Wunsch',
    phrases: [
      'Ich wünsche mir, dass du künftig spätestens am Vortag meldest, wenn ein Termin wackelt.',
      'Lass uns vereinbaren, welche Informationen in der Übergabe zwingend drin sein müssen.',
      'Was brauchst du, damit das beim nächsten Mal verbindlich klappt?'
    ]
  },
  {
    title: 'Öffnen',
    phrases: [
      'Ich schätze deine fachliche Arbeit und möchte verstehen, was zuletzt im Weg stand.',
      'Wie hast du die Situation selbst erlebt?',
      'Was wäre aus deiner Sicht ein realistischer nächster Schritt?'
    ]
  }
]

export const simulationTemplates: SimulationTemplate[] = [
  {
    id: 'lukas-berger',
    pattern: 'Defensiver Leistungsträger',
    typicalSentence: 'Die Vorgaben waren einfach nicht klar.',
    exercise: 'WWW-Feedback, echte Wertschätzung, offene Fragen',
    learningGoal: 'Ein schwieriges Feedbackgespräch klar, wertschätzend und verbindlich führen.',
    successCriteria: 'Du formulierst Wahrnehmung, Wirkung und Wunsch konkret und öffnest Lukas mit Anerkennung und offenen Fragen.',
    goodIntervention: 'Lukas, ich schätze deine fachliche Stärke. Gleichzeitig möchte ich konkret anschauen, was bei den letzten zwei Terminen passiert ist und was wir fürs nächste Mal vereinbaren.',
    commonMistake: 'Mit Vorwürfen, Pauschalisierungen oder schnellen Lösungen starten.',
    scenario: defaultScenario,
    targetAudience: defaultTargetAudience,
    persona: {
      name: 'Lukas Berger',
      background: '34, seit vier Jahren im Team. Fachlich stark und geschätzt. In den letzten Wochen haben zwei Deadlines nicht gehalten und eine Übergabe war so unvollständig, dass Kolleginnen und Kollegen nacharbeiten mussten.',
      motivation: 'Lukas möchte als kompetenter Leistungsträger gesehen werden. Er öffnet sich, wenn seine fachliche Stärke ernsthaft anerkannt wird und die Führungskraft mit offenen Fragen arbeitet.',
      painPoints: ['Fühlt sich schnell zu wenig wertgeschätzt', 'Reagiert bei Kritik defensiv', 'Weicht auf unklare Vorgaben aus', 'Schiebt Verantwortung teilweise auf Umstände oder andere Beteiligte'],
      decisionBehavior: 'Zu Beginn freundlich und zugewandt. Bei Vorwürfen rechtfertigt er sich mit Sätzen wie «die Vorgaben waren unklar» oder «ich war ja nicht allein daran». Bei echter Wertschätzung und offenen Fragen wird er kooperativer.',
      tone: 'Freundlich, fachlich selbstbewusst, bei Kritik defensiv, bei Wertschätzung zugänglich und zunehmend kooperativ.'
    }
  }
]

export function buildTrainingContext(input: {
  scenario: string
  targetAudience: string
  trainingFocus: string
  difficulty: string
}) {
  return {
    scenario: [
      input.scenario,
      'Trainingsfokus: schwieriges Feedbackgespräch nach dem WWW-Modell.',
      'Lukas Berger bleibt dieselbe Person: freundlich am Anfang, defensiv bei Kritik, kooperativer bei echter Wertschätzung und offenen Fragen.'
    ].join('\n'),
    targetAudience: [
      input.targetAudience,
      'Sicherer Übungsraum für Führungskräfte. Persona und Coach bleiben getrennte Rollen.'
    ].join('\n')
  }
}
