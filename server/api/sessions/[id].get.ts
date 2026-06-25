import { getSession } from '../../lib/db'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  return getSession(id)
})
