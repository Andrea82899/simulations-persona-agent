export default defineNuxtConfig({
  compatibilityDate: '2026-06-25',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'de-CH'
      }
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2:3b',
    databasePath: process.env.DATABASE_PATH || './data/persona-agent.sqlite'
  },
  nitro: {
    externals: {
      external: ['better-sqlite3']
    }
  },
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    }
  }
})
