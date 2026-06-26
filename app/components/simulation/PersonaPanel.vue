<script setup lang="ts">
import type { PersonaProfile } from '../../../types/persona'

defineProps<{
  persona: PersonaProfile
}>()
</script>

<template>
  <article class="persona-panel">
    <p class="eyebrow">Trainingsperson</p>
    <h2>{{ persona.name }}</h2>
    <p>{{ persona.background }}</p>
    <dl>
      <div>
        <dt>Motivation</dt>
        <dd>{{ persona.motivation }}</dd>
      </div>
      <div>
        <dt>Reaktion auf Kritik</dt>
        <dd>{{ persona.decisionBehavior }}</dd>
      </div>
      <div>
        <dt>Ton</dt>
        <dd>{{ persona.tone }}</dd>
      </div>
    </dl>
    <div class="chips">
      <span v-for="point in persona.painPoints" :key="point">{{ point }}</span>
    </div>
  </article>
</template>
