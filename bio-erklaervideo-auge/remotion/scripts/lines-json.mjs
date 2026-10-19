// Gibt alle Sätze mit Sprecher und Startzeit als JSON aus (für scripts/ki-stimme.py)
const {computeTiming} = await import(new URL("../src/script.ts", import.meta.url).href);
const T = computeTiming();
const lines = T.scenes.flatMap((s) => s.lines.map(({speaker, text, start, end}) => ({speaker, text, start, end})));
console.log(JSON.stringify({total: T.total, lines}, null, 1));
