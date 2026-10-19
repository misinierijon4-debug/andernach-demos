// Erzeugt aus src/script.ts: sprechertext.md, sprechertext.srt.
//   node --experimental-strip-types scripts/build-texts.mjs <zielordner>
import fs from 'fs';
import path from 'path';
const {computeTiming} = await import(new URL("../src/script.ts", import.meta.url).href);

const [outDir] = process.argv.slice(2);
const T = computeTiming();
const NAMES = { A: 'Person A', B: 'Person B' };

const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const srtTime = t => {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
// Jede Zeile bleibt bis kurz vor der nächsten stehen
const all = [];
T.scenes.forEach(s => s.lines.forEach(l => all.push({ ...l, scene: s })));
all.forEach((l, i) => { l.until = i + 1 < all.length ? Math.min(all[i + 1].start - 0.1, l.end + 1.2) : l.end + 1.5; });

// --- Markdown ---
const words = { A: 0, B: 0 };
all.forEach(l => { words[l.speaker] += l.text.split(/\s+/).length; });
let md = `# Sprechertext – Erklärvideo „Sinnesorgan Auge“\n\n`;
md += `Videolänge: **${mmss(T.total)} min** · Person A: ${words.A} Wörter · Person B: ${words.B} Wörter\n\n`;
md += `**So nehmt ihr auf**\n\n`;
md += `- Für die Aufnahme nehmt ihr am besten \`erklaervideo_auge_sprechhilfe.mp4\`. Dort steht unten immer, wer gerade spricht und was, und kurz vorher, wer als Nächstes dran ist. Danach legt ihr eure Tonspur unter \`erklaervideo_auge.mp4\` (ohne Text).\n`;
md += `- Die Zeitmarken zeigen, wann ein Satz beginnt. Die Animationen sind auf ein ruhiges Vorlesetempo abgestimmt. Wenn ihr etwas schneller oder langsamer seid, ist das kein Problem, die Pausen fangen das ab.\n`;
md += `- Ihr könnt Sätze umformulieren, solange die Reihenfolge der Begriffe bleibt (die Einblendungen kommen in dieser Reihenfolge).\n\n`;
T.scenes.forEach((s, i) => {
  md += `## ${i + 1}. ${s.title} (${mmss(s.start)}–${mmss(s.end)})\n\n`;
  md += `| Zeit | Wer | Text |\n|---|---|---|\n`;
  s.lines.forEach(l => { md += `| ${mmss(l.start)} | **${l.speaker}** | ${l.text} |\n`; });
  md += `\n`;
});
fs.writeFileSync(path.join(outDir, 'sprechertext.md'), md);

// --- SRT ---
const srt = all.map((l, i) => `${i + 1}\n${srtTime(l.start)} --> ${srtTime(l.until)}\n${NAMES[l.speaker]}: ${l.text}\n`).join('\n');
fs.writeFileSync(path.join(outDir, 'sprechertext.srt'), srt);

console.log('Texte geschrieben, Länge', mmss(T.total));
