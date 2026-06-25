---
title: Atomic chat turn persistence
category: database
date: 2026-06-25
components: server/api/chat.post.ts, server/lib/db.ts
tags: sqlite, chat, transaction, ollama, coach-feedback, latency
---

# Atomic Chat Turn Persistence

## Symptom

A chat request could fail after the user message had already been written to SQLite. If Ollama timed out while generating the persona reply, the UI restored the draft for retry, but the stored session already contained the user turn. A retry could then duplicate the user message or leave a conversation with a missing persona response.

## Root Cause

The endpoint wrote the user message before calling the local model:

```ts
const userMessageId = addMessage(input.sessionId, 'user', input.message)
const reply = await generatePersonaReply(...)
addMessage(input.sessionId, 'persona', reply)
```

The database write and the model call were not treated as one chat turn. Optional coach feedback also ran in the same request path, so feedback generation could block a successful persona reply from returning.

## Solution

Generate the persona reply first, then persist the complete turn in a SQLite transaction:

```ts
const reply = await generatePersonaReply(...)

saveChatTurn({
  sessionId: input.sessionId,
  userMessage: input.message,
  personaReply: reply
})
```

The database helper inserts the user message and persona reply together:

```ts
return database.transaction(() => {
  const createdAt = now()
  const userResult = insertMessage.run(input.sessionId, 'user', input.userMessage, createdAt)
  insertMessage.run(input.sessionId, 'persona', input.personaReply, createdAt)
})()
```

Coach feedback should not sit on the critical chat path. Trigger it through the dedicated coach endpoint after the persona reply is returned to the UI.

## What Didn't Work

Keeping `addMessage()` calls in the endpoint made the happy path simple, but it split one domain event across several independent side effects. That was fragile because local model calls are slow enough to fail or time out.

## Prevention

- Treat a user/persona exchange as one database operation.
- Keep optional coach feedback outside the main chat response.
- Test that a saved chat turn stores user and persona messages chronologically and links coach feedback to the user message.
- When adding new per-turn side effects, attach them to the transaction only if they are required for the chat turn to be valid.

## Related

- `.agents/rules/44_workflow_database.md`
- `.agents/rules/41_workflow_testing.md`
