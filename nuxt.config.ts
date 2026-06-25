export default defineNuxtConfig({
  compatibilityDate: '2026-06-25',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3.1:8b',
    databasePath: process.env.DATABASE_PATH || './data/persona-agent.sqlite'
  },
  nitro: {
    externals: {
      external: ['better-sqlite3']
    }
  }
})
