"""Demo-Voice-over mit zwei Piper-Stimmen, synchron zum Video.

    node --experimental-strip-types scripts/lines-json.mjs > lines.json
    python ki-stimme.py lines.json <stimme_A.onnx> <stimme_B.onnx> out.wav

Jeder Satz startet genau an seinem Zeitpunkt aus src/script.ts. Ist die Aufnahme
länger als die Lücke bis zum nächsten Satz, wird der Satz etwas schneller gesprochen.
"""

import json
import sys
import wave

import numpy as np
from piper import PiperVoice
from piper.config import SynthesisConfig

# Aussprache-Hilfen für die Sprachsynthese
SPOKEN = {
    "cGMP": "Zeh Geh Emm Peh",
    "Natrium-Ionenkanäle": "Natrium-Ionen-Kanäle",
}
SENTENCE_PAUSE = 0.22
MIN_SCALE = 0.8
BASE_SCALE = {"A": 1.0, "B": 0.9}  # Stimme B spricht von Haus aus langsamer
GAP_AFTER = 0.25  # Mindestpause, bevor der nächste Satz beginnt


def load(path):
    voice = PiperVoice.load(path)
    to_ids = voice.phonemes_to_ids

    # Piper zerlegt "ç" (ich-Laut) in "c" + Cedille; die Stimmen kennen nur das ganze Zeichen
    def fixed(phonemes):
        out = []
        for p in phonemes:
            if p == "̧" and out and out[-1] == "c":
                out[-1] = "ç"
                continue
            out.append(p)
        return to_ids(out)

    voice.phonemes_to_ids = fixed
    return voice


def speak(voice, text, scale):
    for a, b in SPOKEN.items():
        text = text.replace(a, b)
    rate = voice.config.sample_rate
    parts = []
    for chunk in voice.synthesize(text, SynthesisConfig(length_scale=scale)):
        parts.append(chunk.audio_float_array)
        parts.append(np.zeros(int(SENTENCE_PAUSE * rate), dtype=np.float32))
    return np.concatenate(parts[:-1]) if parts else np.zeros(0, dtype=np.float32)


def main():
    lines_path, voice_a, voice_b, out_path = sys.argv[1:5]
    data = json.load(open(lines_path, encoding="utf-8"))
    voices = {"A": load(voice_a), "B": load(voice_b)}
    rate = voices["A"].config.sample_rate
    assert voices["B"].config.sample_rate == rate

    track = np.zeros(int((data["total"] + 1) * rate), dtype=np.float32)
    lines = data["lines"]
    free_at = 0.0  # Zeitpunkt, ab dem niemand mehr spricht
    for i, line in enumerate(lines):
        voice = voices[line["speaker"]]
        start_t = max(line["start"], free_at)
        slot = (lines[i + 1]["start"] if i + 1 < len(lines) else data["total"]) - start_t - 0.15
        base = BASE_SCALE[line["speaker"]]
        scale = base
        audio = speak(voice, line["text"], scale)
        if len(audio) / rate > slot:
            scale = max(MIN_SCALE, base * slot / (len(audio) / rate) * 0.98)
            audio = speak(voice, line["text"], scale)
        start = int(start_t * rate)
        track[start : start + len(audio)] += audio[: len(track) - start]
        free_at = start_t + len(audio) / rate + GAP_AFTER
        shift = start_t - line["start"]
        print(f"{line['start']:7.1f}s  {line['speaker']}  {len(audio) / rate:5.1f}s / {slot:5.1f}s  x{1 / scale:.2f}" + (f"  (+{shift:.1f}s)" if shift > 0.01 else ""))

    track = np.clip(track / max(1e-6, np.abs(track).max()) * 0.9, -1, 1)
    with wave.open(out_path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes((track * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main()
