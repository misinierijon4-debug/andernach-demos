import type React from "react";
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {fadeIn, keyframes, progress, sceneFade, visible} from "../anim";
import {C, SANS} from "../theme";
import {makeCue} from "../timing";
import {Label, SceneTitle, Stage} from "../ui";

const cue = makeCue("auge");

const arc = (cx: number, cy: number, r: number, a1: number, a2: number) => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x1, y1] = p(a1);
  const [x2, y2] = p(a2);
  return `M${x1},${y1} A${r},${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2},${y2}`;
};

// Augenteile in Augen-Koordinaten (Mittelpunkt 960/600, Radius ~300)
const CORNEA = "M690.8,474.5 Q586,600 690.8,725.5";
const RETINA = arc(960, 600, 281, -130, 130);
const CHOROID = arc(960, 600, 289, -132, 132);
const NERVE = "M1231,662 L1440,662 Q1452,662 1452,674 L1452,706 Q1452,718 1440,718 L1212,718 A278,278 0 0 0 1231,662 Z";
const RAYS = [548, 600, 652].map((y0) =>
  y0 === 600
    ? "M500,600 L1238,600"
    : `M500,${y0} L646,${y0} L712,${600 + (y0 - 600) * 0.86} L772,${600 + (y0 - 600) * 0.66} L1238,600`,
);

/** kurzes, warmes Aufleuchten eines Augenteils */
const Glow: React.FC<{readonly at: number; readonly children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10, at + 45, at + 70], [0, 0.85, 0.85, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (o <= 0) return null;
  return (
    <g opacity={o} filter="url(#eyeGlow)">
      {children}
    </g>
  );
};

const STEPS: ReadonlyArray<readonly [string, string]> = [
  ["Licht", "path:0+1.2"],
  ["Hornhaut", "path:1+1.0"],
  ["Pupille", "path:1+2.8"],
  ["Linse", "path:2+0.3"],
  ["Glaskörper", "path:2+2.4"],
  ["Netzhaut", "path:3+0.8"],
];

const AugeInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const pathStart = cue("path:start");
  const spotsStart = cue("spots:start");

  // Kamera: Übersicht → Zoom auf den Augenhintergrund
  const z = progress(frame, spotsStart + 6, 50);
  const cam = {
    cx: interpolate(z, [0, 1], [1010, 1000]),
    cy: 560,
    s: interpolate(z, [0, 1], [1.15, 2.3]),
    fx: interpolate(z, [0, 1], [960, 1235]),
    fy: interpolate(z, [0, 1], [600, 640]),
  };
  const camT = `translate(${cam.cx},${cam.cy}) scale(${cam.s}) translate(${-cam.fx},${-cam.fy})`;

  // Beschriftung im Fokus: neueste voll, ältere gedimmt
  const focus = (at: number, next?: number) =>
    fadeIn(frame, at) * (next == null ? 1 : interpolate(frame, [next, next + 12], [1, 0.5], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));

  const c = {
    hornhaut: cue("eye:0+3.6"),
    iris: cue("eye:1+0.6"),
    pupille: cue("eye:1+1.8"),
    linse: cue("eye:1+3.2"),
    glas: cue("eye:2"),
    netzhaut: cue("eye:3+0.3"),
    ader: cue("eye:4+0.2"),
    nerv: cue("eye:4+2.6"),
  };

  const ray = keyframes(frame, [
    [cue("path:1"), 0],
    [cue("path:1+1.6"), 0.3],
    [cue("path:1+3.2"), 0.38],
    [cue("path:2"), 0.38],
    [cue("path:2+2.4"), 0.75],
    [cue("path:3"), 0.75],
    [cue("path:3+1.4"), 1],
  ]);
  const leftLabels = visible(frame, 0, pathStart);
  const rightLabels = visible(frame, 0, spotsStart + 6);
  const pulse = 1 + 0.12 * Math.sin(frame / 5);

  return (
    <AbsoluteFill style={{opacity: sceneFade(frame, durationInFrames)}}>
      <Stage>
        <defs>
          <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="rayGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={camT} opacity={fadeIn(frame, 8, 24)}>
          <circle cx={960} cy={600} r={290} fill={C.vitreous} />
          <path d={arc(960, 600, 297, -155, 155)} fill="none" stroke={C.sclera} strokeWidth={8} />
          <path d={`${CORNEA} Z`} fill="#E1EEF6" />
          <path d={CORNEA} fill="none" stroke={C.cornea} strokeWidth={7} strokeLinecap="round" />
          <path d={CHOROID} fill="none" stroke={C.choroid} strokeWidth={7} />
          <path d={RETINA} fill="none" stroke={C.retina} strokeWidth={9} />
          <rect x={694} y={470} width={12} height={92} rx={6} fill={C.iris} />
          <rect x={694} y={638} width={12} height={92} rx={6} fill={C.iris} />
          <line x1={742} y1={527} x2={712} y2={468} stroke={C.faint} strokeWidth={2} />
          <line x1={742} y1={673} x2={712} y2={732} stroke={C.faint} strokeWidth={2} />
          <ellipse cx={742} cy={600} rx={30} ry={74} fill={C.lens} stroke="#8DB6D3" strokeWidth={3} />
          <path d={NERVE} fill={C.nerve} stroke={C.nerveStroke} strokeWidth={3} />
          <path d="M1240,676 L1440,676 M1236,690 L1440,690 M1230,704 L1440,704" stroke="#DDBF85" strokeWidth={2} fill="none" />
          <circle cx={1240} cy={600} r={10} fill="#EFBF2A" />

          <Glow at={c.hornhaut}>
            <path d={CORNEA} fill="none" stroke={C.light} strokeWidth={14} />
          </Glow>
          <Glow at={c.linse}>
            <ellipse cx={742} cy={600} rx={34} ry={78} fill="none" stroke={C.light} strokeWidth={10} />
          </Glow>
          <Glow at={c.netzhaut}>
            <path d={RETINA} fill="none" stroke={C.light} strokeWidth={16} />
          </Glow>
          <Glow at={c.ader}>
            <path d={CHOROID} fill="none" stroke={C.light} strokeWidth={14} />
          </Glow>
          <Glow at={c.nerv}>
            <path d={NERVE} fill="none" stroke={C.light} strokeWidth={10} />
          </Glow>

          {/* Strahlengang */}
          <g opacity={visible(frame, pathStart, spotsStart + 10)} filter="url(#rayGlow)">
            {RAYS.map((d) => (
              <path
                key={d}
                d={d}
                fill="none"
                stroke={C.light}
                strokeWidth={4.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ray}
              />
            ))}
          </g>
        </g>

        {/* Beschriftungen: Aufbau */}
        <g opacity={leftLabels}>
          <Label x={540} y={340} px={651} py={468} anchor="end" opacity={focus(c.hornhaut, c.iris)}>Hornhaut</Label>
          <Label x={540} y={450} px={711} py={451} anchor="end" opacity={focus(c.iris, c.pupille)}>Iris</Label>
          <Label x={540} y={565} px={711} py={560} anchor="end" opacity={focus(c.pupille, c.linse)}>Pupille</Label>
          <Label x={540} y={700} px={759} py={623} anchor="end" opacity={focus(c.linse, c.glas)}>Linse</Label>
        </g>
        <text x={1016} y={410} textAnchor="middle" fontSize={32} fontStyle="italic" fill={C.sub} opacity={focus(c.glas, c.netzhaut) * visible(frame, 0, spotsStart)}>
          Glaskörper
        </text>
        <g opacity={rightLabels}>
          <Label x={1640} y={262} px={1218} py={313} opacity={focus(c.netzhaut, c.ader)}>Netzhaut</Label>
          <Label x={1640} y={345} px={1272} py={355} opacity={focus(c.ader, c.nerv)}>Aderhaut</Label>
          <Label x={1640} y={676} px={1576} py={664} opacity={focus(c.nerv)}>Sehnerv</Label>
        </g>

        {/* Strahlengang als Liste */}
        <g opacity={visible(frame, pathStart, spotsStart)}>
          {STEPS.map(([s, at], i) => {
            const t = cue(at);
            const next = i + 1 < STEPS.length ? cue(STEPS[i + 1][1]) : undefined;
            const y = 330 + i * 92;
            const active = next == null || frame < next;
            return (
              <g key={s} opacity={fadeIn(frame, t)}>
                {i > 0 ? <line x1={142} y1={y - 92 + 14} x2={142} y2={y - 26} stroke={C.light} strokeWidth={3} opacity={0.6} /> : null}
                <circle cx={142} cy={y - 14} r={active ? 10 : 7} fill={active ? C.light : C.faint} />
                <text x={176} y={y} fontSize={44} fontWeight={500} fill={active ? C.ink : C.sub}>
                  {s}
                </text>
              </g>
            );
          })}
          <text x={176} y={330 + 5 * 92 + 50} fontSize={30} fill={C.light} fontWeight={500} opacity={fadeIn(frame, cue("path:3+3.2"))}>
            → Fotorezeptoren
          </text>
        </g>

        {/* Gelber und blinder Fleck */}
        <g opacity={fadeIn(frame, cue("spots:1"))}>
          <circle cx={1011} cy={468} r={20 * pulse} fill="none" stroke="#E0A800" strokeWidth={3.5} />
          <Label x={1180} y={360} px={1011} py={468} size={40} note="höchste Zapfendichte – schärfstes Sehen">
            Gelber Fleck (Fovea)
          </Label>
        </g>
        <g opacity={fadeIn(frame, cue("spots:2"))}>
          <circle cx={970} cy={675} r={24 * pulse} fill="none" stroke={C.signal} strokeWidth={3.5} />
          <Label x={1180} y={830} px={970} py={675} size={40} note="Sehnerv tritt aus – keine Fotorezeptoren">
            Blinder Fleck
          </Label>
        </g>
      </Stage>

      <div
        style={{
          position: "absolute",
          left: 120,
          top: 760,
          width: 620,
          fontFamily: SANS,
          fontSize: 36,
          lineHeight: 1.35,
          color: C.ink,
          opacity: fadeIn(frame, cue("spots:3+0.4"), 18),
        }}
      >
        Wir merken nichts davon: Das Gehirn ergänzt die Lücke mit dem Bild des anderen Auges.
      </div>

      <SceneTitle style={{opacity: visible(frame, 0, pathStart)}}>Das Auge im Querschnitt</SceneTitle>
      <SceneTitle style={{opacity: visible(frame, pathStart, spotsStart)}}>Der Strahlengang</SceneTitle>
      <SceneTitle style={{opacity: visible(frame, spotsStart)}}>Gelber und blinder Fleck</SceneTitle>
    </AbsoluteFill>
  );
};

export const AugeScene = Interactive.create({
  Component: AugeInner,
  layout: "absolute-fill",
});
