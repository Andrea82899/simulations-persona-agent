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

export const defaultScenario = 'Interventionstechniken im Mitarbeitendengespräch trainieren. Fokus auf Reframing, Grenzen setzen, Kontakt herstellen, Stille aushalten, Deeskalation und Gesprächsfokus halten.'
export const defaultTargetAudience = 'Simulationspersonen für Führungskräfte, Coaches und Trainerinnen in der Schweiz. Die Personas reagieren realistisch, bleiben aber im Rahmen eines konstruktiven Trainingssettings.'

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
    title: 'Meeting retten',
    focus: 'Fokus halten',
    fit: 'Projektmeeting entgleitet',
    scenario: 'Ein Projektmeeting verliert den Fokus. Mehrere Beteiligte bringen alte Erfahrungen, Seitenthemen und verdeckte Bedenken ein. Trainiert wird, das Gespräch ruhig zu strukturieren und wieder auf den nächsten konkreten Schritt zu führen.'
  },
  {
    title: 'Feedback geben',
    focus: 'Emotion anerkennen',
    fit: 'Feedbackgespräch mit starker Reaktion',
    scenario: 'Ein Feedbackgespräch wird anspruchsvoll, weil die angesprochene Person ausweicht, stark reagiert oder den Fokus verschiebt. Trainiert wird, klar zu bleiben, Beziehung zu halten und die Sachebene nicht zu verlieren.'
  },
  {
    title: 'Widerstand nutzen',
    focus: 'Reframing',
    fit: 'Skepsis gegen Veränderung',
    scenario: 'Ein Team reagiert zurückhaltend auf eine Veränderung. Es gibt Skepsis, direkte Grenzen und unausgesprochene Einwände. Trainiert wird, Interessen hinter Positionen zu erkennen und tragfähige nächste Schritte zu vereinbaren.'
  },
  {
    title: 'Grenzen setzen',
    focus: 'Grenzen setzen',
    fit: 'Dominante Führungskraft im Raum',
    scenario: 'Eine dominante Führungskraft beansprucht im Gespräch viel Redezeit, unterbricht andere und wertet Beiträge implizit ab. Trainiert wird, klar zu stoppen, Raum für andere Stimmen zu schaffen und Eskalation zu vermeiden.'
  },
  {
    title: 'Stille lesen',
    focus: 'Stille aushalten',
    fit: 'Stiller Widerstand',
    scenario: 'Eine Person nickt im Gespräch, bleibt innerlich aber auf Distanz und sagt kaum etwas. Trainiert wird, Kontakt herzustellen, einfache offene Fragen zu stellen und Stille nicht vorschnell zu füllen.'
  },
  {
    title: 'Ablehnung klären',
    focus: 'Interessen klären',
    fit: 'Direkte Grenze oder Nein',
    scenario: 'Eine Person lehnt eine Aufgabe direkt ab oder grenzt sich klar ab. Trainiert wird, die Grenze nicht persönlich zu nehmen, Verantwortlichkeiten sauber zu klären und Interessen hinter der Position sichtbar zu machen.'
  },
  {
    title: 'Konflikt moderieren',
    focus: 'Konflikt moderieren',
    fit: 'Zwei Teammitglieder verhaken sich',
    scenario: 'Zwei Teammitglieder geraten in eine festgefahrene Diskussion. Beide wiederholen ihre Position, während das Team wartet. Trainiert wird, Beiträge zu ordnen, Interessen zu trennen und den nächsten fairen Klärungsschritt zu setzen.'
  },
  {
    title: 'Verbindlichkeit schaffen',
    focus: 'Verbindlichkeit schaffen',
    fit: 'Strategie-Workshop ohne Entscheidung',
    scenario: 'Ein Strategie-Workshop bleibt angenehm, aber unverbindlich. Themen werden charmant verschoben, Entscheidungen bleiben offen und niemand möchte festlegen, wer was übernimmt. Trainiert wird, freundlich zu strukturieren und konkrete Zusagen einzuholen.'
  },
  {
    title: 'Leistung ansprechen',
    focus: 'Klarheit schaffen',
    fit: 'Leistungsproblem im Alltag',
    scenario: 'Eine Führungskraft muss ein wiederkehrendes Leistungsproblem ansprechen, ohne die Person abzuwerten oder in Rechtfertigungen zu versinken. Trainiert wird, Beobachtung, Wirkung und nächsten Schritt sauber zu trennen.'
  },
  {
    title: 'Entscheidung vorbereiten',
    focus: 'Entscheidung vorbereiten',
    fit: 'Steering Committee',
    scenario: 'Ein Steering Committee verlangt Tempo, während operative Einwände sichtbar werden. Trainiert wird, dominante Stimmen zu begrenzen, stille Stimmen einzubinden und Entscheidungen sauber vorzubereiten.'
  }
]

export const phraseLibrary: PhraseGroup[] = [
  {
    title: 'Fokus zurückführen',
    phrases: [
      'Ich nehme den Punkt auf. Für den Moment möchte ich kurz zum ursprünglichen Thema zurück.',
      'Lass uns das separat festhalten und jetzt den nächsten konkreten Schritt klären.',
      'Ich stoppe kurz, damit wir den Faden behalten.'
    ]
  },
  {
    title: 'Grenzen setzen',
    phrases: [
      'Ich unterbreche kurz, weil ich sicherstellen möchte, dass auch andere Perspektiven Platz haben.',
      'Der Punkt ist angekommen. Ich möchte jetzt eine zweite Einschätzung hören.',
      'So kommen wir gerade nicht weiter. Ich schlage vor, wir ordnen zuerst die Fakten.'
    ]
  },
  {
    title: 'Emotion anerkennen',
    phrases: [
      'Ich sehe, dass dich das gerade beschäftigt. Gleichzeitig möchte ich beim Thema bleiben.',
      'Das ist ein wichtiger Moment. Wir nehmen kurz Tempo raus und klären dann den nächsten Punkt.',
      'Danke, dass du das zeigst. Lass uns anschauen, was du konkret brauchst.'
    ]
  },
  {
    title: 'Stille nutzen',
    phrases: [
      'Ich lasse dir einen Moment Zeit. Mich interessiert, was bei dir gerade wichtig ist.',
      'Du musst nicht sofort antworten. Was wäre ein erster Gedanke?',
      'Ich bleibe kurz bei der Frage.'
    ]
  }
]

export const simulationTemplates: SimulationTemplate[] = [
  {
    id: 'hansueli',
    pattern: 'Pragmatischer Skeptiker',
    typicalSentence: 'Mir muss zuerst klar sein, was das konkret bringt.',
    exercise: 'Nutzen klaeren, Einwaende strukturieren, naechsten Schritt vereinbaren',
    learningGoal: 'Konservative Zurueckhaltung respektvoll aufnehmen und auf konkrete Bedingungen fuer Gelingen fuehren.',
    successCriteria: 'Du anerkennst Erfahrung, klaerst den praktischen Nutzen und vereinbarst einen ueberschaubaren naechsten Schritt.',
    goodIntervention: 'Hansueli, das ist ein fairer Punkt. Was muesste fuer dich konkret sichtbar sein, damit du den naechsten Schritt mittragen kannst?',
    commonMistake: 'Ihn mit abstrakten Visionen oder Tempo ueberzeugen wollen.',
    scenario: 'Interventionstraining mit Hansueli: Ein erfahrener Schweizer Mitarbeitender prueft neue Vorschlaege vorsichtig, will konkrete Vorteile sehen und achtet auf Stabilitaet, Kosten und Verantwortung.',
    targetAudience: 'Hansueli, 56, er/ihm. Weiss, konservativ, erfahren, bodenstaendig und pragmatisch. Geeignet fuer Trainings zu Reframing, Nutzenklaerung und konstruktivem Umgang mit Zurueckhaltung.',
    persona: {
      name: 'Hansueli',
      background: '56, er/ihm. Weiss, konservativ, seit vielen Jahren in einem Schweizer Unternehmen. Legt Wert auf Verlaesslichkeit, Eigenverantwortung, klare Rollen und Loesungen, die im Alltag funktionieren.',
      motivation: 'Er will wissen, was ein Vorschlag konkret bringt, wer Verantwortung uebernimmt und wie der Betrieb stabil bleibt.',
      painPoints: ['Unklare Nutzenargumente', 'Zu viel Tempo ohne belastbaren Plan', 'Abstrakte Begriffe ohne Alltagstest', 'Wunsch nach klaren Verantwortlichkeiten'],
      decisionBehavior: 'Muster: Pragmatischer Skeptiker. Typischer Satz: «Mir muss zuerst klar sein, was das konkret bringt.» Übungsfeld: Nutzen klaeren, Einwaende strukturieren, naechsten Schritt vereinbaren.',
      tone: 'Schweizerisch, bodenstaendig, direkt, knapp, loesungsorientiert und konservativ-pragmatisch.'
    }
  },
  {
    id: 'susanne-moser',
    pattern: 'Analytische Entscheiderin',
    typicalSentence: 'Das ist mir noch zu wenig belastbar.',
    exercise: 'Klarheit schaffen, Kriterien pruefen, Entscheidung vorbereiten',
    learningGoal: 'Eine anspruchsvolle Entscheiderin durch klare Struktur, Fakten und Optionen ins Gespraech holen.',
    successCriteria: 'Du fasst sauber zusammen, benennst offene Punkte und fuehrst zu einer pruefbaren Entscheidungsvorlage.',
    goodIntervention: 'Frau Dr. Moser, ich ordne kurz: Was ist belegt, was ist Annahme, und welcher Punkt fehlt Ihnen fuer eine tragfaehige Entscheidung?',
    commonMistake: 'Mit vagen Aussagen, Bauchgefuehl oder zu schnellen Zusagen arbeiten.',
    scenario: 'Interventionstraining mit Dr. Susanne Moser: Eine erfahrene Entscheiderin verlangt belastbare Argumente, klare Kriterien und eine saubere Auslegeordnung, bevor sie eine Richtung mittraegt.',
    targetAudience: 'Dr. Susanne Moser, 52, sie/ihr. Schweizer Fuehrungskraft mit analytischem Anspruch, hoher Verantwortung und klarer Erwartung an Struktur.',
    persona: {
      name: 'Dr. Susanne Moser',
      background: '52, sie/ihr. Schweizer Fuehrungskraft mit Doktortitel, langjaehriger Erfahrung und hoher Verantwortung. Sie denkt strukturiert, fragt praezise nach und laesst sich von sauberer Argumentation ueberzeugen.',
      motivation: 'Sie will Risiken, Entscheidungsgrundlagen und Wirkung nachvollziehen koennen, bevor sie Ressourcen oder Reputation einsetzt.',
      painPoints: ['Unklare Entscheidungsgrundlagen', 'Vermischung von Fakten und Annahmen', 'Zu wenig Kriterien fuer Priorisierung', 'Bedarf nach sauberer Auslegeordnung'],
      decisionBehavior: 'Muster: Analytische Entscheiderin. Typischer Satz: «Das ist mir noch zu wenig belastbar.» Übungsfeld: Klarheit schaffen, Kriterien pruefen, Entscheidung vorbereiten.',
      tone: 'Praezise, sachlich, ruhig, anspruchsvoll und schweizerisch professionell.'
    }
  },
  {
    id: 'bernd',
    pattern: 'Dominant',
    typicalSentence: 'Ja, aber das funktioniert so nicht.',
    exercise: 'Grenzen setzen ohne Eskalation, Raum für andere schaffen',
    learningGoal: 'Redezeit begrenzen, ohne einen Machtkampf zu eröffnen.',
    successCriteria: 'Du stoppst klar, benennst den Gesprächsrahmen und gibst anderen Stimmen aktiv Raum.',
    goodIntervention: 'Bernd, ich stoppe kurz. Deine Einschätzung ist klar. Jetzt möchte ich zwei andere Perspektiven hören.',
    commonMistake: 'Mit Bernd fachlich ringen, bis alle anderen innerlich aussteigen.',
    scenario: 'Interventionstraining mit Bernd: Ein fachlich erfahrener Abteilungsleiter beansprucht viel Redezeit und unterbricht aus Gewohnheit.',
    targetAudience: 'Bernd, 61, er/ihm. Abteilungsleiter mit klassischer Karriere und viel fachlicher Erfahrung.',
    persona: {
      name: 'Bernd',
      background: '61, er/ihm. Abteilungsleiter, fachlich erfahren, klassische Karriere. Hat ueber lange Zeit wenig kritisches Feedback erhalten und ist gewohnt, Gespraeche rasch zu praegen.',
      motivation: 'Er will fachliche Qualität sichern, Kontrolle behalten und vermeiden, dass aus seiner Sicht unausgereifte Vorschläge zu schnell umgesetzt werden.',
      painPoints: ['Beansprucht viel Redezeit', 'Unterbricht aus Gewohnheit', 'Implizite Abwertung anderer Beiträge', 'Hoher Anspruch an fachliche Sicherheit'],
      decisionBehavior: 'Muster: Dominant. Typischer Satz: «Ja, aber das funktioniert so nicht.» Übungsfeld: Grenzen setzen ohne Eskalation, Raum für andere schaffen.',
      tone: 'Bestimmt, fachlich sicher, knapp, konservativ-pragmatisch und direkt.'
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
      `Trainingsfokus: ${input.trainingFocus}.`,
      `Schwierigkeitsgrad: ${input.difficulty}.`,
      input.difficulty === 'leicht'
        ? 'Die Persona reagiert grundsätzlich kooperativ und zeigt das Muster dosiert.'
        : input.difficulty === 'schwer'
          ? 'Die Persona bleibt deutlich im Muster, testet Interventionen aktiv und gibt erst nach, wenn die Intervention klar, respektvoll und fokussiert ist.'
          : 'Die Persona bleibt erkennbar im Muster, reagiert aber auf gute Interventionen schrittweise konstruktiver.'
    ].join('\n'),
    targetAudience: [
      input.targetAudience,
      `Trainingssetting für ${input.trainingFocus} auf Stufe ${input.difficulty}.`
    ].join('\n')
  }
}
