<script setup lang="ts">
import type { ChatMessage, PersonaProfile } from '../../../types/persona'
import type { MoodBarometer } from '../../composables/useMoodBarometer'

defineProps<{
  persona: PersonaProfile
  messages: ChatMessage[]
  mood: MoodBarometer
  pending: boolean
  userMessageCount: number
  isFinished: boolean
}>()

const chatMessage = defineModel<string>('chatMessage', { required: true })
const emit = defineEmits<{
  send: []
  createSummary: []
}>()
</script>

<template>
  <article class="chat-panel">
    <div class="chat-header">
      <div>
        <p class="eyebrow">Feedbackgespräch</p>
        <h2>Gespräch mit {{ persona.name }}</h2>
        <p class="muted small-note">
          Lukas bleibt in seiner Rolle. Der Coach kommt erst nach dem Beenden des Gesprächs.
        </p>
      </div>
      <div class="chat-actions">
        <button class="secondary" :disabled="pending || isFinished || userMessageCount === 0" @click="emit('createSummary')">
          Gespräch beenden
        </button>
      </div>
    </div>

    <section class="mood-panel" aria-label="Stimmungsbarometer">
      <div class="mood-copy">
        <span>Stimmung</span>
        <strong>{{ mood.label }}</strong>
        <small>{{ mood.description }}</small>
      </div>
      <div class="mood-track">
        <div class="mood-fill" :style="{ width: `${mood.value}%` }" />
      </div>
      <div class="mood-scale">
        <span>verschlossen</span>
        <span>offen</span>
      </div>
    </section>

    <div class="messages">
      <p v-if="messages.length === 0" class="muted">
        Starte das Gespräch. Ein guter Einstieg anerkennt kurz Lukas' fachliche Stärke und beschreibt dann konkret die Beobachtung.
      </p>
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="message.role"
      >
        <span>{{ message.role === 'user' ? 'Du' : persona.name }}</span>
        <p>{{ message.content }}</p>
      </div>
    </div>

    <form class="composer" @submit.prevent="emit('send')">
      <label class="sr-only" for="chat-message">Nachricht an Lukas</label>
      <input id="chat-message" v-model="chatMessage" placeholder="Deine nächste Gesprächszeile..." :disabled="pending || isFinished">
      <button class="primary" :disabled="pending || isFinished || !chatMessage.trim()">Senden</button>
    </form>
  </article>
</template>
