<script setup lang="ts">
import type { ScenarioPreset } from '../../composables/useSimulationCatalog'

defineProps<{
  focusOptions: readonly string[]
  difficultyOptions: readonly { value: string, label: string }[]
  presets: ScenarioPreset[]
}>()

const trainingFocus = defineModel<string>('trainingFocus', { required: true })
const difficulty = defineModel<string>('difficulty', { required: true })
const emit = defineEmits<{
  selectPreset: [preset: ScenarioPreset]
}>()
</script>

<template>
  <section class="training-controls">
    <div>
      <p class="eyebrow">Trainingsmodus</p>
      <h2>Fokus und Schwierigkeit</h2>
    </div>
    <div class="control-grid">
      <label for="training-focus">
        <span>Trainingsfokus</span>
        <select id="training-focus" v-model="trainingFocus">
          <option v-for="option in focusOptions" :key="option">
            {{ option }}
          </option>
        </select>
      </label>
      <label for="difficulty">
        <span>Schwierigkeit</span>
        <select id="difficulty" v-model="difficulty">
          <option v-for="option in difficultyOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
    <div class="preset-grid">
      <button
        v-for="preset in presets"
        :key="preset.title"
        class="preset-card"
        type="button"
        @click="emit('selectPreset', preset)"
      >
        <strong>{{ preset.title }}</strong>
        <span>{{ preset.focus }}</span>
        <small>{{ preset.fit }}</small>
      </button>
    </div>
  </section>
</template>
