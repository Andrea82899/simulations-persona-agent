# Security Policy

## Meldung von Sicherheitsproblemen

Bitte Sicherheitsprobleme nicht oeffentlich als Issue mit ausnutzbaren Details melden.

Wenn dieses Projekt in einem oeffentlichen Repository liegt, eroeffne bitte eine private Security Advisory oder kontaktiere die Maintainerin direkt ueber den dort angegebenen Kontaktweg.

## Lokales Datenmodell

Die App speichert Simulationen lokal in SQLite. Standardpfad:

```text
./data/persona-agent.sqlite
```

Der Ordner `data/` ist in `.gitignore` und sollte nicht veroeffentlicht werden.

## Bekannte Grenzen

- Version 1 ist ein lokales Einzelbenutzer-Tool ohne Login.
- Die App ist nicht als Multi-Tenant- oder Internet-Service gehaertet.
- Ollama laeuft lokal. Wer `OLLAMA_HOST` auf einen entfernten Server setzt, ist selbst fuer Transport, Zugriffsschutz und Datenschutz verantwortlich.
