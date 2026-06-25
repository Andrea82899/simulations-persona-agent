export type PersonaProfile = {
  name: string
  background: string
  motivation: string
  painPoints: string[]
  decisionBehavior: string
  tone: string
}

export type SessionSummary = {
  insights: string[]
  needs: string[]
  objections: string[]
  patterns: string[]
  recommendations: string[]
}

export type ChatRole = 'user' | 'persona'

export type ChatMessage = {
  id: number
  sessionId: number
  role: ChatRole
  content: string
  createdAt: string
}

export type StoredSession = {
  id: number
  scenario: string
  targetAudience: string
  createdAt: string
  persona: PersonaProfile
  messages: ChatMessage[]
  summary: SessionSummary | null
}
