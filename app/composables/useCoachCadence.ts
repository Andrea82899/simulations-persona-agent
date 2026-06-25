export function nextFeedbackCountdown(userMessageCount: number, hasPersona: boolean) {
  if (!hasPersona) return 10
  const rest = userMessageCount % 10
  return rest === 0 ? 10 : 10 - rest
}

