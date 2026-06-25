<script setup lang="ts">
import type { SimulationTemplate } from '../../composables/useSimulationCatalog'

defineProps<{
  templates: SimulationTemplate[]
  pending: boolean
}>()

const emit = defineEmits<{
  start: [template: SimulationTemplate]
}>()
</script>

<template>
  <section class="template-section">
    <div>
      <p class="eyebrow">Interventionstechniken</p>
      <h2>Simulationspersonas</h2>
    </div>
    <div class="template-grid">
      <article v-for="template in templates" :key="template.id" class="template-card">
        <div>
          <p class="eyebrow">{{ template.pattern }}</p>
          <h3>{{ template.persona.name }}</h3>
          <p>{{ template.persona.background }}</p>
        </div>
        <div class="template-meta">
          <span>{{ template.typicalSentence }}</span>
          <small>{{ template.exercise }}</small>
        </div>
        <dl class="template-learning">
          <div>
            <dt>Lernziel</dt>
            <dd>{{ template.learningGoal }}</dd>
          </div>
          <div>
            <dt>Gute Intervention</dt>
            <dd>{{ template.goodIntervention }}</dd>
          </div>
          <div>
            <dt>Typische Falle</dt>
            <dd>{{ template.commonMistake }}</dd>
          </div>
        </dl>
        <button class="secondary" :disabled="pending" @click="emit('start', template)">
          Starten
        </button>
      </article>
    </div>
  </section>
</template>
