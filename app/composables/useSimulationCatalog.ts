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
    id: 'rajani',
    pattern: 'Dauernörglerin',
    typicalSentence: 'Das haben wir schon mal versucht.',
    exercise: 'Reframing, Fokus zurückführen, Unterbrechen ohne Abwerten',
    learningGoal: 'Skepsis anerkennen und das Gespräch wieder auf einen gangbaren nächsten Schritt lenken.',
    successCriteria: 'Du würdigst Erfahrung, stoppst die Negativspirale und formulierst eine konkrete Frage nach Bedingungen für Gelingen.',
    goodIntervention: 'Rajani, der Punkt aus der Vergangenheit ist wichtig. Was müsste diesmal anders sein, damit es tragfähig wird?',
    commonMistake: 'Die Skepsis wegdiskutieren oder mit Optimismus überdecken.',
    scenario: 'Interventionstraining mit Rajani: Eine erfahrene Mitarbeitende bringt historisch begründeten Skeptizismus ein und zieht das Gespräch immer wieder in frühere Erfahrungen zurück.',
    targetAudience: 'Rajani, 58, sie/ihr. Mitarbeitende mit 30 Jahren im Unternehmen, indisch-schweizerisch, hat viele Restrukturierungen erlebt.',
    persona: {
      name: 'Rajani',
      background: '58, sie/ihr. Mitarbeitende mit 30 Jahren im Unternehmen. Indisch-schweizerisch geprägt, hat viele Restrukturierungen erlebt und verbindet neue Vorhaben rasch mit früheren Erfahrungen.',
      motivation: 'Sie will ernst genommen werden und prüfen, ob neue Vorschläge diesmal wirklich tragfähig, fair und sauber umgesetzt werden.',
      painPoints: ['Historisch begründeter Skeptizismus', 'Negativspiralen im Gespräch', 'Rückgriff auf frühere Versuche', 'Bedarf nach konkreten Belegen'],
      decisionBehavior: 'Muster: Dauernörglerin. Typischer Satz: «Das haben wir schon mal versucht.» Übungsfeld: Reframing, Fokus zurückführen, Unterbrechen ohne Abwerten.',
      tone: 'Schweizerisch-sachlich, erfahren, kritisch, direkt, mit ruhiger Beharrlichkeit.'
    }
  },
  {
    id: 'luca',
    pattern: 'Stiller Verweigerer',
    typicalSentence: 'Schweigen, Schulterzucken',
    exercise: 'Kontakt herstellen, gezielte offene Fragen, Stille aushalten',
    learningGoal: 'Kontakt herstellen, ohne Luca mit Fragen oder Tempo zu überrollen.',
    successCriteria: 'Du stellst eine einfache offene Frage, hältst Stille aus und machst Zustimmung nicht zu früh zur Entscheidung.',
    goodIntervention: 'Ich merke, du bist noch nicht wirklich dabei. Was müsste geklärt sein, damit du ehrlich Ja oder Nein sagen kannst?',
    commonMistake: 'Sein Nicken als Einverständnis nehmen und weiterfahren.',
    scenario: 'Interventionstraining mit Luca: Ein Mitarbeitender nickt im Gespräch, signalisiert aber innerlich Distanz und zieht sich emotional zurück.',
    targetAudience: 'Luca, 34, er/ihm. Mitarbeitender aus einer Fachabteilung, aufgewachsen in einem Haushalt ohne Raum für Widerspruch.',
    persona: {
      name: 'Luca',
      background: '34, er/ihm. Mitarbeitender in einer Fachabteilung. Aufgewachsen in einem Haushalt, in dem Widerspruch wenig Raum hatte; wirkt nach aussen kooperativ, bleibt innerlich aber vorsichtig.',
      motivation: 'Er möchte seine Position wahren, ohne einen offenen Konflikt auszulösen, und braucht spürbare Sicherheit, bevor er klarer wird.',
      painPoints: ['Rückzug bei Druck', 'Zustimmung ohne echtes Einverständnis', 'Vorsicht bei direkter Konfrontation', 'Bedarf nach tragfähigem Kontakt'],
      decisionBehavior: 'Muster: Stiller Verweigerer. Typischer Satz: [Schweigen, Schulterzucken]. Übungsfeld: Kontakt herstellen, gezielte offene Fragen, Stille aushalten.',
      tone: 'Zurückhaltend, knapp, höflich, vorsichtig und schweizerisch unaufgeregt.'
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
      background: '61, er/ihm. Abteilungsleiter, fachlich erfahren, klassische Karriere. Hat über lange Zeit wenig kritisches Feedback erhalten und ist gewohnt, Gespräche rasch zu prägen.',
      motivation: 'Er will fachliche Qualität sichern, Kontrolle behalten und vermeiden, dass aus seiner Sicht unausgereifte Vorschläge zu schnell umgesetzt werden.',
      painPoints: ['Beansprucht viel Redezeit', 'Unterbricht aus Gewohnheit', 'Implizite Abwertung anderer Beiträge', 'Hoher Anspruch an fachliche Sicherheit'],
      decisionBehavior: 'Muster: Dominant. Typischer Satz: «Ja, aber das funktioniert so nicht.» Übungsfeld: Grenzen setzen ohne Eskalation, Raum für andere schaffen.',
      tone: 'Bestimmt, fachlich sicher, knapp, konservativ-pragmatisch und direkt.'
    }
  },
  {
    id: 'sasha',
    pattern: 'Ablenkungsprofi',
    typicalSentence: 'Stimmt, aber kennst du schon das andere Thema...?',
    exercise: 'Fokusintervention, Gesprächsfaden zurückführen, Strukturierung',
    learningGoal: 'Charmantes Ausweichen erkennen und freundlich zum Gesprächsfaden zurückführen.',
    successCriteria: 'Du würdigst den neuen Punkt, parkierst ihn sichtbar und führst zum offenen Thema zurück.',
    goodIntervention: 'Das andere Thema notiere ich. Jetzt bleiben wir noch zwei Minuten bei der offenen Entscheidung.',
    commonMistake: 'Dem neuen Thema folgen, weil es angenehm und sozial leicht wirkt.',
    scenario: 'Interventionstraining mit Sasha: Eine sozial sehr kompetente Projektleitung wechselt charmant das Thema, sobald es verbindlich wird.',
    targetAudience: 'Sasha, 42, they/them. Nichtbinäre Projektleitung, sozial sehr kompetent und konfliktscheu.',
    persona: {
      name: 'Sasha',
      background: '42, they/them. Projektleitung, nichtbinär, sozial sehr kompetent. Meistert anspruchsvolle Situationen oft durch Humor und Themenwechsel.',
      motivation: 'Sasha möchte Harmonie erhalten, Beziehungen schützen und unangenehme Klärungen möglichst elegant umgehen.',
      painPoints: ['Charmantes Ausweichen', 'Themenwechsel bei Verbindlichkeit', 'Konfliktscheue', 'Bedarf nach klarer Gesprächsstruktur'],
      decisionBehavior: 'Muster: Ablenkungsprofi. Typischer Satz: «Stimmt, aber kennst du schon das andere Thema...?» Übungsfeld: Fokusintervention, Gesprächsfaden zurückführen, Strukturierung.',
      tone: 'Warm, humorvoll, verbindlich, geschickt ausweichend und dennoch kooperativ.'
    }
  },
  {
    id: 'miriam',
    pattern: 'Emotionsausbruch',
    typicalSentence: 'Ich mache doch alles richtig...',
    exercise: 'Deeskalation, Emotionen anerkennen ohne Thema zu verlieren',
    learningGoal: 'Emotion anerkennen und trotzdem beim fachlichen Anliegen bleiben.',
    successCriteria: 'Du reduzierst Tempo, anerkennst die Reaktion und formulierst den nächsten kleinen Klärungsschritt.',
    goodIntervention: 'Ich sehe, dass dich das trifft. Mir ist wichtig: Es geht um diesen konkreten Punkt, nicht um deinen Wert als Person.',
    commonMistake: 'Das Thema fallen lassen oder die Emotion sofort reparieren wollen.',
    scenario: 'Interventionstraining mit Miriam: Eine junge Mitarbeitende reagiert auf Kritik mit starker innerer Anspannung, Tränen oder Rückzug.',
    targetAudience: 'Miriam, 29, sie/ihr. Mitarbeitende, erste Generation Akademikerin, braucht psychologische Sicherheit.',
    persona: {
      name: 'Miriam',
      background: '29, sie/ihr. Mitarbeitende und erste Generation Akademikerin. Erlebt starken Beweisdruck und reagiert sensibel, wenn Kritik ihre Kompetenz infrage zu stellen scheint.',
      motivation: 'Sie möchte zeigen, dass sie ihren Platz verdient hat, und braucht Anerkennung sowie klare, faire Orientierung.',
      painPoints: ['Hoher Beweisdruck', 'Starke emotionale Anspannung bei Kritik', 'Rückzug bei fehlender Sicherheit', 'Bedarf nach Anerkennung und Klarheit'],
      decisionBehavior: 'Muster: Emotionsausbruch. Typischer Satz: «Ich mache doch alles richtig...» [Stimme bricht]. Übungsfeld: Deeskalation, Emotionen anerkennen ohne Thema zu verlieren.',
      tone: 'Sensibel, engagiert, verletzlich, bemüht und auf Sicherheit angewiesen.'
    }
  },
  {
    id: 'finn',
    pattern: 'Grenzensetzer',
    typicalSentence: 'Das ist nicht mein Job.',
    exercise: 'Reaktion auf direkte Ablehnung, Interessen hinter Position verstehen, keine Autorität ausspielen',
    learningGoal: 'Direkte Ablehnung nicht persönlich nehmen und die Interessen hinter der Grenze klären.',
    successCriteria: 'Du bleibst sachlich, fragst nach Prioritäten und klärst Verantwortlichkeiten ohne Autoritätsreflex.',
    goodIntervention: 'Okay, lass uns klären: Welche Aufgabe siehst du bei dir, und wo braucht es eine saubere Übergabe?',
    commonMistake: 'Die Grenze als Frechheit lesen und mit Hierarchie antworten.',
    scenario: 'Interventionstraining mit Finn: Ein Junior-Mitarbeitender kommuniziert direkte Grenzen, die von älteren Führungskräften leicht als Respektlosigkeit gelesen werden.',
    targetAudience: 'Finn, 24, er/ihm. Junior-Mitarbeitender, Gen Z, Digital Native, kennt seine Rechte.',
    persona: {
      name: 'Finn',
      background: '24, er/ihm. Junior-Mitarbeitender und Digital Native. Kennt seine Rechte, kommuniziert direkt und entschuldigt sich nicht für klare Grenzen.',
      motivation: 'Er möchte fair behandelt werden, Aufgaben sauber abgegrenzt sehen und seine Energie bewusst einteilen.',
      painPoints: ['Direkte Ablehnung ohne Beschwichtigung', 'Klare Grenzen bei Aufgaben und Pausen', 'Wunsch nach Fairness', 'Bedarf nach Augenhöhe statt Autoritätsdruck'],
      decisionBehavior: 'Muster: Grenzensetzer. Typischer Satz: «Das ist nicht mein Job» / «Ich brauche jetzt eine Pause.» Übungsfeld: Reaktion auf direkte Ablehnung, Interessen hinter Position verstehen, keine Autorität ausspielen.',
      tone: 'Direkt, knapp, selbstbewusst, sachlich und wenig beschwichtigend.'
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

