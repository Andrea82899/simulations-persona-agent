# KI-Trainingspartner fuer Feedbackgespraeche

Lokale Nuxt-App zum Ueben schwieriger Feedbackgespraeche mit einer konsistenten KI-Persona und einem getrennten Abschluss-Coach. Die App nutzt Ollama lokal als Modell-Service und speichert Sessions in SQLite.

## Wofuer ist das?

Das Tool hilft Fuehrungskraeften, schwierige Feedback- und Kritikgespraeche zu trainieren:

- Feedback geben, ohne Beziehungen im echten Alltag zu riskieren
- Konkrete Beobachtung, Wirkung und Wunsch nach dem WWW-Modell formulieren
- Defensivitaet auffangen und mit Wertschätzung sowie offenen Fragen arbeiten
- Ein Gespraech mehrfach wiederholen und die eigene Wirkung verbessern

Die App laeuft lokal. Standardmaessig werden keine Daten an Cloud-Dienste gesendet.

## Funktionen

- Feste Trainingsperson: Lukas Berger, fachlich stark, aber zuletzt mit gerissenen Deadlines und schwacher Uebergabe
- Kurze Szenario-Beschreibung als Startpunkt
- Freier Chat mit Lukas, der bei Kritik defensiv reagiert und sich bei echter Wertschätzung oeffnet
- Stimmungsbarometer von verschlossen bis offen
- Abschluss-Coaching nach dem WWW-Modell
- Konkrete Staerke, wichtigster Verbesserungspunkt und zwei bessere Beispielsätze
- SQLite-Speicherung von Sessions, Chatverlauf und Abschluss-Coachings

## Voraussetzungen

- Node.js 22 oder neuer
- npm
- Ollama
- Lokales Modell, empfohlen: `llama3.2:3b`

Ollama-Modell laden:

```bash
ollama pull llama3.2:3b
```

## Lokaler Start

```bash
npm install
cp .env.example .env
npm run build
npm run serve
```

Danach im Browser oeffnen:

```text
http://127.0.0.1:3000/
```

Fuer Entwicklung:

```bash
npm run dev
```

## Konfiguration

Siehe `.env.example`:

```bash
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
DATABASE_PATH=./data/persona-agent.sqlite
```

Wenn `llama3.2:3b` zu langsam oder nicht passend ist, kann nur `OLLAMA_MODEL` gewechselt werden. Die App-Architektur bleibt gleich.

## Tests

```bash
npm test
npm run typecheck
npm run build
```

Oder kompakt:

```bash
npm run check
```

## Datenschutz

Die App ist als lokales Einzelbenutzer-Tool gebaut:

- Chatverlaeufe liegen lokal in SQLite.
- Die SQLite-Datei liegt standardmaessig unter `./data/persona-agent.sqlite`.
- Der Ordner `data/` ist absichtlich in `.gitignore`.
- Keine Logins, keine Cloud-Synchronisierung, kein Tracking.

## Projektstruktur

```text
app/                 Nuxt UI
server/api/          Server-API-Routen
server/lib/          Ollama-, SQLite- und Schema-Logik
test/                API- und Datenbanktests
types/               Gemeinsame TypeScript-Typen
```

## API

- `POST /api/sessions`
- `GET /api/sessions`
- `GET /api/sessions/:id`
- `POST /api/chat`
- `POST /api/sessions/:id/summary`

## Open Source

Dieses Projekt steht unter der MIT-Lizenz. Beitraege sind willkommen. Bitte siehe `CONTRIBUTING.md` und `SECURITY.md`.
