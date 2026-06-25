<script setup lang="ts">
import type { CoachFeedback, PersonaProfile, StoredSession } from '../types/persona'
import {
  buildTrainingContext,
  defaultScenario,
  defaultTargetAudience,
  difficultyOptions,
  focusOptions,
  phraseLibrary,
  scenarioPresets,
  simulationTemplates,
  type ScenarioPreset,
  type SessionListItem,
  type SimulationTemplate
} from './composables/useSimulationCatalog'

const scenario = ref(defaultScenario)
const targetAudience = ref(defaultTargetAudience)
const trainingFocus = ref('Fokus halten')
const difficulty = ref('mittel')
const currentSession = ref<StoredSession | null>(null)
const sessions = ref<SessionListItem[]>([])
const pending = ref(false)
const chatMessage = ref('')
const errorMessage = ref('')
const revisedAnswers = ref<Record<number, string>>({})

const persona = computed(() => currentSession.value?.persona || null)
const messages = computed(() => currentSession.value?.messages || [])
const userMessageCount = computed(() => messages.value.filter((message) => message.role === 'user').length)
const nextAutoFeedbackIn = computed(() => nextFeedbackCountdown(userMessageCount.value, Boolean(persona.value)))
const coachFeedbackByMessageId = computed(() => {
  return Object.fromEntries(
    (currentSession.value?.coachFeedback || []).map((feedback) => [feedback.userMessageId, feedback])
  ) as Record<number, CoachFeedback>
})
const summary = computed(() => currentSession.value?.summary || null)
const pendingLabel = computed(() => {
  if (!pending.value) return ''
  if (!persona.value) return 'Das lokale Modell erzeugt eine neue Persona.'
  return 'Die Persona antwortet kurz.'
})

async function loadSessions() {
  sessions.value = await $fetch<SessionListItem[]>('/api/sessions')
}

function trainingContext(baseScenario: string, baseTargetAudience: string) {
  return buildTrainingContext({
    scenario: baseScenario,
    targetAudience: baseTargetAudience,
    trainingFocus: trainingFocus.value,
    difficulty: difficulty.value
  })
}

function applyScenarioPreset(preset: ScenarioPreset) {
  scenario.value = preset.scenario
  trainingFocus.value = preset.focus
  errorMessage.value = ''
}

async function startSimulation() {
  errorMessage.value = ''
  pending.value = true
  try {
    const context = trainingContext(scenario.value, targetAudience.value)
    const generatedPersona = await $fetch<PersonaProfile>('/api/personas/generate', {
      method: 'POST',
      body: {
        scenario: context.scenario,
        targetAudience: context.targetAudience
      }
    })

    currentSession.value = await $fetch<StoredSession>('/api/sessions', {
      method: 'POST',
      body: {
        scenario: context.scenario,
        targetAudience: context.targetAudience,
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
    revisedAnswers.value = {}
    await loadSessions()
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Die Vorlage konnte nicht gestartet werden.'
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

async function requestCoachFeedback() {
  if (!currentSession.value || userMessageCount.value === 0) return

  errorMessage.value = ''
  pending.value = true
  try {
    currentSession.value = await $fetch<StoredSession>(`/api/sessions/${currentSession.value.id}/coach`, {
      method: 'POST'
    })
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || error?.message || 'Das Coach-Feedback konnte nicht erzeugt werden.'
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
  revisedAnswers.value = {}
}

onMounted(loadSessions)
</script>

<template>
  <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
  <main class="shell">
    <section class="workspace">
      <SimulationSessionSidebar
        :sessions="sessions"
        :current-session-id="currentSession?.id || null"
        @reset="resetSimulation"
        @open="openSession"
      />

      <section id="main-content" class="main-panel">
        <SimulationTrainingControls
          v-model:training-focus="trainingFocus"
          v-model:difficulty="difficulty"
          :focus-options="focusOptions"
          :difficulty-options="difficultyOptions"
          :presets="scenarioPresets"
          @select-preset="applyScenarioPreset"
        />

        <SimulationPersonaTemplates
          :templates="simulationTemplates"
          :pending="pending"
          @start="startTemplateSimulation"
        />

        <SimulationSimulationSetup
          v-model:scenario="scenario"
          v-model:target-audience="targetAudience"
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
            v-model:revised-answers="revisedAnswers"
            :persona="persona"
            :messages="messages"
            :coach-feedback-by-message-id="coachFeedbackByMessageId"
            :pending="pending"
            :user-message-count="userMessageCount"
            :next-auto-feedback-in="nextAutoFeedbackIn"
            @send="sendMessage"
            @request-coach-feedback="requestCoachFeedback"
            @create-summary="createSummary"
          />
        </section>

        <SimulationPhraseLibrary :groups="phraseLibrary" />

        <SimulationSummaryPanel v-if="summary" :summary="summary" />
      </section>
    </section>
  </main>
</template>
