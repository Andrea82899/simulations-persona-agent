# Contributing

Danke fuer dein Interesse am Simulations-Persona-Agent.

## Entwicklung starten

```bash
npm install
cp .env.example .env
ollama pull llama3.2:3b
npm run dev
```

## Vor einem Pull Request

Bitte pruefen:

```bash
npm test
npm run typecheck
npm run build
```

## Stil und Produktprinzipien

- Deutsch und Schweizer Hochdeutsch bevorzugen.
- Keine Cloud-Abhaengigkeit einbauen, solange sie nicht optional und klar dokumentiert ist.
- Persona-Chat und Analyse trennen: Die Persona bleibt in Rolle, Auswertung passiert separat.
- Dramatisierende Begriffe vermeiden; konstruktiv und loesungsorientiert formulieren.
- Keine echten personenbezogenen Daten in Tests oder Beispieldaten aufnehmen.

## Issues

Gute Issues enthalten:

- was du versucht hast
- was passiert ist
- was du erwartet hast
- Betriebssystem, Node-Version und Ollama-Modell

## Pull Requests

Halte PRs moeglichst fokussiert. Kleine, gut pruefbare Aenderungen sind einfacher zu reviewen als grosse Mischpakete.
