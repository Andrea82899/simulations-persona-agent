# Simulations-Persona-Agent

Lokale Nuxt-App fuer Trainingssimulationen mit Persona-Chat, Coach-Feedback und Team-Auswertung. Die App nutzt Ollama lokal als Modell-Service und speichert Sessions in SQLite.

## Wofuer ist das?

Das Tool hilft Teams, anspruchsvolle Gespraechssituationen zu trainieren:

- Interventionstechniken in Mitarbeitendengespraechen
- Reframing, Grenzen setzen und Fokus halten
- Stille aushalten und Kontakt herstellen
- Emotionen anerkennen, ohne das Thema zu verlieren
- Team-Auswertung mit konkreten Uebungssaetzen

Die App laeuft lokal. Standardmaessig werden keine Daten an Cloud-Dienste gesendet.

## Funktionen

- Feste Simulationspersonas wie Rajani, Luca, Bernd, Sasha, Miriam und Finn
- Trainingsfokus und Schwierigkeitsgrad
- Trainingskarten fuer Meeting, Feedback, Widerstand, Stille, Konflikt, Verbindlichkeit und Entscheidung
- Freier Persona-Chat
- Coach-Feedback automatisch nach 10 Interaktionen oder jederzeit auf Nachfrage
- Feld zum Ueben einer verbesserten Antwort
- Formulierungsbibliothek
- SQLite-Speicherung von Sessions, Chatverlauf, Feedback und Zusammenfassungen

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

- `POST /api/personas/generate`
- `POST /api/sessions`
- `GET /api/sessions`
- `GET /api/sessions/:id`
- `POST /api/chat`
- `POST /api/sessions/:id/summary`

## Open Source

Dieses Projekt steht unter der MIT-Lizenz. Beitraege sind willkommen. Bitte siehe `CONTRIBUTING.md` und `SECURITY.md`.
