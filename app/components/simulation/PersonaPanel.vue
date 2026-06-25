<script setup lang="ts">
import type { PersonaProfile } from '../../../types/persona'

defineProps<{
  persona: PersonaProfile
}>()
</script>

<template>
  <article class="persona-panel">
    <p class="eyebrow">Aktive Persona</p>
    <h2>{{ persona.name }}</h2>
    <p>{{ persona.background }}</p>
    <dl>
      <div>
        <dt>Motivation</dt>
        <dd>{{ persona.motivation }}</dd>
      </div>
      <div>
        <dt>Entscheidung</dt>
        <dd>{{ persona.decisionBehavior }}</dd>
      </div>
      <div>
        <dt>Schweizer Tonalität</dt>
        <dd>{{ persona.tone }}</dd>
      </div>
    </dl>
    <div class="chips">
      <span v-for="point in persona.painPoints" :key="point">{{ point }}</span>
    </div>
  </article>
</template>
