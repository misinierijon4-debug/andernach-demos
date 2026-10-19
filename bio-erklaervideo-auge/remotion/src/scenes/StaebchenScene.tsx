import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {EASE_IN_OUT, fadeIn, keyframes, progress, sceneFade, visible} from "../anim";
import {C, SANS, SERIF} from "../theme";
import {makeCue} from "../timing";
import {Label, SceneTitle, Stage} from "../ui";

const cue = makeCue("staebchen");

const OS = "#F6DDD3";
const OS_S = "#D9A08E";
const IS = "#F7E9BE";
const IS_S = "#D2B86A";
const CHANNELS = [320, 400, 480];
const NA_OUT = [[460, 330], [500, 300], [545, 352], [470, 380], [530, 420], [455, 445], [505, 470], [550, 500], [470, 515], [560, 300], [445, 405]];
const CGMP = [[690, 445], [745, 440], [800, 455], [665, 485], [722, 488], [780, 492], [818, 420]];

const CAPTIONS: ReadonlyArray<readonly [string, string]> = [
  ["dark:0", "Rhodopsin (Rh) ist inaktiv."],
  ["dark:1", "cGMP hält die Na⁺-Kanäle offen."],
  ["dark:2", "Na⁺ strömt ein – die Membran liegt bei −30 mV."],
  ["dark:3", "An der Synapse wird ständig Glutamat ausgeschüttet."],
  ["dark:4", "Glutamat hemmt die Bipolarzelle."],
  ["light:0", "Ein Photon aktiviert Rhodopsin: Rh → Rh*"],
  ["light:1", "Rh* aktiviert Transducin: T → T*"],
  ["light:2", "T* aktiviert ein Enzym, das cGMP spaltet."],
  ["light:3", "Ohne cGMP schließen sich die Na⁺-Kanäle."],
  ["light:4", "Die Membran hyperpolarisiert auf −70 mV."],
  ["light:5", "Kein Glutamat mehr – die Hemmung fällt weg."],
  ["light:6", "Das Signal läuft über Bipolar- und Ganglienzelle zum Sehnerv."],
];

// Graph der Membranspannung
const GX = 1200;
const GW = 600;
const Y_HI = 400;
const Y_LO = 540;
const DROP = 0.52;
const LIGHT_X = 0.42;
const volt = (x: number) => (x < DROP ? -30 : -30 - 40 * EASE_IN_OUT(Math.min(1, (x - DROP) / 0.08)));

const StaebchenInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const t = frame / fps;
  const lightStart = cue("light:start");

  const inDark = fadeIn(frame, cue("dark:0+0.4"));
  const act = fadeIn(frame, cue("light:0+1.6"), 18);
  const ph = progress(frame, cue("light:0+0.4"), 36);
  const photonVis = ph > 0 ? 1 - fadeIn(frame, cue("light:2"), 30) : 0;
  const tGone = fadeIn(frame, cue("light:1+0.6"), 18);
  const tStar = fadeIn(frame, cue("light:1+0.6"), 24);
  const enzyme = fadeIn(frame, cue("light:2+0.6"), 24);
  const cgIn = fadeIn(frame, cue("dark:1+0.8"), 24);
  const split = progress(frame, cue("light:2+2.4"), 48);
  const cgBound = cgIn * (1 - fadeIn(frame, cue("light:3"), 24));
  const close = progress(frame, cue("light:3+0.4"), 36);
  const naIn = fadeIn(frame, cue("dark:1+3.4"), 24);
  const flow = fadeIn(frame, cue("dark:2"), 24) * (1 - close);
  const release = fadeIn(frame, cue("dark:3+0.6"), 24) * (1 - progress(frame, cue("light:5+0.4"), 42));

  const p = keyframes(frame, [
    [cue("dark:2"), 0],
    [cue("light:0"), 0.4],
    [cue("light:4+0.6"), DROP],
    [cue("light:end"), 1],
  ]);
  const plot = Array.from({length: 121}, (_, i) => {
    const x = (i / 120) * p;
    return `${GX + x * GW},${Y_HI + ((-30 - volt(x)) / 40) * (Y_LO - Y_HI)}`;
  }).join(" ");
  const v = volt(p);
  const graphIn = fadeIn(frame, cue("dark:2"), 20);

  let wave = "M960,170";
  for (let i = 1; i <= 24; i++) {
    const f = i / 24;
    const o = (i % 2 ? 1 : -1) * 9;
    wave += ` L${960 + (708 - 960) * f + o * 0.4},${170 + (278 - 170) * f + o}`;
  }

  return (
    <AbsoluteFill style={{opacity: sceneFade(frame, durationInFrames)}}>
      <Stage>
        <defs>
          <filter id="rodGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity={fadeIn(frame, 6, 24)}>
          {/* Stäbchen */}
          <rect x={610} y={250} width={240} height={260} rx={18} fill={OS} stroke={OS_S} strokeWidth={3} />
          <rect x={632} y={508} width={26} height={34} fill={OS} stroke={OS_S} strokeWidth={3} />
          <rect x={620} y={540} width={220} height={120} rx={20} fill={IS} stroke={IS_S} strokeWidth={3} />
          <rect x={633} y={505} width={24} height={40} fill={OS} />
          <ellipse cx={680} cy={585} rx={26} ry={11} fill="#E3A35B" transform="rotate(-25 680 585)" />
          <ellipse cx={780} cy={622} rx={26} ry={11} fill="#E3A35B" transform="rotate(-12 780 622)" />
          <rect x={705} y={657} width={50} height={24} fill={IS} />
          <circle cx={730} cy={712} r={36} fill={IS} stroke={IS_S} strokeWidth={3} />
          <circle cx={730} cy={712} r={18} fill="#FFFFFF" stroke={IS_S} strokeWidth={2} />
          <path d="M705,659 L755,659" stroke={IS} strokeWidth={4} />
          <rect x={714} y={746} width={32} height={28} fill={IS} />
          <path d="M714,748 L714,772 M746,748 L746,772" stroke={IS_S} strokeWidth={3} />
          <path d="M590,800 Q596,772 714,772 L746,772 Q864,772 870,800 Q870,812 852,812 L608,812 Q590,812 590,800 Z" fill={IS} stroke={IS_S} strokeWidth={3} />
          {Array.from({length: 11}, (_, k) => 620 + k * 22).map((x) => (
            <circle key={x} cx={x} cy={796} r={5} fill="#1E3A6B" opacity={0.85} />
          ))}
          <path d="M600,850 Q730,832 860,850 Q842,870 782,874 Q752,878 750,910 L710,910 Q708,878 678,874 Q618,870 600,850 Z" fill="#F4D0CB" stroke="#C97C77" strokeWidth={3} />

          {[
            ["Außensegment", 270, fadeIn(frame, cue("dark:0+0.4"))],
            ["Innensegment", 606, fadeIn(frame, cue("dark:0+0.9"))],
            ["Synapse", 806, fadeIn(frame, cue("dark:3+0.6"))],
            ["Bipolarzelle", 886, fadeIn(frame, cue("dark:4+0.6"))],
          ].map(([s, y, o]) => (
            <text key={s as string} x={885} y={y as number} fontSize={28} fontWeight={500} fill={C.sub} opacity={o as number}>
              {s}
            </text>
          ))}
        </g>

        {/* Na+-Kanäle */}
        {CHANNELS.map((y) => (
          <g key={y}>
            <rect x={596} y={y - 26 + 6 * close} width={28} height={20} rx={5} fill="#E8D9B5" stroke="#B79E62" strokeWidth={2} />
            <rect x={596} y={y + 6 - 6 * close} width={28} height={20} rx={5} fill="#E8D9B5" stroke="#B79E62" strokeWidth={2} />
            <circle cx={640} cy={y - 16} r={6} fill={C.cgmp} opacity={cgBound} />
          </g>
        ))}
        <g opacity={naIn}>
          <text x={470} y={278} fontSize={30} fontWeight={600} fill="#A87A00">
            Na⁺
          </text>
          <text x={520} y={558} textAnchor="middle" fontSize={22} fill={C.sub}>
            Na⁺-Kanäle
          </text>
          {NA_OUT.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={9} fill={C.naFill} stroke={C.na} strokeWidth={2.5} />
          ))}
        </g>
        {CHANNELS.flatMap((y, i) =>
          [0, 1, 2].map((k) => {
            const ph0 = k / 3 + i * 0.17;
            const q = (t * 0.45 + ph0) % 1;
            const o = flow * Math.min(1, q * 5, (1 - q) * 5);
            if (o <= 0.01) return null;
            return (
              <circle
                key={`${y}-${k}`}
                cx={560 + 160 * q}
                cy={y + Math.sin(q * 9 + ph0 * 6) * (q < 0.3 ? 4 : 14)}
                r={8}
                fill={C.naFill}
                stroke={C.na}
                strokeWidth={2.5}
                opacity={o}
              />
            );
          }),
        )}

        {/* Rhodopsin / Transducin / Enzym */}
        <g opacity={inDark}>
          <ellipse cx={690} cy={290} rx={16} ry={24} fill="#FF4D6A" filter="url(#rodGlow)" opacity={act * (0.55 + 0.35 * Math.sin(t * 5))} />
          <ellipse cx={690} cy={290} rx={11} ry={18} fill={C.red} />
          <text x={670} y={298} textAnchor="end" fontSize={24} fontWeight={700} fill={C.red}>
            {act > 0.5 ? "Rh*" : "Rh"}
          </text>
          <g opacity={1 - tGone}>
            <circle cx={790} cy={290} r={11} fill={C.red} />
            <text x={772} y={298} textAnchor="end" fontSize={24} fontWeight={700} fill={C.red}>
              T
            </text>
          </g>
        </g>
        <g opacity={tStar}>
          {[
            [660, 352],
            [770, 352],
          ].map(([x, y]) => (
            <g key={x}>
              <line x1={692} y1={310} x2={x + (x < 690 ? 6 : -8)} y2={y - 18} stroke={C.red} strokeWidth={2.5} />
              <circle cx={x} cy={y} r={11} fill={C.red} />
              <text x={x + 16} y={y + 8} fontSize={21} fontWeight={700} fill={C.red}>
                T*
              </text>
            </g>
          ))}
        </g>
        <g opacity={enzyme}>
          {[660, 770].map((x) => (
            <g key={x}>
              <line x1={x} y1={366} x2={x} y2={384} stroke={C.red} strokeWidth={2.5} />
              <rect x={x - 18} y={386} width={36} height={28} rx={10} fill="#6FA86E" />
              <text x={x} y={407} textAnchor="middle" fontSize={18} fontWeight={700} fill="#fff">
                E
              </text>
            </g>
          ))}
        </g>
        {CGMP.map(([x, y]) => (
          <g key={`${x}-${y}`} opacity={cgIn * (1 - split * 0.9)}>
            <path d={`M${x - 7 * split},${y - 7 + 4 * split} A7,7 0 0 0 ${x - 7 * split},${y + 7 + 4 * split} Z`} fill={C.cgmp} />
            <path d={`M${x + 7 * split},${y - 7 - 4 * split} A7,7 0 0 1 ${x + 7 * split},${y + 7 - 4 * split} Z`} fill={C.cgmp} />
          </g>
        ))}
        <Label x={885} y={470} px={806} py={456} size={28} color={C.cgmp} opacity={cgIn * (1 - fadeIn(frame, cue("light:3"), 18))}>
          cGMP
        </Label>

        {/* Photon */}
        <g opacity={photonVis}>
          <path d={wave} fill="none" stroke={C.light} strokeWidth={4} strokeLinejoin="round" filter="url(#rodGlow)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ph} />
          <text x={975} y={168} fontSize={26} fontWeight={600} fill="#A87A00" opacity={ph > 0.3 ? 1 : 0}>
            Licht
          </text>
        </g>

        {/* Glutamat */}
        {Array.from({length: 14}, (_, k) => {
          const ph0 = (k * 0.37) % 1;
          const q = (t * 0.6 + ph0) % 1;
          const o = release * Math.min(1, q * 6, (1 - q) * 4);
          if (o <= 0.01) return null;
          return <circle key={k} cx={616 + k * 17 + (k % 3) * 4 + Math.sin(q * 6 + ph0 * 9) * 3} cy={816 + q * 26} r={4.5} fill="#1E3A6B" opacity={o} />;
        })}
        <text x={572} y={836} textAnchor="end" fontSize={24} fontWeight={500} fill="#1E3A6B" opacity={visible(frame, cue("dark:3+0.6"), cue("light:5+1.6"))}>
          Glutamat
        </text>
        <text x={572} y={900} textAnchor="end" fontSize={30} fontWeight={600} fill={C.red} opacity={visible(frame, cue("dark:4+0.4"), cue("light:5+3.0"))}>
          Hemmung
        </text>
        <text x={572} y={900} textAnchor="end" fontSize={30} fontWeight={600} fill={C.green} opacity={fadeIn(frame, cue("light:5+3.0"))}>
          Hemmung fällt weg
        </text>
        <g opacity={fadeIn(frame, cue("light:6+0.5"))}>
          <line x1={730} y1={914} x2={730} y2={946} stroke={C.signal} strokeWidth={6} />
          <path d="M718,940 L730,958 L742,940 Z" fill={C.signal} />
        </g>

        {/* Graph Membranspannung */}
        <g opacity={graphIn}>
          <text x={GX} y={318} fontSize={24} fill={C.sub}>
            Membranspannung
          </text>
          <line x1={GX} y1={340} x2={GX} y2={580} stroke={C.faint} strokeWidth={2} />
          <line x1={GX} y1={580} x2={GX + GW} y2={580} stroke={C.faint} strokeWidth={2} />
          <line x1={GX} y1={Y_HI} x2={GX + GW} y2={Y_HI} stroke={C.rule} strokeWidth={2} strokeDasharray="6 8" />
          <line x1={GX} y1={Y_LO} x2={GX + GW} y2={Y_LO} stroke={C.rule} strokeWidth={2} strokeDasharray="6 8" />
          <text x={GX - 14} y={Y_HI + 8} textAnchor="end" fontSize={22} fill={C.sub}>
            −30
          </text>
          <text x={GX - 14} y={Y_LO + 8} textAnchor="end" fontSize={22} fill={C.sub}>
            −70
          </text>
          <text x={GX + GW} y={614} textAnchor="end" fontSize={22} fill={C.sub}>
            Zeit
          </text>
          <g opacity={p >= LIGHT_X ? 1 : 0}>
            <line x1={GX + LIGHT_X * GW} y1={350} x2={GX + LIGHT_X * GW} y2={580} stroke={C.light} strokeWidth={2.5} strokeDasharray="5 7" />
            <text x={GX + LIGHT_X * GW + 10} y={366} fontSize={20} fontWeight={600} fill="#A87A00">
              Licht
            </text>
          </g>
          <polyline points={plot} fill="none" stroke={v < -50 ? C.signal : C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          <text x={GX + GW} y={318} textAnchor="end" fontFamily={SERIF} fontSize={72} fill={v < -50 ? C.signal : C.ink}>
            −{Math.round(-v)} mV
          </text>
        </g>
      </Stage>

      {/* Erklärung des aktuellen Schritts */}
      {CAPTIONS.map(([at, text], i) => {
        const from = cue(at);
        const to = i + 1 < CAPTIONS.length ? cue(CAPTIONS[i + 1][0]) : undefined;
        const o = visible(frame, from, to, 12);
        if (o <= 0.001) return null;
        return (
          <div
            key={at}
            style={{
              position: "absolute",
              left: GX,
              top: 690,
              width: 620,
              fontFamily: SANS,
              fontSize: 40,
              lineHeight: 1.3,
              fontWeight: 500,
              color: C.ink,
              opacity: o,
              translate: interpolate(frame, [from, from + 16], ["0px 14px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
            }}
          >
            {text}
          </div>
        );
      })}

      <SceneTitle style={{opacity: visible(frame, 0, lightStart)}}>Stäbchen in der Dunkelheit</SceneTitle>
      <SceneTitle style={{opacity: visible(frame, lightStart)}}>Stäbchen bei Licht</SceneTitle>
    </AbsoluteFill>
  );
};

export const StaebchenScene = Interactive.create({
  Component: StaebchenInner,
  layout: "absolute-fill",
});
