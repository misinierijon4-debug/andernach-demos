# Erklärvideo „Sinnesorgan Auge“ (Biologie)

Ein ruhiges, schlichtes Erklärvideo **ohne Ton** zu den Themen *Aufbau des Auges und der Netzhaut* und *Signaltransduktion*. Es ist für ein Voice-over mit zwei Personen gedacht.

| Datei | Wofür |
|---|---|
| `erklaervideo_auge.mp4` | Saubere Version (1080p, 30 fps, stille Tonspur). Darunter kommt eure Aufnahme. |
| `erklaervideo_auge_sprechhilfe.mp4` | Gleiches Video mit eingeblendetem Text zum Mitlesen beim Aufnehmen: „Person A/B: …“ und der Hinweis „als Nächstes: …“ |
| `sprechertext.md` | Sprechertext mit Zeitmarken, aufgeteilt auf Person A und B |
| `sprechertext.srt` | Gleicher Text als Untertitel-Datei (z. B. für CapCut, iMovie, VLC) |

## Ablauf (ca. 6 Minuten)

1. Intro
2. Aufbau des Auges (Hornhaut, Iris/Pupille, Linse, Glaskörper, Netzhaut, Aderhaut, Sehnerv)
3. Strahlengang als Flussdiagramm
4. Gelber Fleck (Fovea) und blinder Fleck
5. Aufbau der Netzhaut: inverse Anordnung, Signalweg, Horizontalzellen und amakrine Zellen
6. Aufbau der Fotorezeptoren (Außensegment/Disks, Zilie, Innensegment)
7. Stäbchen und Zapfen im Vergleich (Tabelle)
8. Signaltransduktion: Dunkelheit (cGMP, Na⁺-Einstrom, −30 mV, Glutamat, Hemmung)
9. Signaltransduktion: Helligkeit (Rh* → T* → Enzym → cGMP ↓ → Kanäle zu → −70 mV → Hemmung fällt weg)
10. Zusammenfassung der Kaskade
11. Outro mit Quellen

## Neu rendern

Die Szenen sind SVG-Animationen (`src/video.html`). Ihr Timing kommt aus dem Sprechertext in `src/script.js`. Wenn ihr dort Text ändert, passen sich alle Einblendungen automatisch an.

```bash
bash src/build.sh        # benötigt Node + Playwright (Chromium) + ffmpeg
```

Eine einzelne Stelle als Bild ansehen: `src/video.html?t=120` im Browser öffnen (Zeit in Sekunden).

Quellen der Inhalte: Biologie heute – Erweiterte Ausgabe SII (2011), Biosphäre Neurobiologie SII (2016) sowie die Unterrichtsmaterialien M1/M2.
