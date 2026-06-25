import { getSession, saveChatTurn } from '../lib/db'
import { generateCoachFeedback, generatePersonaReply } from '../lib/ollama'
import { ChatInputSchema } from '../lib/schemas'

export default defineEventHandler(async (event) => {
  const input = ChatInputSchema.parse(await readBody(event))
  const sessionBefore = getSession(input.sessionId)
  const userInteractionCount = sessionBefore.messages.filter((message) => message.role === 'user').length + 1
  const shouldGenerateCoachFeedback = Boolean(input.requestCoach) || userInteractionCount % 10 === 0

  const reply = await generatePersonaReply({
    scenario: sessionBefore.scenario,
    targetAudience: sessionBefore.targetAudience,
    persona: sessionBefore.persona,
    messages: sessionBefore.messages,
    userMessage: input.message
  })

  let coachFeedback = null
  if (shouldGenerateCoachFeedback) {
    try {
      coachFeedback = await generateCoachFeedback({
        scenario: sessionBefore.scenario,
        targetAudience: sessionBefore.targetAudience,
        persona: sessionBefore.persona,
        messages: sessionBefore.messages,
        userMessage: input.message
      })
    } catch {
      coachFeedback = null
    }
  }

  saveChatTurn({
    sessionId: input.sessionId,
    userMessage: input.message,
    personaReply: reply,
    coachFeedback
  })

  return getSession(input.sessionId)
})
