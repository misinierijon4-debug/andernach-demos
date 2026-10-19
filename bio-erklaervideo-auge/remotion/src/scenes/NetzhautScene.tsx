import {AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig} from "remotion";
import {fadeIn, progress, sceneFade, visible} from "../anim";
import {C} from "../theme";
import {makeCue} from "../timing";
import {SceneTitle, Stage, Subline} from "../ui";

const cue = makeCue("netzhaut");

const ROWS = [360, 448, 536, 624, 712, 800];
const TYPES = ["S", "Z", "S", "S", "Z", "S"];
const MIDS = [404, 580, 756];

// Signalweg: Fotorezeptor → Bipolarzelle → Ganglienzelle → Sehnerv
const SIGNAL: ReadonlyArray<readonly [number, number]> = [
  [990, 536],
  [944, 540],
  [902, 562],
  [856, 580],
  [432, 580],
  [432, 850],
];
const segLen = SIGNAL.slice(1).map((p, i) => Math.hypot(p[0] - SIGNAL[i][0], p[1] - SIGNAL[i][1]));
const totalLen = segLen.reduce((a, b) => a + b, 0);
const pointAt = (f: number) => {
  let d = f * totalLen;
  for (let i = 0; i < segLen.length; i++) {
    if (d <= segLen[i]) {
      const k = d / segLen[i];
      return [SIGNAL[i][0] + (SIGNAL[i + 1][0] - SIGNAL[i][0]) * k, SIGNAL[i][1] + (SIGNAL[i + 1][1] - SIGNAL[i][1]) * k];
    }
    d -= segLen[i];
  }
  return SIGNAL[SIGNAL.length - 1];
};

const Photoreceptor = ({y, type}: {readonly y: number; readonly type: string}) => (
  <g>
    <line x1={990} y1={y} x2={1036} y2={y} stroke="#9AA8C2" strokeWidth={3} />
    <circle cx={990} cy={y} r={8} fill="#E3E8F2" stroke="#9AA8C2" strokeWidth={2} />
    <ellipse cx={1064} cy={y} rx={30} ry={20} fill="#EEF1F7" stroke="#9AA8C2" strokeWidth={2} />
    <circle cx={1064} cy={y} r={11} fill="#D46A7C" />
    <line x1={1094} y1={y} x2={1110} y2={y} stroke="#9AA8C2" strokeWidth={3} />
    <rect x={1110} y={y - 13} width={100} height={26} rx={13} fill="#E3E8F2" stroke="#9AA8C2" strokeWidth={2} />
    <line x1={1210} y1={y} x2={1226} y2={y} stroke="#9AA8C2" strokeWidth={3} />
    {type === "S" ? (
      <>
        <rect x={1226} y={y - 13} width={186} height={26} rx={6} fill="#CDD5E6" stroke="#8494B4" strokeWidth={2} />
        {Array.from({length: 22}, (_, k) => 1234 + k * 8).map((x) => (
          <line key={x} x1={x} y1={y - 11} x2={x} y2={y + 11} stroke="#8494B4" strokeWidth={1.5} opacity={0.6} />
        ))}
      </>
    ) : (
      <>
        <path d={`M1226,${y - 16} L1336,${y - 5} L1336,${y + 5} L1226,${y + 16} Z`} fill="#AFCBEC" stroke="#6E98CC" strokeWidth={2} strokeLinejoin="round" />
        {Array.from({length: 13}, (_, k) => 1234 + k * 8).map((x) => {
          const h = 14 - (10 * (x - 1226)) / 110;
          return <line key={x} x1={x} y1={y - h} x2={x} y2={y + h} stroke="#6E98CC" strokeWidth={1.5} opacity={0.6} />;
        })}
      </>
    )}
  </g>
);

const NetzhautInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const lightOn = cue("retina:2");
  const sigStart = cue("retina:4+1.6");
  const sigDraw = progress(frame, sigStart, 150);
  // erst wandert der Punkt mit der Linienspitze, danach pulsiert das Signal entlang des Wegs
  const pulseF = frame < sigStart + 150 ? sigDraw : ((frame - sigStart - 150) / 66) % 1;
  const [pxx, pyy] = pointAt(pulseF);

  const head = (s: string, x: number, y: number, at: number) => (
    <text x={x} y={y} textAnchor="middle" fontSize={32} fontWeight={600} fill={C.ink} opacity={fadeIn(frame, at)}>
      {s}
    </text>
  );
  const foot = (s: string, x: number, at: number, color: string) => (
    <text x={x} y={900} textAnchor="middle" fontSize={28} fontWeight={500} fill={color} opacity={fadeIn(frame, at)}>
      {s}
    </text>
  );

  return (
    <AbsoluteFill style={{opacity: sceneFade(frame, durationInFrames)}}>
      <Stage>
        <defs>
          <filter id="netGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform="translate(110,20)">
          <g opacity={fadeIn(frame, cue("retina:0+0.4"), 30)}>
            {/* Aderhaut + Pigmentzellen */}
            <rect x={1455} y={316} width={58} height={528} rx={10} fill="#EBC3B6" />
            {[340, 420, 500, 580, 660, 740, 820].map((y) => (
              <circle key={y} cx={1484} cy={y} r={9} fill="#C9555A" opacity={0.75} />
            ))}
            {ROWS.map((y) => (
              <rect key={y} x={1393} y={y - 41} width={60} height={82} rx={8} fill="#8C6A5A" stroke="#6E5244" strokeWidth={2} />
            ))}
            {ROWS.map((y, i) => (
              <Photoreceptor key={y} y={y} type={TYPES[i]} />
            ))}
            {/* Bipolarzellen */}
            {MIDS.map((ym, j) => (
              <g key={ym}>
                <path
                  d={`M854,${ym} C920,${ym} 930,${ROWS[2 * j]} 982,${ROWS[2 * j]} M854,${ym} C920,${ym} 930,${ROWS[2 * j + 1]} 982,${ROWS[2 * j + 1]}`}
                  fill="none"
                  stroke="#C97C77"
                  strokeWidth={3}
                />
                <line x1={806} y1={ym} x2={618} y2={ym} stroke="#C97C77" strokeWidth={3} />
                <ellipse cx={830} cy={ym} rx={26} ry={18} fill="#F4D0CB" stroke="#C97C77" strokeWidth={2} />
                <circle cx={830} cy={ym} r={8} fill="#D46A7C" />
              </g>
            ))}
            {/* Ganglienzellen + Sehnervfasern */}
            <line x1={430} y1={330} x2={430} y2={850} stroke="#E6C98F" strokeWidth={12} strokeLinecap="round" />
            {MIDS.map((ym) => (
              <g key={ym}>
                <line x1={564} y1={ym} x2={436} y2={ym} stroke="#D9A35E" strokeWidth={3} />
                <path d={`M612,${ym} l18,-16 M612,${ym} l18,16`} stroke="#D9A35E" strokeWidth={3} fill="none" />
                <circle cx={590} cy={ym} r={26} fill="#F6DDB2" stroke="#D9A35E" strokeWidth={2} />
                <circle cx={590} cy={ym} r={9} fill="#D46A7C" />
              </g>
            ))}
          </g>

          {/* Horizontal- und amakrine Zellen */}
          <g opacity={fadeIn(frame, cue("retina:5+1.0"), 20)}>
            <path d={`M965,352 L965,808 ${ROWS.map((y) => `M965,${y} L982,${y}`).join(" ")}`} stroke="#6F8FC4" strokeWidth={3} fill="none" />
            <ellipse cx={952} cy={492} rx={15} ry={24} fill="#D7E3F4" stroke="#6F8FC4" strokeWidth={2} />
          </g>
          <g opacity={fadeIn(frame, cue("retina:5+2.6"), 20)}>
            <path d={`M712,384 L712,776 ${MIDS.map((y) => `M700,${y} L724,${y}`).join(" ")}`} stroke="#7DA86E" strokeWidth={3} fill="none" />
            <ellipse cx={700} cy={668} rx={15} ry={22} fill="#DCEBD5" stroke="#7DA86E" strokeWidth={2} />
          </g>

          <text x={230} y={340} textAnchor="middle" fontSize={30} fontStyle="italic" fill={C.sub} opacity={fadeIn(frame, cue("retina:0+0.4"))}>
            Glaskörper
          </text>
          <text x={1300} y={ROWS[0] - 24} textAnchor="middle" fontSize={22} fill={C.sub} opacity={fadeIn(frame, cue("retina:2+8.0"))}>
            Stäbchen
          </text>
          <text x={1282} y={ROWS[1] - 26} textAnchor="middle" fontSize={22} fill={C.sub} opacity={fadeIn(frame, cue("retina:2+8.6"))}>
            Zapfen
          </text>

          {/* Licht läuft durch alle Schichten */}
          <g opacity={visible(frame, lightOn, cue("retina:4"))}>
            {[492, 602, 712].map((y, i) => {
              const p = progress(frame, lightOn + 10 + i * 8, 190);
              const x2 = 190 + (1222 - 190) * p;
              return (
                <g key={y}>
                  <line x1={190} y1={y} x2={x2} y2={y} stroke={C.light} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
                  <circle cx={x2} cy={y} r={9} fill={C.light} filter="url(#netGlow)" opacity={p > 0 && p < 1 ? 1 : 0.0} />
                  <path d={`M${1222},${y - 11} L${1240},${y} L${1222},${y + 11} Z`} fill={C.light} opacity={p >= 0.999 ? 1 : 0} />
                </g>
              );
            })}
          </g>

          {/* Signal zurück */}
          <g opacity={visible(frame, cue("retina:4"), cue("retina:5+1.2"))}>
            <polyline
              points={SIGNAL.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke={C.signal}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - sigDraw}
            />
            <circle cx={pxx} cy={pyy} r={11} fill={C.signal} filter="url(#netGlow)" opacity={frame >= sigStart ? 1 : 0} />
          </g>

          {head("Ganglienzellen", 590, 290, cue("retina:2+3.4"))}
          {head("Bipolarzellen", 830, 290, cue("retina:2+4.6"))}
          {head("Fotorezeptoren", 1180, 290, cue("retina:2+7.0"))}
          {head("Pigmentzellen", 1423, 250, cue("retina:3+0.3"))}
          {foot("Sehnerv", 430, cue("retina:4+7.4"), C.signal)}
          {foot("Amakrine Zelle", 712, cue("retina:5+2.6"), "#5E8A4F")}
          {foot("Horizontalzelle", 965, cue("retina:5+1.0"), "#4F72A8")}
          {foot("Aderhaut", 1484, cue("retina:3+1.6"), C.ink)}
        </g>
      </Stage>
      <SceneTitle>Aufbau der Netzhaut</SceneTitle>
      <Subline style={{opacity: fadeIn(frame, cue("retina:1+0.6"))}}>
        invers angeordnet: Das Licht durchquert erst die Nervenzellen
      </Subline>
    </AbsoluteFill>
  );
};

export const NetzhautScene = Interactive.create({
  Component: NetzhautInner,
  layout: "absolute-fill",
});
