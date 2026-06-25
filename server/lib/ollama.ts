import { CoachFeedbackSchema, PersonaSchema, SummarySchema } from './schemas'
import type { ChatMessage, CoachFeedback, PersonaProfile, SessionSummary } from '../../types/persona'

type OllamaMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type OllamaCallOptions = {
  temperature?: number
  numPredict?: number
  timeoutMs?: number
}

async function callOllama(messages: OllamaMessage[], options: OllamaCallOptions = {}) {
  const config = useRuntimeConfig()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 90000)

  let response: Response

  try {
    response = await fetch(`${config.ollamaHost}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.ollamaModel,
        messages,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.65,
          num_ctx: 4096,
          num_predict: options.numPredict ?? 420
        }
      })
    })
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw createError({
        statusCode: 504,
        statusMessage: 'Das lokale Modell braucht zu lange. Bitte nochmals versuchen oder ein kleineres Ollama-Modell verwenden.'
      })
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Ollama ist gerade nicht erreichbar. Bitte prüfen, ob Ollama läuft.'
    })
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: `Ollama antwortet nicht korrekt (${response.status}). Läuft Ollama und ist das Modell installiert?`
    })
  }

  const payload = await response.json()
  return String(payload.message?.content || '').trim()
}

function parseJsonFromModel(content: string) {
  const jsonBlock = content.match(/```json\s*([\s\S]*?)```/i)?.[1]
  const candidate = jsonBlock || content.match(/\{[\s\S]*\}/)?.[0] || content
  return JSON.parse(candidate)
}

function swissSolutionText(value: string) {
  return value
    .replace(/überfordert/gi, 'mit Klärungsbedarf')
    .replace(/Überforderung/g, 'Klärungsbedarf')
    .replace(/überforderung/g, 'Klärungsbedarf')
    .replace(/\bChaos\b/g, 'Unklarheit')
    .replace(/\bchaos\b/g, 'Unklarheit')
    .replace(/\bVerwirrung\b/g, 'Orientierungsbedarf')
    .replace(/\bverwirrung\b/g, 'Orientierungsbedarf')
    .replace(/\bKrise\b/g, 'anspruchsvolle Phase')
    .replace(/\bkrise\b/g, 'anspruchsvolle Phase')
    .replace(/\bAngst\b/g, 'Zurückhaltung')
    .replace(/\bangst\b/g, 'Zurückhaltung')
    .replace(/\bScheitern\b/g, 'Verbesserungspotenzial')
    .replace(/\bscheitern\b/g, 'Verbesserungspotenzial')
    .replace(/\bSchmerz\b/g, 'Reibungspunkt')
    .replace(/\bschmerz\b/g, 'Reibungspunkt')
}

function swissSolutionValue<T>(value: T): T {
  if (typeof value === 'string') {
    return swissSolutionText(value) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => swissSolutionValue(item)) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, swissSolutionValue(item)])
    ) as T
  }

  return value
}

export async function generatePersona(scenario: string, targetAudience: string): Promise<PersonaProfile> {
  const content = await callOllama([
    {
      role: 'system',
      content: [
        'Du erzeugst realistische deutschsprachige Kunden- und Benutzerpersonas mit klarer Swissness.',
        'Swissness bedeutet: schweizerisch-pragmatisch, zuverlässig, zurückhaltend, präzise, respektvoll, qualitätsbewusst und lösungsorientiert.',
        'Halte alle Vorgaben aus der Zielgruppe strikt ein. Wenn Geschlecht, Alter, Herkunft, Weltanschauung oder beruflicher Kontext genannt sind, muss die Persona dazu passen.',
        'Wenn die Zielgruppe z. B. männlich, weiss, über 50 und konservativ beschreibt, erzeuge eine männliche Persona über 50 mit entsprechend sachlich-konservativer Prägung.',
        'Wähle einen in der Schweiz plausiblen Namen und einen schweizerisch passenden beruflichen oder privaten Kontext.',
        'Formuliere in Schweizer Hochdeutsch: verwende ss statt ß und vermeide bundesdeutsche Zuspitzungen.',
        'Vermeide problemfixierte oder dramatisierende Wörter wie Überforderung, überfordert, Chaos, Verwirrung, Krise, Angst, Scheitern oder Schmerz.',
        'Beschreibe Spannungsfelder konstruktiv, etwa als Prioritäten, Abstimmungsbedarf, Klärungsbedarf, Aufwand, offene Punkte oder Verbesserungspotenzial.',
        'Antworte ausschliesslich als valides JSON ohne Markdown.',
        'Schema: {"name":string,"background":string,"motivation":string,"painPoints":string[],"decisionBehavior":string,"tone":string}'
      ].join('\n')
    },
    {
      role: 'user',
      content: `Szenario:\n${scenario}\n\nZielgruppe:\n${targetAudience}\n\nErzeuge genau eine plausible Persona, die die Zielgruppe exakt erfüllt.`
    }
  ], { temperature: 0.55, numPredict: 420, timeoutMs: 90000 })

  return swissSolutionValue(PersonaSchema.parse(parseJsonFromModel(content)))
}

export async function generatePersonaReply(params: {
  scenario: string
  targetAudience: string
  persona: PersonaProfile
  messages: ChatMessage[]
  userMessage: string
}) {
  const history: OllamaMessage[] = params.messages.map((message) => ({
    role: message.role === 'user' ? 'user' : 'assistant',
    content: message.content
  }))

  const reply = await callOllama([
    {
      role: 'system',
      content: [
        'Du bist eine simulierte Kunden-/Benutzerpersona und bleibst streng in dieser Rolle.',
        'Du erwähnst nicht, dass du KI bist, und gibst keine Meta-Analyse im Chat.',
        'Wenn in der Persona ein Muster, ein typischer Satz oder ein Übungsfeld beschrieben ist, zeige dieses Verhalten natürlich im Gespräch, ohne das Muster oder Übungsfeld zu benennen.',
        'Bleibe trainingsrealistisch: herausfordernd genug zum Üben, aber nicht karikierend.',
        'Antworte natürlich, konkret und aus der Ich-Perspektive der Persona.',
        'Dein Ton strahlt Swissness aus: ruhig, verbindlich, qualitätsbewusst, pragmatisch und lösungsorientiert.',
        'Schreibe in Schweizer Hochdeutsch mit ss statt ß.',
        'Vermeide problemfixierte oder dramatisierende Wörter wie Überforderung, überfordert, Chaos, Verwirrung, Krise, Angst, Scheitern oder Schmerz.',
        'Wenn du Bedenken äusserst, formuliere sie konstruktiv als Klärungsbedarf, offene Punkte, Prioritäten, Aufwand oder nächste sinnvolle Schritte.',
        `Szenario: ${params.scenario}`,
        `Zielgruppe: ${params.targetAudience}`,
        `Persona: ${JSON.stringify(params.persona)}`
      ].join('\n')
    },
    ...history,
    { role: 'user', content: params.userMessage }
  ], { temperature: 0.7, numPredict: 260, timeoutMs: 90000 })

  return swissSolutionText(reply)
}

export async function generateCoachFeedback(params: {
  scenario: string
  targetAudience: string
  persona: PersonaProfile
  messages: ChatMessage[]
  userMessage: string
}): Promise<Omit<CoachFeedback, 'id' | 'sessionId' | 'userMessageId' | 'createdAt'>> {
  const transcript = params.messages
    .map((message) => `${message.role === 'user' ? 'Trainierende Person' : params.persona.name}: ${message.content}`)
    .join('\n')

  const content = await callOllama([
    {
      role: 'system',
      content: [
        'Du bist ein Trainingscoach für Interventionstechniken in Mitarbeitendengesprächen.',
        'Gib präzises, kurzes Feedback zur letzten Antwort der trainierenden Person.',
        'Bewerte Wirkung, erkannte Interventionstechnik, konkreten Verbesserungspunkt und eine bessere alternative Formulierung.',
        'Schreibe in Schweizer Hochdeutsch mit ss statt ß.',
        'Bleibe ruhig, konstruktiv, direkt und lösungsorientiert.',
        'Keine Meta-Erklärungen, keine Theorieblöcke, keine langen Listen.',
        'Vermeide problemfixierte oder dramatisierende Wörter wie Überforderung, überfordert, Chaos, Verwirrung, Krise, Angst, Scheitern oder Schmerz.',
        'Antworte ausschliesslich als valides JSON ohne Markdown.',
        'Schema: {"effect":string,"technique":string,"improvement":string,"alternative":string}'
      ].join('\n')
    },
    {
      role: 'user',
      content: [
        `Szenario: ${params.scenario}`,
        `Zielgruppe: ${params.targetAudience}`,
        `Persona: ${JSON.stringify(params.persona)}`,
        `Bisheriger Dialog:\n${transcript}`,
        `Letzte Antwort der trainierenden Person:\n${params.userMessage}`,
        'Erstelle ein kompaktes Coach-Feedback. Alternative als direkt nutzbaren Satz formulieren.'
      ].join('\n\n')
    }
  ], { temperature: 0.35, numPredict: 300, timeoutMs: 90000 })

  return swissSolutionValue(CoachFeedbackSchema.parse(parseJsonFromModel(content)))
}

export async function generateSummary(params: {
  scenario: string
  targetAudience: string
  persona: PersonaProfile
  messages: ChatMessage[]
}): Promise<SessionSummary> {
  const transcript = params.messages
    .map((message) => `${message.role === 'user' ? 'Fragende Person' : params.persona.name}: ${message.content}`)
    .join('\n')

  const content = await callOllama([
    {
      role: 'system',
      content: [
        'Du analysierst eine deutschsprachige Persona-Simulation.',
        'Die Auswertung soll Swissness ausstrahlen: sachlich, präzise, ruhig, verbindlich und lösungsorientiert.',
        'Schreibe in Schweizer Hochdeutsch mit ss statt ß.',
        'Vermeide problemfixierte oder dramatisierende Wörter wie Überforderung, überfordert, Chaos, Verwirrung, Krise, Angst, Scheitern oder Schmerz.',
        'Formuliere Einwände als konstruktive Klärungspunkte, Voraussetzungen, Prioritäten oder nächste Schritte.',
        'Antworte ausschliesslich als valides JSON ohne Markdown.',
        'Schema: {"insights":string[],"needs":string[],"objections":string[],"patterns":string[],"recommendations":string[],"teamLearning":string[],"practiceSentences":string[]}'
      ].join('\n')
    },
    {
      role: 'user',
      content: [
        `Szenario: ${params.scenario}`,
        `Zielgruppe: ${params.targetAudience}`,
        `Persona: ${JSON.stringify(params.persona)}`,
        `Dialog:\n${transcript}`,
        'Erstelle eine kompakte, lösungsorientierte Auswertung mit schweizerisch-sachlicher Tonalität.',
        'teamLearning beschreibt, was das Team künftig besser trainieren sollte.',
        'practiceSentences enthält direkt nutzbare Interventionssätze für den nächsten Durchlauf.'
      ].join('\n\n')
    }
  ], { temperature: 0.45, numPredict: 520, timeoutMs: 90000 })

  return swissSolutionValue(SummarySchema.parse(parseJsonFromModel(content)))
}
