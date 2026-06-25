<script setup lang="ts">
import type { PersonaProfile, StoredSession } from '../types/persona'

type SessionListItem = {
  id: number
  scenario: string
  targetAudience: string
  createdAt: string
  personaName: string
}

const scenario = ref('Verhandlung & Kommunikation auf Augenhöhe. Fokus auf Rhetorik, Fragetechniken und Interventionstechniken für ein konstruktives, wertschätzendes Miteinander.')
const targetAudience = ref('Männliche, weisse Personen über 50 Jahre, eher konservativ geprägt, mit Erfahrung in Führung, Verhandlung oder beruflicher Kommunikation. Sie legen Wert auf Verlässlichkeit, klare Rollen, Respekt, praktische Umsetzbarkeit und sachliche Argumentation.')
const currentSession = ref<StoredSession | null>(null)
const sessions = ref<SessionListItem[]>([])
const pending = ref(false)
const chatMessage = ref('')
const errorMessage = ref('')

const persona = computed(() => currentSession.value?.persona || null)
const messages = computed(() => currentSession.value?.messages || [])
const summary = computed(() => currentSession.value?.summary || null)

async function loadSessions() {
  sessions.value = await $fetch<SessionListItem[]>('/api/sessions')
}

async function startSimulation() {
  errorMessage.value = ''
  pending.value = true
  try {
    const generatedPersona = await $fetch<PersonaProfile>('/api/personas/generate', {
      method: 'POST',
      body: {
        scenario: scenario.value,
        targetAudience: targetAudience.value
      }
    })

    currentSession.value = await $fetch<StoredSession>('/api/sessions', {
      method: 'POST',
      body: {
        scenario: scenario.value,
        targetAudience: targetAudience.value,
        persona: generatedPersona
      }
    })
    await loadSessions()
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Die Persona konnte nicht erzeugt werden.'
  } finally {
    pending.value = false
  }
}

async function sendMessage() {
  if (!currentSession.value || !chatMessage.value.trim()) return

  const message = chatMessage.value.trim()
  chatMessage.value = ''
  errorMessage.value = ''
  pending.value = true
  try {
    currentSession.value = await $fetch<StoredSession>('/api/chat', {
      method: 'POST',
      body: {
        sessionId: currentSession.value.id,
        message
      }
    })
  } catch (error: any) {
    chatMessage.value = message
    errorMessage.value = error?.statusMessage || error?.message || 'Die Persona konnte nicht antworten.'
  } finally {
    pending.value = false
  }
}

async function createSummary() {
  if (!currentSession.value) return

  errorMessage.value = ''
  pending.value = true
  try {
    currentSession.value = await $fetch<StoredSession>(`/api/sessions/${currentSession.value.id}/summary`, {
      method: 'POST'
    })
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Die Zusammenfassung konnte nicht erzeugt werden.'
  } finally {
    pending.value = false
  }
}

async function openSession(id: number) {
  errorMessage.value = ''
  currentSession.value = await $fetch<StoredSession>(`/api/sessions/${id}`)
}

function resetSimulation() {
  currentSession.value = null
  chatMessage.value = ''
  errorMessage.value = ''
}

onMounted(loadSessions)
</script>

<template>
  <main class="shell">
    <section class="workspace">
      <aside class="sidebar">
        <div>
          <p class="eyebrow">Lokaler Agent</p>
          <h1>Swiss Persona Simulation</h1>
        </div>

        <button class="secondary full-width" @click="resetSimulation">
          Neue Simulation
        </button>

        <div class="history">
          <h2>Gespeicherte Simulationen</h2>
          <button
            v-for="item in sessions"
            :key="item.id"
            class="history-item"
            :class="{ active: currentSession?.id === item.id }"
            @click="openSession(item.id)"
          >
            <strong>{{ item.personaName }}</strong>
            <span>{{ item.scenario }}</span>
          </button>
          <p v-if="sessions.length === 0" class="muted">
            Noch keine gespeicherten Simulationen.
          </p>
        </div>
      </aside>

      <section class="main-panel">
        <div class="setup">
          <label>
            <span>Szenario</span>
            <textarea v-model="scenario" rows="4" />
          </label>
          <label>
            <span>Zielgruppe</span>
            <textarea v-model="targetAudience" rows="4" />
          </label>
          <button class="primary" :disabled="pending" @click="startSimulation">
            {{ pending ? 'Generiere Persona...' : 'Neue Persona generieren' }}
          </button>
        </div>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>

        <section v-if="persona" class="persona-grid">
          <article class="persona-panel">
            <p class="eyebrow">Aktive Persona</p>
            <h2>{{ persona.name }}</h2>
            <p>{{ persona.background }}</p>
            <dl>
              <div>
                <dt>Motivation</dt>
                <dd>{{ persona.motivation }}</dd>
              </div>
              <div>
                <dt>Entscheidung</dt>
                <dd>{{ persona.decisionBehavior }}</dd>
              </div>
              <div>
                <dt>Schweizer Tonalität</dt>
                <dd>{{ persona.tone }}</dd>
              </div>
            </dl>
            <div class="chips">
              <span v-for="point in persona.painPoints" :key="point">{{ point }}</span>
            </div>
          </article>

          <article class="chat-panel">
            <div class="chat-header">
              <div>
                <p class="eyebrow">Freier Chat</p>
                <h2>Simulation</h2>
              </div>
              <button class="secondary" :disabled="pending || messages.length === 0" @click="createSummary">
                Zusammenfassen
              </button>
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
              </div>
            </div>

            <form class="composer" @submit.prevent="sendMessage">
              <input v-model="chatMessage" placeholder="Nachricht an die Persona..." :disabled="pending" />
              <button class="primary" :disabled="pending || !chatMessage.trim()">Senden</button>
            </form>
          </article>
        </section>

        <section v-if="summary" class="summary">
          <h2>Auswertung</h2>
          <div class="summary-grid">
            <article>
              <h3>Insights</h3>
              <ul><li v-for="item in summary.insights" :key="item">{{ item }}</li></ul>
            </article>
            <article>
              <h3>Bedürfnisse</h3>
              <ul><li v-for="item in summary.needs" :key="item">{{ item }}</li></ul>
            </article>
            <article>
              <h3>Klärungspunkte</h3>
              <ul><li v-for="item in summary.objections" :key="item">{{ item }}</li></ul>
            </article>
            <article>
              <h3>Muster</h3>
              <ul><li v-for="item in summary.patterns" :key="item">{{ item }}</li></ul>
            </article>
            <article>
              <h3>Empfehlungen</h3>
              <ul><li v-for="item in summary.recommendations" :key="item">{{ item }}</li></ul>
            </article>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
