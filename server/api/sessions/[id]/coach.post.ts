import { deleteCoachFeedback, getSession, saveCoachFeedback } from '../../../lib/db'
import { generateCoachFeedback } from '../../../lib/ollama'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const session = getSession(id)
  const lastUserMessage = [...session.messages].reverse().find((message) => message.role === 'user')

  if (!lastUserMessage) {
    throw createError({ statusCode: 400, statusMessage: 'Es gibt noch keine Nutzerantwort für Coach-Feedback.' })
  }

  deleteCoachFeedback(id, lastUserMessage.id)
  const feedback = await generateCoachFeedback({
    scenario: session.scenario,
    targetAudience: session.targetAudience,
    persona: session.persona,
    messages: session.messages.filter((message) => message.id < lastUserMessage.id),
    userMessage: lastUserMessage.content
  })
  saveCoachFeedback(id, lastUserMessage.id, feedback)

  return getSession(id)
})
