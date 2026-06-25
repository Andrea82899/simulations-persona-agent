import type { SessionListItem } from './useSimulationCatalog'

export type SessionHistoryGroup = {
  personaName: string
  sessions: SessionListItem[]
}

export function filterSessionsByQuery(sessions: SessionListItem[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return sessions

  return sessions.filter((item) => {
    return [
      item.personaName,
      item.scenario,
      item.targetAudience
    ].some((value) => value.toLowerCase().includes(normalizedQuery))
  })
}

export function limitSessions(sessions: SessionListItem[], showAll: boolean, limit: number) {
  if (showAll) return sessions
  return sessions.slice(0, limit)
}

export function groupSessionsByPersona(sessions: SessionListItem[]) {
  const groups = new Map<string, SessionListItem[]>()

  for (const session of sessions) {
    const existingSessions = groups.get(session.personaName) || []
    existingSessions.push(session)
    groups.set(session.personaName, existingSessions)
  }

  return Array.from(groups, ([personaName, groupedSessions]) => ({
    personaName,
    sessions: groupedSessions
  }))
}

