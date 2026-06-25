<script setup lang="ts">
import type { ChatMessage, CoachFeedback, PersonaProfile } from '../../../types/persona'

defineProps<{
  persona: PersonaProfile
  messages: ChatMessage[]
  coachFeedbackByMessageId: Record<number, CoachFeedback>
  pending: boolean
  userMessageCount: number
  nextAutoFeedbackIn: number
}>()

const chatMessage = defineModel<string>('chatMessage', { required: true })
const revisedAnswers = defineModel<Record<number, string>>('revisedAnswers', { required: true })
const emit = defineEmits<{
  send: []
  requestCoachFeedback: []
  createSummary: []
}>()
</script>

<template>
  <article class="chat-panel">
    <div class="chat-header">
      <div>
        <p class="eyebrow">Freier Chat</p>
        <h2>Simulation</h2>
        <p class="muted small-note">
          Coach-Feedback automatisch nach 10 Antworten oder jederzeit auf Nachfrage.
          Nächster Auto-Impuls in {{ nextAutoFeedbackIn }}.
        </p>
      </div>
      <div class="chat-actions">
        <button class="secondary" :disabled="pending || userMessageCount === 0" @click="emit('requestCoachFeedback')">
          Coach-Feedback
        </button>
        <button class="secondary" :disabled="pending || messages.length === 0" @click="emit('createSummary')">
          Zusammenfassen
        </button>
      </div>
    </div>

    <div class="messages">
      <p v-if="messages.length === 0" class="muted">
        Stelle der Persona die erste Frage.
      </p>
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="message.role"
      >
        <span>{{ message.role === 'user' ? 'Du' : persona.name }}</span>
        <p>{{ message.content }}</p>
        <article v-if="message.role === 'user' && coachFeedbackByMessageId[message.id]" class="coach-card">
          <p class="eyebrow">Trainingscoach</p>
          <dl>
            <div>
              <dt>Wirkung</dt>
              <dd>{{ coachFeedbackByMessageId[message.id]?.effect || '' }}</dd>
            </div>
            <div>
              <dt>Technik</dt>
              <dd>{{ coachFeedbackByMessageId[message.id]?.technique || '' }}</dd>
            </div>
            <div>
              <dt>Nächster Schritt</dt>
              <dd>{{ coachFeedbackByMessageId[message.id]?.improvement || '' }}</dd>
            </div>
            <div>
              <dt>Alternative</dt>
              <dd>{{ coachFeedbackByMessageId[message.id]?.alternative || '' }}</dd>
            </div>
          </dl>
          <label class="revision-field" :for="`revision-${message.id}`">
            <span>Bessere Antwort üben</span>
            <textarea
              :id="`revision-${message.id}`"
              v-model="revisedAnswers[message.id]"
              rows="3"
              placeholder="Formuliere deine Antwort noch einmal klarer..."
            />
          </label>
        </article>
      </div>
    </div>

    <form class="composer" @submit.prevent="emit('send')">
      <label class="sr-only" for="chat-message">Nachricht an die Persona</label>
      <input id="chat-message" v-model="chatMessage" placeholder="Nachricht an die Persona..." :disabled="pending">
      <button class="primary" :disabled="pending || !chatMessage.trim()">Senden</button>
    </form>
  </article>
</template>
