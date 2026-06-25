<script setup lang="ts">
import type { SessionListItem } from '../../composables/useSimulationCatalog'

defineProps<{
  sessions: SessionListItem[]
  currentSessionId: number | null
}>()

const emit = defineEmits<{
  reset: []
  open: [id: number]
}>()
</script>

<template>
  <aside class="sidebar">
    <div>
      <p class="eyebrow">Lokaler Agent</p>
      <h1>Swiss Persona Simulation</h1>
    </div>

    <button class="secondary full-width" @click="emit('reset')">
      Neue Simulation
    </button>

    <div class="history">
      <h2>Gespeicherte Simulationen</h2>
      <button
        v-for="item in sessions"
        :key="item.id"
        class="history-item"
        :class="{ active: currentSessionId === item.id }"
        @click="emit('open', item.id)"
      >
        <strong>{{ item.personaName }}</strong>
        <span>{{ item.scenario }}</span>
      </button>
      <p v-if="sessions.length === 0" class="muted">
        Noch keine gespeicherten Simulationen.
      </p>
    </div>
  </aside>
</template>
