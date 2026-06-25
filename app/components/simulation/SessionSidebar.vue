<script setup lang="ts">
import type { SessionListItem } from '../../composables/useSimulationCatalog'

const props = defineProps<{
  sessions: SessionListItem[]
  currentSessionId: number | null
}>()

const emit = defineEmits<{
  reset: []
  open: [id: number]
}>()

const searchQuery = shallowRef('')
const showAllSessions = shallowRef(false)
const visibleLimit = 6

const filteredSessions = computed(() => filterSessionsByQuery(props.sessions, searchQuery.value))
const visibleSessions = computed(() => limitSessions(filteredSessions.value, showAllSessions.value, visibleLimit))
const groupedVisibleSessions = computed(() => groupSessionsByPersona(visibleSessions.value))
const hiddenSessionCount = computed(() => Math.max(filteredSessions.value.length - visibleSessions.value.length, 0))
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
      <div class="history-heading">
        <h2>Gespeicherte Simulationen</h2>
        <span>{{ sessions.length }}</span>
      </div>
      <label class="history-search" for="session-search">
        <span class="sr-only">Gespeicherte Simulationen suchen</span>
        <input
          id="session-search"
          v-model="searchQuery"
          type="search"
          placeholder="Suchen..."
          @input="showAllSessions = false"
        >
      </label>
      <section v-for="group in groupedVisibleSessions" :key="group.personaName" class="history-persona-group">
        <h3>
          <span>{{ group.personaName }}</span>
          <small>{{ group.sessions.length }}</small>
        </h3>
        <button
          v-for="item in group.sessions"
          :key="item.id"
          class="history-item"
          :class="{ active: currentSessionId === item.id }"
          @click="emit('open', item.id)"
        >
          <strong>{{ item.scenario }}</strong>
          <span>{{ item.targetAudience }}</span>
        </button>
      </section>
      <p v-if="sessions.length === 0" class="muted">
        Noch keine gespeicherten Simulationen.
      </p>
      <p v-else-if="filteredSessions.length === 0" class="muted">
        Keine passende Simulation gefunden.
      </p>
      <button
        v-if="hiddenSessionCount > 0 || showAllSessions"
        class="history-toggle"
        type="button"
        @click="showAllSessions = !showAllSessions"
      >
        {{ showAllSessions ? 'Weniger anzeigen' : `${hiddenSessionCount} weitere anzeigen` }}
      </button>
    </div>
  </aside>
</template>
