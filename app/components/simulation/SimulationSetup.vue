<script setup lang="ts">
defineProps<{
  pending: boolean
}>()

const scenario = defineModel<string>('scenario', { required: true })
const targetAudience = defineModel<string>('targetAudience', { required: true })
const emit = defineEmits<{
  start: []
}>()
</script>

<template>
  <div class="setup">
    <label for="scenario">
      <span>Szenario</span>
      <textarea id="scenario" v-model="scenario" rows="4" />
    </label>
    <label for="target-audience">
      <span>Zielgruppe</span>
      <textarea id="target-audience" v-model="targetAudience" rows="4" />
    </label>
    <button class="primary" :disabled="pending" @click="emit('start')">
      {{ pending ? 'Generiere Persona...' : 'Neue Persona generieren' }}
    </button>
  </div>
</template>
