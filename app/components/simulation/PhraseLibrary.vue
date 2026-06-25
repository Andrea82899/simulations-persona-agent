<script setup lang="ts">
import type { PhraseGroup } from '../../composables/useSimulationCatalog'

defineProps<{
  groups: PhraseGroup[]
}>()
</script>

<template>
  <section class="phrase-library">
    <div>
      <p class="eyebrow">Werkzeugkasten</p>
      <h2>Formulierungsbibliothek</h2>
    </div>
    <div class="phrase-grid">
      <article v-for="group in groups" :key="group.title">
        <h3>{{ group.title }}</h3>
        <ul>
          <li v-for="phrase in group.phrases" :key="phrase">{{ phrase }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
