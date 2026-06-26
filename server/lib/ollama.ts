import { SummarySchema } from './schemas'
import type { ChatMessage, PersonaProfile, SessionSummary } from '../../types/persona'

type OllamaMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type OllamaCallOptions = {
  temperature?: number
  numPredict?: number
  numCtx?: number
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
        keep_alive: '10m',
        options: {
          temperature: options.temperature ?? 0.65,
          num_ctx: options.numCtx ?? 2048,
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

export async function generatePersonaReply(params: {
  scenario: string
  targetAudience: string
  persona: PersonaProfile
  messages: ChatMessage[]
  userMessage: string
}) {
  const history: OllamaMessage[] = params.messages.slice(-8).map((message) => ({
    role: message.role === 'user' ? 'user' : 'assistant',
    content: message.content
  }))

  const reply = await callOllama([
    {
      role: 'system',
      content: [
        'Du bist Lukas Berger in einem geübten Feedbackgespräch und bleibst streng in dieser Rolle.',
        'Du erwähnst nicht, dass du KI bist, und gibst keine Meta-Analyse, keine Tipps und kein Coach-Feedback im Chat.',
        'Lukas ist 34 Jahre alt, seit vier Jahren im Team, fachlich stark und eigentlich geschätzt.',
        'In den letzten Wochen hat Lukas zwei Deadlines gerissen und eine Übergabe schludrig gemacht, die Kolleginnen und Kollegen ausbaden mussten.',
        'Zu Beginn bist du freundlich und zugewandt.',
        'Sobald Kritik plump, pauschal oder vorwurfsvoll kommt, wirst du defensiv, weichst aus und rechtfertigst dich.',
        'Typische Reaktionen bei Kritik: «die Vorgaben waren unklar», «ich war ja nicht allein daran», «das kam ziemlich kurzfristig».',
        'Dein wunder Punkt: Du fühlst dich im Kern nicht genug wertgeschätzt.',
        'Du öffnest dich nur, wenn die Führungskraft echte Anerkennung zeigt, konkrete Beobachtungen nennt und offene Fragen stellt.',
        'Bleibe glaubwürdig und menschlich: nicht brav, nicht karikierend, nicht künstlich kooperativ.',
        'Antworte natürlich, konkret und aus Lukas Sicht in der Ich-Perspektive.',
        'Halte deine Antwort sehr kurz: maximal 1 bis 2 Sätze, keine langen Erklärungen.',
        'Stelle höchstens eine kurze Rückfrage.',
        'Schreibe in Schweizer Hochdeutsch mit ss statt ß.',
        `Szenario: ${params.scenario}`,
        `Zielgruppe: ${params.targetAudience}`,
        `Persona: ${JSON.stringify(params.persona)}`
      ].join('\n')
    },
    ...history,
    { role: 'user', content: params.userMessage }
  ], { temperature: 0.7, numPredict: 80, numCtx: 2048, timeoutMs: 60000 })

  return swissSolutionText(reply)
}

export async function generateSummary(params: {
  scenario: string
  targetAudience: string
  persona: PersonaProfile
  messages: ChatMessage[]
}): Promise<SessionSummary> {
  const transcript = params.messages
    .map((message) => `${message.role === 'user' ? 'Führungskraft' : 'Lukas'}: ${message.content}`)
    .join('\n')

  const content = await callOllama([
    {
      role: 'system',
      content: [
        'Du bist ein erfahrener, wohlwollender Kommunikations-Coach.',
        'Dir wird das Transkript eines geübten Feedbackgesprächs gegeben: Führungskraft = Nutzer, Lukas = KI.',
        'Bewerte ausschliesslich die Führungskraft, nicht Lukas.',
        'Nutze das WWW-Modell als Massstab:',
        'Wahrnehmung: Wurde konkret beobachtet statt bewertet?',
        'Wirkung: Wurde die eigene Wirkung oder die Wirkung aufs Team benannt?',
        'Wunsch: Gab es einen klaren, machbaren Wunsch?',
        'Gib kurz, ehrlich und ermutigend Feedback.',
        'Schreibe in Schweizer Hochdeutsch mit ss statt ß.',
        'Maximal 200 Wörter insgesamt.',
        'Antworte ausschliesslich als valides JSON ohne Markdown.',
        'Schema: {"strength":string,"strengthQuote":string,"improvement":string,"improvementQuote":string,"exampleSentences":[string,string],"wwwFeedback":{"perception":string,"effect":string,"wish":string}}'
      ].join('\n')
    },
    {
      role: 'user',
      content: [
        `Szenario: ${params.scenario}`,
        `Zielgruppe: ${params.targetAudience}`,
        `Persona: ${JSON.stringify(params.persona)}`,
        `Dialog:\n${transcript}`,
        'Erstelle das Abschluss-Coaching.',
        'strength: eine konkrete Stärke der Führungskraft.',
        'strengthQuote: ein kurzes Zitat aus dem Gespräch, das die Stärke zeigt.',
        'improvement: der wichtigste Verbesserungspunkt.',
        'improvementQuote: ein kurzes Zitat aus dem Gespräch, an dem man den Punkt sieht.',
        'exampleSentences: genau zwei umformulierte Beispielsätze, die es besser machen.'
      ].join('\n\n')
    }
  ], { temperature: 0.35, numPredict: 360, timeoutMs: 90000 })

  return swissSolutionValue(SummarySchema.parse(parseJsonFromModel(content)))
}
