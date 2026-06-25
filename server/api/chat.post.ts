import { getSession, saveChatTurn } from '../lib/db'
import { generatePersonaReply } from '../lib/ollama'
import { ChatInputSchema } from '../lib/schemas'

export default defineEventHandler(async (event) => {
  const input = ChatInputSchema.parse(await readBody(event))
  const sessionBefore = getSession(input.sessionId)

  const reply = await generatePersonaReply({
    scenario: sessionBefore.scenario,
    targetAudience: sessionBefore.targetAudience,
    persona: sessionBefore.persona,
    messages: sessionBefore.messages,
    userMessage: input.message
  })

  saveChatTurn({
    sessionId: input.sessionId,
    userMessage: input.message,
    personaReply: reply
  })

  return getSession(input.sessionId)
})
