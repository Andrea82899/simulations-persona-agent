<script setup lang="ts">
import type { SimulationTemplate } from '../../composables/useSimulationCatalog'

defineProps<{
  personas: SimulationTemplate[]
  activePersonaName: string | null
}>()

const emit = defineEmits<{
  reset: []
  startPersona: [template: SimulationTemplate]
}>()
</script>

<template>
  <aside class="sidebar">
    <div>
      <p class="eyebrow">Lokaler Trainingspartner</p>
      <h1>Feedbackgespräch üben</h1>
    </div>

    <button class="secondary full-width" @click="emit('reset')">
      Neu starten
    </button>

    <div class="history">
      <div class="history-heading">
        <h2>Trainingsperson</h2>
        <span>{{ personas.length }}</span>
      </div>
      <button
        v-for="template in personas"
        :key="template.id"
        class="history-item"
        :class="{ active: activePersonaName === template.persona.name }"
        @click="emit('startPersona', template)"
      >
        <strong>{{ template.persona.name }}</strong>
        <span>{{ template.pattern }}</span>
        <small>{{ template.exercise }}</small>
      </button>
    </div>
  </aside>
</template>
