import { PersonaInputSchema } from '../../lib/schemas'
import { generatePersona } from '../../lib/ollama'

export default defineEventHandler(async (event) => {
  const input = PersonaInputSchema.parse(await readBody(event))
  return generatePersona(input.scenario, input.targetAudience)
})
