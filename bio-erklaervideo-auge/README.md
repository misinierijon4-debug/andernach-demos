# Erklärvideo „Sinnesorgan Auge“ (Biologie)

Ein ruhiges, schlichtes Erklärvideo **ohne Ton** (5:52 min) zu den Themen *Aufbau des Auges und der Netzhaut* und *Signaltransduktion*. Es ist für ein Voice-over mit zwei Personen gedacht.

| Datei | Wofür |
|---|---|
| `erklaervideo_auge.mp4` | Saubere Version (1080p, 30 fps, stille Tonspur). Darunter kommt eure Aufnahme. |
| `erklaervideo_auge_sprechhilfe.mp4` | Gleiches Video mit eingeblendetem Text zum Mitlesen beim Aufnehmen („Person A/B: …“ und „als Nächstes: …“) |
| `sprechertext.md` | Sprechertext mit Zeitmarken, aufgeteilt auf Person A und B |
| `sprechertext.srt` | Gleicher Text als Untertitel-Datei (z. B. für CapCut, iMovie, VLC) |

## Ablauf

1. Intro
2. Das Auge im Querschnitt, Strahlengang, gelber und blinder Fleck (eine durchgehende Szene, am Ende Zoom auf den Augenhintergrund)
3. Aufbau der Netzhaut: inverse Anordnung, Licht hin, Signal zurück, Horizontalzellen und amakrine Zellen
4. Aufbau der Fotorezeptoren (Außensegment/Disks, Zilie, Innensegment)
5. Stäbchen und Zapfen im Vergleich
6. Signaltransduktion: Stäbchen in der Dunkelheit und bei Licht, mit Membranspannungs-Graph
7. Zusammenfassung der Kaskade
8. Outro mit Quellen

## Technik

Das Video ist ein [Remotion](https://www.remotion.dev)-Projekt (`remotion/`). Es ist nach den offiziellen Remotion-Best-Practices aufgebaut: Szenen als `Interactive.create()`-Komponenten auf einem `Track`, die auch einzeln als Kompositionen registriert sind. Alle Animationen laufen über `useCurrentFrame()` und `interpolate()`, die Schriften werden über `@remotion/fonts` geladen.

Das Timing kommt aus dem Sprechertext in `remotion/src/script.ts`. Jede Einblendung hängt an einem Satz. Wenn ihr dort Text ändert, verschieben sich alle Szenen und Einblendungen automatisch mit.

```bash
cd remotion
npm i
npm run dev                # Vorschau im Remotion Studio
bash scripts/build.sh      # rendert beide MP4s + Sprechertexte (braucht ffmpeg)
```

Quellen der Inhalte: Biologie heute – Erweiterte Ausgabe SII (2011), Biosphäre Neurobiologie SII (2016) sowie die Unterrichtsmaterialien M1/M2.
