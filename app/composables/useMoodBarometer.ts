import type { ChatMessage } from '../../types/persona'

export type MoodBarometer = {
  value: number
  label: string
  description: string
}

const appreciationPatterns = [
  /\bdanke\b/i,
  /\bschätze\b/i,
  /\bwertschätz/i,
  /\bstark\b/i,
  /\bgute arbeit\b/i,
  /\bfachlich\b/i,
  /\bverstehe\b/i
]

const openQuestionPatterns = [
  /\bwie\b.*\?/i,
  /\bwas\b.*\?/i,
  /\bworan\b.*\?/i,
  /\bwelche\b.*\?/i,
  /\bwas brauchst du\b/i,
  /\bwie siehst du\b/i
]

const concreteFeedbackPatterns = [
  /\bmir ist aufgefallen\b/i,
  /\bich habe beobachtet\b/i,
  /\bdie wirkung\b/i,
  /\bich wünsche mir\b/i,
  /\bkonkret\b/i,
  /\bnächste\b/i,
  /\bvereinbaren\b/i
]

const closingPatterns = [
  /\bimmer\b/i,
  /\bnie\b/i,
  /\bschludrig\b/i,
  /\bschuld\b/i,
  /\bproblem\b/i,
  /\bvorwurf\b/i,
  /\bmusst\b/i,
  /\bschon wieder\b/i
]

function matchesAny(value: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(value))
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

export function getMoodBarometer(messages: ChatMessage[]): MoodBarometer {
  const userMessages = messages.filter((message) => message.role === 'user')
  const value = clamp(userMessages.reduce((score, message) => {
    const text = message.content
    let nextScore = score

    if (matchesAny(text, appreciationPatterns)) nextScore += 12
    if (matchesAny(text, openQuestionPatterns)) nextScore += 10
    if (matchesAny(text, concreteFeedbackPatterns)) nextScore += 8
    if (matchesAny(text, closingPatterns)) nextScore -= 14
    if (text.length > 420) nextScore -= 8

    return nextScore
  }, 42))

  if (value < 34) {
    return {
      value,
      label: 'verschlossen',
      description: 'Lukas zieht sich zurück und rechtfertigt sich eher.'
    }
  }

  if (value < 67) {
    return {
      value,
      label: 'vorsichtig',
      description: 'Lukas bleibt wachsam, hört aber zu.'
    }
  }

  return {
    value,
    label: 'offen',
    description: 'Lukas wird kooperativer und denkt mit.'
  }
}
