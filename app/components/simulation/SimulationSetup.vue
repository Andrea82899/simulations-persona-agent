<script setup lang="ts">
defineProps<{
  pending: boolean
}>()

const scenario = defineModel<string>('scenario', { required: true })
const emit = defineEmits<{
  start: []
}>()
</script>

<template>
  <div class="setup">
    <label for="scenario">
      <span>Feedbacksituation</span>
      <textarea id="scenario" v-model="scenario" rows="5" />
    </label>
    <button class="primary" :disabled="pending" @click="emit('start')">
      {{ pending ? 'Gespräch startet...' : 'Gespräch mit Lukas starten' }}
    </button>
  </div>
</template>
