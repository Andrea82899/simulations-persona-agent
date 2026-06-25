<script setup lang="ts">
import type { SessionSummary } from '../../../types/persona'

defineProps<{
  summary: SessionSummary
}>()
</script>

<template>
  <section class="summary">
    <h2>Auswertung</h2>
    <div class="summary-grid">
      <article>
        <h3>Insights</h3>
        <ul><li v-for="item in summary.insights" :key="item">{{ item }}</li></ul>
      </article>
      <article>
        <h3>Bedürfnisse</h3>
        <ul><li v-for="item in summary.needs" :key="item">{{ item }}</li></ul>
      </article>
      <article>
        <h3>Klärungspunkte</h3>
        <ul><li v-for="item in summary.objections" :key="item">{{ item }}</li></ul>
      </article>
      <article>
        <h3>Muster</h3>
        <ul><li v-for="item in summary.patterns" :key="item">{{ item }}</li></ul>
      </article>
      <article>
        <h3>Empfehlungen</h3>
        <ul><li v-for="item in summary.recommendations" :key="item">{{ item }}</li></ul>
      </article>
      <article v-if="summary.teamLearning?.length">
        <h3>Team-Lernen</h3>
        <ul><li v-for="item in summary.teamLearning" :key="item">{{ item }}</li></ul>
      </article>
      <article v-if="summary.practiceSentences?.length">
        <h3>Übungssätze</h3>
        <ul><li v-for="item in summary.practiceSentences" :key="item">{{ item }}</li></ul>
      </article>
    </div>
  </section>
</template>
