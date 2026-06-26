# 2026-06-26 — Feedback Training Partner

## Summary
Die App wurde von einer allgemeinen Persona-Simulation zu einem fokussierten KI-Trainingspartner fuer schwierige Feedbackgespraeche umgebaut. Im Zentrum steht jetzt Lukas Berger als feste, konsistente Trainingsperson mit Abschluss-Coaching nach dem WWW-Modell.

## Changes
- Feste Persona Lukas Berger mit Biografie, Reizpunkten und defensiver Reaktion auf Kritik eingefuehrt.
- Startflow auf kurze Feedbacksituation reduziert.
- Stimmungsbarometer von verschlossen bis offen ergaenzt.
- Persona-Chat strikt von Coach-Auswertung getrennt.
- Abschluss-Coaching auf WWW-Modell, Staerke, wichtigsten Verbesserungspunkt und zwei bessere Beispielsätze umgestellt.
- Alte Persona-Generierung, Zwischen-Coach-Feedback und nicht mehr genutzte UI-Bausteine entfernt.
- README, Package-Metadaten, Typen, Schemata und Tests aktualisiert.

## Notes
- Bestehende alte Sessions koennen weiterhin in SQLite liegen, passen inhaltlich aber nicht mehr zum neuen Produktfokus.
- Verifiziert mit Tests, Typecheck, Build und lokalem HTML-Check auf `127.0.0.1:3000`.
