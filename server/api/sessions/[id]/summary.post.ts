import { getSession, saveSummary } from '../../../lib/db'
import { generateSummary } from '../../../lib/ollama'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const session = getSession(id)
  const summary = await generateSummary(session)
  saveSummary(id, summary)
  return getSession(id)
})
