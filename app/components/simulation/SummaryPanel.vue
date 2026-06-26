<script setup lang="ts">
import type { SessionSummary } from '../../../types/persona'

defineProps<{
  summary: SessionSummary
}>()
</script>

<template>
  <section class="summary">
    <p class="eyebrow">KI-Coach</p>
    <h2>Abschluss-Coaching nach WWW</h2>
    <div class="summary-grid">
      <article>
        <h3>Stärke</h3>
        <p>{{ summary.strength }}</p>
        <blockquote>{{ summary.strengthQuote }}</blockquote>
      </article>
      <article>
        <h3>Wichtigster Punkt</h3>
        <p>{{ summary.improvement }}</p>
        <blockquote>{{ summary.improvementQuote }}</blockquote>
      </article>
      <article>
        <h3>WWW-Blick</h3>
        <dl>
          <div>
            <dt>Wahrnehmung</dt>
            <dd>{{ summary.wwwFeedback.perception }}</dd>
          </div>
          <div>
            <dt>Wirkung</dt>
            <dd>{{ summary.wwwFeedback.effect }}</dd>
          </div>
          <div>
            <dt>Wunsch</dt>
            <dd>{{ summary.wwwFeedback.wish }}</dd>
          </div>
        </dl>
      </article>
      <article>
        <h3>Bessere Beispielsätze</h3>
        <ul><li v-for="item in summary.exampleSentences" :key="item">{{ item }}</li></ul>
      </article>
    </div>
  </section>
</template>
