<script setup lang="ts">
import type { CoachFeedback, PersonaProfile, StoredSession } from '../types/persona'

type SessionListItem = {
  id: number
  scenario: string
  targetAudience: string
  createdAt: string
  personaName: string
}

type SimulationTemplate = {
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

type ScenarioPreset = {
  title: string
  focus: string
  fit: string
  scenario: string
}

type PhraseGroup = {
  title: string
  phrases: string[]
}

const scenario = ref('Interventionstechniken im Mitarbeitendengespräch trainieren. Fokus auf Reframing, Grenzen setzen, Kontakt herstellen, Stille aushalten, Deeskalation und Gesprächsfokus halten.')
const targetAudience = ref('Simulationspersonen für Führungskräfte, Coaches und Trainerinnen in der Schweiz. Die Personas reagieren realistisch, bleiben aber im Rahmen eines konstruktiven Trainingssettings.')
const trainingFocus = ref('Fokus halten')
const difficulty = ref('mittel')
const currentSession = ref<StoredSession | null>(null)
const sessions = ref<SessionListItem[]>([])
const pending = ref(false)
const chatMessage = ref('')
const errorMessage = ref('')
const revisedAnswers = ref<Record<number, string>>({})
const scenarioPresets: ScenarioPreset[] = [
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
const phraseLibrary: PhraseGroup[] = [
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
const templates: SimulationTemplate[] = [
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

const persona = computed(() => currentSession.value?.persona || null)
const messages = computed(() => currentSession.value?.messages || [])
const userMessageCount = computed(() => messages.value.filter((message) => message.role === 'user').length)
const nextAutoFeedbackIn = computed(() => {
  if (!persona.value) return 10
  const rest = userMessageCount.value % 10
  return rest === 0 ? 10 : 10 - rest
})
const coachFeedbackByMessageId = computed(() => {
  return Object.fromEntries(
    (currentSession.value?.coachFeedback || []).map((feedback) => [feedback.userMessageId, feedback])
  ) as Record<number, CoachFeedback>
})
const summary = computed(() => currentSession.value?.summary || null)
const pendingLabel = computed(() => {
  if (!pending.value) return ''
  if (!persona.value) return 'Das lokale Modell erzeugt eine neue Persona.'
  return 'Die Persona antwortet kurz.'
})

async function loadSessions() {
  sessions.value = await $fetch<SessionListItem[]>('/api/sessions')
}

function trainingContext(baseScenario: string, baseTargetAudience: string) {
  return {
    scenario: [
      baseScenario,
      `Trainingsfokus: ${trainingFocus.value}.`,
      `Schwierigkeitsgrad: ${difficulty.value}.`,
      difficulty.value === 'leicht'
        ? 'Die Persona reagiert grundsätzlich kooperativ und zeigt das Muster dosiert.'
        : difficulty.value === 'schwer'
          ? 'Die Persona bleibt deutlich im Muster, testet Interventionen aktiv und gibt erst nach, wenn die Intervention klar, respektvoll und fokussiert ist.'
          : 'Die Persona bleibt erkennbar im Muster, reagiert aber auf gute Interventionen schrittweise konstruktiver.'
    ].join('\n'),
    targetAudience: [
      baseTargetAudience,
      `Trainingssetting für ${trainingFocus.value} auf Stufe ${difficulty.value}.`
    ].join('\n')
  }
}

function applyScenarioPreset(preset: ScenarioPreset) {
  scenario.value = preset.scenario
  trainingFocus.value = preset.focus
  errorMessage.value = ''
}

async function startSimulation() {
  errorMessage.value = ''
  pending.value = true
  try {
    const context = trainingContext(scenario.value, targetAudience.value)
    const generatedPersona = await $fetch<PersonaProfile>('/api/personas/generate', {
      method: 'POST',
      body: {
        scenario: context.scenario,
        targetAudience: context.targetAudience
      }
    })

    currentSession.value = await $fetch<StoredSession>('/api/sessions', {
      method: 'POST',
      body: {
        scenario: context.scenario,
        targetAudience: context.targetAudience,
        persona: generatedPersona
      }
    })
    await loadSessions()
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Die Persona konnte nicht erzeugt werden.'
  } finally {
    pending.value = false
  }
}

async function startTemplateSimulation(template: SimulationTemplate) {
  errorMessage.value = ''
  pending.value = true
  try {
    const context = trainingContext(template.scenario, template.targetAudience)
    currentSession.value = await $fetch<StoredSession>('/api/sessions', {
      method: 'POST',
      body: {
        scenario: context.scenario,
        targetAudience: context.targetAudience,
        persona: template.persona
      }
    })
    scenario.value = context.scenario
    targetAudience.value = context.targetAudience
    chatMessage.value = ''
    revisedAnswers.value = {}
    await loadSessions()
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Die Vorlage konnte nicht gestartet werden.'
  } finally {
    pending.value = false
  }
}

async function sendMessage() {
  if (!currentSession.value || !chatMessage.value.trim()) return

  const message = chatMessage.value.trim()
  chatMessage.value = ''
  errorMessage.value = ''
  pending.value = true
  try {
    currentSession.value = await $fetch<StoredSession>('/api/chat', {
      method: 'POST',
      body: {
        sessionId: currentSession.value.id,
        message
      }
    })
  } catch (error: any) {
    chatMessage.value = message
    errorMessage.value = error?.statusMessage || error?.message || 'Die Persona konnte nicht antworten.'
  } finally {
    pending.value = false
  }
}

async function requestCoachFeedback() {
  if (!currentSession.value || userMessageCount.value === 0) return

  errorMessage.value = ''
  pending.value = true
  try {
    currentSession.value = await $fetch<StoredSession>(`/api/sessions/${currentSession.value.id}/coach`, {
      method: 'POST'
    })
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Das Coach-Feedback konnte nicht erzeugt werden.'
  } finally {
    pending.value = false
  }
}

async function createSummary() {
  if (!currentSession.value) return

  errorMessage.value = ''
  pending.value = true
  try {
    currentSession.value = await $fetch<StoredSession>(`/api/sessions/${currentSession.value.id}/summary`, {
      method: 'POST'
    })
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Die Zusammenfassung konnte nicht erzeugt werden.'
  } finally {
    pending.value = false
  }
}

async function openSession(id: number) {
  errorMessage.value = ''
  currentSession.value = await $fetch<StoredSession>(`/api/sessions/${id}`)
}

function resetSimulation() {
  currentSession.value = null
  chatMessage.value = ''
  errorMessage.value = ''
  revisedAnswers.value = {}
}

onMounted(loadSessions)
</script>

<template>
  <main class="shell">
    <section class="workspace">
      <aside class="sidebar">
        <div>
          <p class="eyebrow">Lokaler Agent</p>
          <h1>Swiss Persona Simulation</h1>
        </div>

        <button class="secondary full-width" @click="resetSimulation">
          Neue Simulation
        </button>

        <div class="history">
          <h2>Gespeicherte Simulationen</h2>
          <button
            v-for="item in sessions"
            :key="item.id"
            class="history-item"
            :class="{ active: currentSession?.id === item.id }"
            @click="openSession(item.id)"
          >
            <strong>{{ item.personaName }}</strong>
            <span>{{ item.scenario }}</span>
          </button>
          <p v-if="sessions.length === 0" class="muted">
            Noch keine gespeicherten Simulationen.
          </p>
        </div>
      </aside>

      <section class="main-panel">
        <section class="training-controls">
          <div>
            <p class="eyebrow">Trainingsmodus</p>
            <h2>Fokus und Schwierigkeit</h2>
          </div>
          <div class="control-grid">
            <label>
              <span>Trainingsfokus</span>
              <select v-model="trainingFocus">
                <option>Fokus halten</option>
                <option>Reframing</option>
                <option>Grenzen setzen</option>
                <option>Stille aushalten</option>
                <option>Emotion anerkennen</option>
                <option>Interessen klären</option>
                <option>Konflikt moderieren</option>
                <option>Verbindlichkeit schaffen</option>
                <option>Klarheit schaffen</option>
                <option>Entscheidung vorbereiten</option>
              </select>
            </label>
            <label>
              <span>Schwierigkeit</span>
              <select v-model="difficulty">
                <option value="leicht">Leicht</option>
                <option value="mittel">Mittel</option>
                <option value="schwer">Schwer</option>
              </select>
            </label>
          </div>
          <div class="preset-grid">
            <button
              v-for="preset in scenarioPresets"
              :key="preset.title"
              class="preset-card"
              type="button"
              @click="applyScenarioPreset(preset)"
            >
              <strong>{{ preset.title }}</strong>
              <span>{{ preset.focus }}</span>
              <small>{{ preset.fit }}</small>
            </button>
          </div>
        </section>

        <section class="template-section">
          <div>
            <p class="eyebrow">Interventionstechniken</p>
            <h2>Simulationspersonas</h2>
          </div>
          <div class="template-grid">
            <article v-for="template in templates" :key="template.id" class="template-card">
              <div>
                <p class="eyebrow">{{ template.pattern }}</p>
                <h3>{{ template.persona.name }}</h3>
                <p>{{ template.persona.background }}</p>
              </div>
              <div class="template-meta">
                <span>{{ template.typicalSentence }}</span>
                <small>{{ template.exercise }}</small>
              </div>
              <dl class="template-learning">
                <div>
                  <dt>Lernziel</dt>
                  <dd>{{ template.learningGoal }}</dd>
                </div>
                <div>
                  <dt>Gute Intervention</dt>
                  <dd>{{ template.goodIntervention }}</dd>
                </div>
                <div>
                  <dt>Typische Falle</dt>
                  <dd>{{ template.commonMistake }}</dd>
                </div>
              </dl>
              <button class="secondary" :disabled="pending" @click="startTemplateSimulation(template)">
                Starten
              </button>
            </article>
          </div>
        </section>

        <div class="setup">
          <label>
            <span>Szenario</span>
            <textarea v-model="scenario" rows="4" />
          </label>
          <label>
            <span>Zielgruppe</span>
            <textarea v-model="targetAudience" rows="4" />
          </label>
          <button class="primary" :disabled="pending" @click="startSimulation">
            {{ pending ? 'Generiere Persona...' : 'Neue Persona generieren' }}
          </button>
        </div>
        <p v-if="pending" class="pending-note">
          {{ pendingLabel }} Das kann lokal einen Moment dauern.
        </p>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>

        <section v-if="persona" class="persona-grid">
          <article class="persona-panel">
            <p class="eyebrow">Aktive Persona</p>
            <h2>{{ persona.name }}</h2>
            <p>{{ persona.background }}</p>
            <dl>
              <div>
                <dt>Motivation</dt>
                <dd>{{ persona.motivation }}</dd>
              </div>
              <div>
                <dt>Entscheidung</dt>
                <dd>{{ persona.decisionBehavior }}</dd>
              </div>
              <div>
                <dt>Schweizer Tonalität</dt>
                <dd>{{ persona.tone }}</dd>
              </div>
            </dl>
            <div class="chips">
              <span v-for="point in persona.painPoints" :key="point">{{ point }}</span>
            </div>
          </article>

          <article class="chat-panel">
            <div class="chat-header">
              <div>
                <p class="eyebrow">Freier Chat</p>
                <h2>Simulation</h2>
                <p class="muted small-note">
                  Coach-Feedback automatisch nach 10 Antworten oder jederzeit auf Nachfrage.
                  Nächster Auto-Impuls in {{ nextAutoFeedbackIn }}.
                </p>
              </div>
              <div class="chat-actions">
                <button class="secondary" :disabled="pending || userMessageCount === 0" @click="requestCoachFeedback">
                  Coach-Feedback
                </button>
                <button class="secondary" :disabled="pending || messages.length === 0" @click="createSummary">
                  Zusammenfassen
                </button>
              </div>
            </div>

            <div class="messages">
              <p v-if="messages.length === 0" class="muted">
                Stelle der Persona die erste Frage.
              </p>
              <div
                v-for="message in messages"
                :key="message.id"
                class="message"
                :class="message.role"
              >
                <span>{{ message.role === 'user' ? 'Du' : persona.name }}</span>
                <p>{{ message.content }}</p>
                <article v-if="message.role === 'user' && coachFeedbackByMessageId[message.id]" class="coach-card">
                  <p class="eyebrow">Trainingscoach</p>
                  <dl>
                    <div>
                      <dt>Wirkung</dt>
                      <dd>{{ coachFeedbackByMessageId[message.id]?.effect || '' }}</dd>
                    </div>
                    <div>
                      <dt>Technik</dt>
                      <dd>{{ coachFeedbackByMessageId[message.id]?.technique || '' }}</dd>
                    </div>
                    <div>
                      <dt>Nächster Schritt</dt>
                      <dd>{{ coachFeedbackByMessageId[message.id]?.improvement || '' }}</dd>
                    </div>
                    <div>
                      <dt>Alternative</dt>
                      <dd>{{ coachFeedbackByMessageId[message.id]?.alternative || '' }}</dd>
                    </div>
                  </dl>
                  <label class="revision-field">
                    <span>Bessere Antwort üben</span>
                    <textarea
                      v-model="revisedAnswers[message.id]"
                      rows="3"
                      placeholder="Formuliere deine Antwort noch einmal klarer..."
                    />
                  </label>
                </article>
              </div>
            </div>

            <form class="composer" @submit.prevent="sendMessage">
              <input v-model="chatMessage" placeholder="Nachricht an die Persona..." :disabled="pending" />
              <button class="primary" :disabled="pending || !chatMessage.trim()">Senden</button>
            </form>
          </article>
        </section>

        <section class="phrase-library">
          <div>
            <p class="eyebrow">Werkzeugkasten</p>
            <h2>Formulierungsbibliothek</h2>
          </div>
          <div class="phrase-grid">
            <article v-for="group in phraseLibrary" :key="group.title">
              <h3>{{ group.title }}</h3>
              <ul>
                <li v-for="phrase in group.phrases" :key="phrase">{{ phrase }}</li>
              </ul>
            </article>
          </div>
        </section>

        <section v-if="summary" class="summary">
          <h2>Auswertung</h2>
          <div class="summary-grid">
            <article>
              <h3>Insights</h3>
              <ul><li v-for="item in summary.insights" :key="item">{{ item }}</li></ul>
            </article>
            <article>
              <h3>Bedürfnisse</h3>
              <ul><li v-for="item in summary.needs" :key="item">{{ item }}</li></ul>
            </article>
            <article>
              <h3>Klärungspunkte</h3>
              <ul><li v-for="item in summary.objections" :key="item">{{ item }}</li></ul>
            </article>
            <article>
              <h3>Muster</h3>
              <ul><li v-for="item in summary.patterns" :key="item">{{ item }}</li></ul>
            </article>
            <article>
              <h3>Empfehlungen</h3>
              <ul><li v-for="item in summary.recommendations" :key="item">{{ item }}</li></ul>
            </article>
            <article v-if="summary.teamLearning?.length">
              <h3>Team-Lernen</h3>
              <ul><li v-for="item in summary.teamLearning" :key="item">{{ item }}</li></ul>
            </article>
            <article v-if="summary.practiceSentences?.length">
              <h3>Übungssätze</h3>
              <ul><li v-for="item in summary.practiceSentences" :key="item">{{ item }}</li></ul>
            </article>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
