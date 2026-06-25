import { createSession } from '../../lib/db'
import { SessionCreateSchema } from '../../lib/schemas'

export default defineEventHandler(async (event) => {
  const input = SessionCreateSchema.parse(await readBody(event))
  return createSession(input)
})
