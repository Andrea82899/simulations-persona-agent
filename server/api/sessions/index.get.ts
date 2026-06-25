import { listSessions } from '../../lib/db'

export default defineEventHandler(() => {
  return listSessions()
})
