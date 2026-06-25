import { addMessage, getSession, saveCoachFeedback } from '../lib/db'
import { generateCoachFeedback, generatePersonaReply } from '../lib/ollama'
import { ChatInputSchema } from '../lib/schemas'

export default defineEventHandler(async (event) => {
  const input = ChatInputSchema.parse(await readBody(event))
  const sessionBefore = getSession(input.sessionId)
  const userMessageId = addMessage(input.sessionId, 'user', input.message)

  const reply = await generatePersonaReply({
    scenario: sessionBefore.scenario,
    targetAudience: sessionBefore.targetAudience,
    persona: sessionBefore.persona,
    messages: sessionBefore.messages,
    userMessage: input.message
  })

  addMessage(input.sessionId, 'persona', reply)
  const coachFeedback = await generateCoachFeedback({
    scenario: sessionBefore.scenario,
    targetAudience: sessionBefore.targetAudience,
    persona: sessionBefore.persona,
    messages: sessionBefore.messages,
    userMessage: input.message
  })
  saveCoachFeedback(input.sessionId, userMessageId, coachFeedback)

  return getSession(input.sessionId)
})
