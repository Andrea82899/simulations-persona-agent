# Lokaler Simulations-Persona-Agent

Eine deutsche Nuxt-App für lokale Kunden- und Benutzerpersona-Simulationen mit Ollama und SQLite.

## Start

1. Ollama installieren und starten.
2. Modell laden:

```bash
ollama pull llama3.1:8b
```

3. App entwickeln:

```bash
npm run dev
```

Falls das lokale Datei-Watching an ein macOS-Limit stösst, nutze den gebauten Server:

```bash
npm run build
npm run serve
```

Die App erwartet Ollama unter `http://localhost:11434`. Das Modell kann mit `OLLAMA_MODEL` geändert werden.

## Konfiguration

```bash
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
DATABASE_PATH=./data/persona-agent.sqlite
```

## Tests

```bash
npm test
npm run typecheck
```
