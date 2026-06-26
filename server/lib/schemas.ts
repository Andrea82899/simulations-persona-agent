import { z } from 'zod'

export const PersonaSchema = z.object({
  name: z.string().min(1),
  background: z.string().min(1),
  motivation: z.string().min(1),
  painPoints: z.array(z.string().min(1)).min(1),
  decisionBehavior: z.string().min(1),
  tone: z.string().min(1)
})

export const SummarySchema = z.object({
  strength: z.string().min(1),
  strengthQuote: z.string().min(1),
  improvement: z.string().min(1),
  improvementQuote: z.string().min(1),
  exampleSentences: z.array(z.string().min(1)).length(2),
  wwwFeedback: z.object({
    perception: z.string().min(1),
    effect: z.string().min(1),
    wish: z.string().min(1)
  })
})

export const PersonaInputSchema = z.object({
  scenario: z.string().min(10, 'Bitte beschreibe das Szenario etwas genauer.'),
  targetAudience: z.string().min(5, 'Bitte beschreibe die Zielgruppe.')
})

export const SessionCreateSchema = PersonaInputSchema.extend({
  persona: PersonaSchema
})

export const ChatInputSchema = z.object({
  sessionId: z.number().int().positive(),
  message: z.string().min(1)
})
