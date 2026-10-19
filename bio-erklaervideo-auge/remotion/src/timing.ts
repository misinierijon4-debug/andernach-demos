import {computeTiming} from "./script";

export const FPS = 30;
export const TIMING = computeTiming();
const byId = Object.fromEntries(TIMING.scenes.map((s) => [s.id, s]));

// Eine Remotion-Szene kann mehrere Abschnitte des Sprechertexts umfassen,
// damit z. B. das Auge zwischen Aufbau, Strahlengang und Fovea stehen bleibt.
export const GROUPS = {
  intro: ["intro"],
  auge: ["eye", "path", "spots"],
  netzhaut: ["retina"],
  rezeptoren: ["receptors"],
  vergleich: ["compare"],
  transduktion: ["st"],
  staebchen: ["dark", "light"],
  zusammenfassung: ["summary"],
  outro: ["outro"],
} as const;
export type GroupId = keyof typeof GROUPS;

const sec = (t: number) => Math.round(t * FPS);

export const groupFrom = (g: GroupId) => sec(byId[GROUPS[g][0]].start);
export const groupDuration = (g: GroupId) => {
  const ids = GROUPS[g];
  return sec(byId[ids[ids.length - 1]].end) - groupFrom(g);
};
export const TOTAL_FRAMES = sec(TIMING.total);

// "path:1+0.8" -> Sekunden. Erlaubt: <szene>:<satz>, <szene>:start, <szene>:end
export const cueSeconds = (spec: string) => {
  const m = /^(\w+):(\w+)([+-][\d.]+)?$/.exec(spec);
  if (!m || !byId[m[1]]) throw new Error(`Unbekannter Cue: ${spec}`);
  const s = byId[m[1]];
  const off = m[3] ? parseFloat(m[3]) : 0;
  if (m[2] === "start") return s.start + off;
  if (m[2] === "end") return s.end + off;
  const line = s.lines[Number(m[2])];
  if (!line) throw new Error(`Satz fehlt: ${spec}`);
  return line.start + off;
};

// Frame relativ zum Anfang der Remotion-Szene
export const makeCue = (g: GroupId) => (spec: string) => sec(cueSeconds(spec)) - groupFrom(g);
