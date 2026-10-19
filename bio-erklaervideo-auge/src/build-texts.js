// Erzeugt aus script.js: sprechertext.md, sprechertext.srt und die ASS-Datei für die Sprechhilfe-Version.
//   node build-texts.js <zielordner> <ass-datei>
const fs = require('fs');
const path = require('path');
const { computeTiming } = require('./script.js');

const [outDir, assFile] = process.argv.slice(2);
const T = computeTiming();
const NAMES = { A: 'Person A', B: 'Person B' };

const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const srtTime = t => {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const assTime = t => {
  const cs = Math.round(t * 100);
  return `${Math.floor(cs / 360000)}:${String(Math.floor(cs / 6000) % 60).padStart(2, '0')}:${String(Math.floor(cs / 100) % 60).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`;
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
md += `- Für die Aufnahme nehmt ihr am besten \`erklaervideo_auge_sprechhilfe.mp4\`. Dort steht unten immer, wer gerade spricht und was. Danach legt ihr eure Tonspur unter \`erklaervideo_auge.mp4\` (ohne Text).\n`;
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

// --- ASS (Sprechhilfe) ---
const COL = { A: '&H00FFA86F&', B: '&H005BB2FF&' }; // BGR: A blau, B orange
let ass = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Line,Inter,34,&H00FFFFFF,&H000000FF,&H30302A22,&H00000000,0,0,0,0,100,100,0,0,3,16,0,2,180,180,26,1
Style: Next,Inter,24,&H00C8C8C8,&H000000FF,&H30302A22,&H00000000,0,0,0,0,100,100,0,0,3,10,0,8,180,180,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
all.forEach((l, i) => {
  ass += `Dialogue: 0,${assTime(l.start)},${assTime(l.until)},Line,,0,0,0,,{\\b1\\c${COL[l.speaker]}}${NAMES[l.speaker]}:{\\b0\\c&H00FFFFFF&}  ${l.text}\n`;
  // Vorwarnung oben rechts: wer als Nächstes dran ist
  const n = all[i + 1];
  if (n && n.speaker !== l.speaker) {
    const from = Math.max(l.start, n.start - 2.5);
    ass += `Dialogue: 0,${assTime(from)},${assTime(n.start)},Next,,0,0,0,,{\\an9\\c${COL[n.speaker]}}als Nächstes: ${NAMES[n.speaker]}\n`;
  }
});
fs.writeFileSync(assFile, ass);
console.log('Texte geschrieben, Länge', mmss(T.total));
