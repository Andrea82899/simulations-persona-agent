<script setup lang="ts">
import type { StoredSession } from '../types/persona'
import {
  buildTrainingContext,
  defaultScenario,
  defaultTargetAudience,
  simulationTemplates,
  type SimulationTemplate
} from './composables/useSimulationCatalog'
import { getMoodBarometer } from './composables/useMoodBarometer'

const scenario = ref(defaultScenario)
const targetAudience = ref(defaultTargetAudience)
const trainingFocus = ref('Fokus halten')
const difficulty = ref('mittel')
const currentSession = ref<StoredSession | null>(null)
const pending = ref(false)
const chatMessage = ref('')
const errorMessage = ref('')

const persona = computed(() => currentSession.value?.persona || null)
const messages = computed(() => currentSession.value?.messages || [])
const userMessageCount = computed(() => messages.value.filter((message) => message.role === 'user').length)
const mood = computed(() => getMoodBarometer(messages.value))
const summary = computed(() => currentSession.value?.summary || null)
const pendingLabel = computed(() => {
  if (!pending.value) return ''
  if (!persona.value) return 'Das Feedbackgespräch wird vorbereitet.'
  return 'Lukas antwortet kurz.'
})

function trainingContext(baseScenario: string, baseTargetAudience: string) {
  return buildTrainingContext({
    scenario: baseScenario,
    targetAudience: baseTargetAudience,
    trainingFocus: trainingFocus.value,
    difficulty: difficulty.value
  })
}

async function startSimulation() {
  const template = simulationTemplates[0]

  if (!template) {
    errorMessage.value = 'Die Trainingsperson konnte nicht geladen werden.'
    return
  }

  await startTemplateSimulation(template)
}

async function startTemplateSimulation(template: SimulationTemplate) {
  errorMessage.value = ''
  pending.value = true
  try {
    const context = trainingContext(template.scenario, template.targetAudience)
    currentSession.value = await $fetch<StoredSession>('/api/sessions', {
      method: 'POST',
      body: {
        scenario: context.scenario,
        targetAudience: context.targetAudience,
        persona: template.persona
      }
    })
    scenario.value = context.scenario
    targetAudience.value = context.targetAudience
    chatMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Das Feedbackgespräch konnte nicht gestartet werden.'
  } finally {
    pending.value = false
  }
}

async function sendMessage() {
  if (!currentSession.value || summary.value || !chatMessage.value.trim()) return

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
    errorMessage.value = error?.statusMessage || error?.message || 'Lukas konnte nicht antworten.'
  } finally {
    pending.value = false
  }
}

async function createSummary() {
  if (!currentSession.value || userMessageCount.value === 0) return

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

function resetSimulation() {
  currentSession.value = null
  chatMessage.value = ''
  errorMessage.value = ''
  scenario.value = defaultScenario
  targetAudience.value = defaultTargetAudience
}
</script>

<template>
  <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
  <main class="shell">
    <section class="workspace">
      <SimulationSessionSidebar
        :personas="simulationTemplates"
        :active-persona-name="persona?.name || null"
        @reset="resetSimulation"
        @start-persona="startTemplateSimulation"
      />

      <section id="main-content" class="main-panel">
        <SimulationSetup
          v-model:scenario="scenario"
          :pending="pending"
          @start="startSimulation"
        />

        <p v-if="pending" class="pending-note">
          {{ pendingLabel }} Das kann lokal einen Moment dauern.
        </p>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>

        <section v-if="persona" class="persona-grid">
          <SimulationPersonaPanel :persona="persona" />

          <SimulationChatPanel
            v-model:chat-message="chatMessage"
            :persona="persona"
            :messages="messages"
            :mood="mood"
            :pending="pending"
            :user-message-count="userMessageCount"
            :is-finished="Boolean(summary)"
            @send="sendMessage"
            @create-summary="createSummary"
          />
        </section>

        <SimulationSummaryPanel v-if="summary" :summary="summary" />
      </section>
    </section>
  </main>
</template>
