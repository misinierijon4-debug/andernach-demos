import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {fadeIn, sceneFade} from "../anim";
import {C} from "../theme";
import {makeCue} from "../timing";
import {Label, SceneTitle, Stage, Subline} from "../ui";

const cue = makeCue("rezeptoren");
const BEIGE = "#F3E9CF";
const BEIGE_S = "#D4C08F";

const Cell = ({y, type}: {readonly y: number; readonly type: "S" | "Z"}) => (
  <g>
    {type === "S" ? (
      <>
        <rect x={260} y={y - 45} width={600} height={90} rx={14} fill="#D8DEEA" stroke="#8494B4" strokeWidth={3} />
        {Array.from({length: 65}, (_, k) => 272 + k * 9).map((x) => (
          <line key={x} x1={x} y1={y - 40} x2={x} y2={y + 40} stroke="#8494B4" strokeWidth={2} opacity={0.5} />
        ))}
      </>
    ) : (
      <>
        <path d={`M420,${y - 12} Q412,${y} 420,${y + 12} L860,${y + 38} L860,${y - 38} Z`} fill="#C8DAF1" stroke="#6E98CC" strokeWidth={3} strokeLinejoin="round" />
        {Array.from({length: 48}, (_, k) => 430 + k * 9).map((x) => {
          const h = 11 + (24 * (x - 420)) / 440;
          return <line key={x} x1={x} y1={y - h} x2={x} y2={y + h} stroke="#6E98CC" strokeWidth={2} opacity={0.5} />;
        })}
      </>
    )}
    <rect x={858} y={y - 7} width={34} height={14} rx={7} fill={BEIGE} stroke={BEIGE_S} strokeWidth={2} />
    <path d={`M890,${y - 30} Q1000,${y - 44} 1270,${y - 40} L1270,${y + 40} Q1000,${y + 44} 890,${y + 30} Z`} fill={BEIGE} stroke={BEIGE_S} strokeWidth={3} />
    <ellipse cx={1340} cy={y} rx={74} ry={52} fill={BEIGE} stroke={BEIGE_S} strokeWidth={3} />
    <rect x={1266} y={y - 37} width={12} height={74} fill={BEIGE} />
    {[
      [960, -12, 20],
      [1040, 14, -15],
      [1120, -10, 10],
      [1190, 12, -20],
    ].map(([x, dy, rot]) => (
      <ellipse key={x} cx={x} cy={y + dy} rx={22} ry={9} fill="#E3A35B" transform={`rotate(${rot} ${x} ${y + dy})`} />
    ))}
    {[
      [920, 14],
      [1000, -18],
      [1080, 20],
      [1150, -22],
      [1230, 8],
    ].map(([x, dy]) => (
      <circle key={x} cx={x} cy={y + dy} r={4} fill="#C9A66B" />
    ))}
    <ellipse cx={1340} cy={y} rx={46} ry={36} fill="#C9506A" />
    <path d={`M1410,${y - 10} L1470,${y - 8} L1470,${y + 8} L1410,${y + 10} Z`} fill={BEIGE} stroke={BEIGE_S} strokeWidth={3} />
    <path
      d={`M1468,${y} Q1500,${y - 40} 1540,${y - 46} M1468,${y} L1548,${y} M1468,${y} Q1500,${y + 40} 1540,${y + 46}`}
      fill="none"
      stroke={BEIGE_S}
      strokeWidth={7}
      strokeLinecap="round"
    />
  </g>
);

const RezeptorenInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const focus = (at: number, next?: number) =>
    fadeIn(frame, at) * (next == null ? 1 : interpolate(frame, [next, next + 12], [1, 0.5], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));

  const c = {
    aussen: cue("receptors:1+1.4"),
    innen: cue("receptors:1+2.6"),
    zilie: cue("receptors:1+4.0"),
    kern: cue("receptors:2+0.6"),
    org: cue("receptors:2+1.8"),
    syn: cue("receptors:2+3.4"),
    disks: cue("receptors:3+0.4"),
  };

  const brace = (x1: number, x2: number, s: string, opacity: number) => (
    <g opacity={opacity}>
      <path d={`M${x1},758 L${x1},770 L${x2},770 L${x2},758 M${(x1 + x2) / 2},770 L${(x1 + x2) / 2},780`} fill="none" stroke={C.ink} strokeOpacity={0.45} strokeWidth={2} />
      <text x={(x1 + x2) / 2} y={820} textAnchor="middle" fontSize={32} fontWeight={500} fill={C.ink}>
        {s}
      </text>
    </g>
  );

  return (
    <AbsoluteFill style={{opacity: sceneFade(frame, durationInFrames)}}>
      <Stage>
        <g opacity={fadeIn(frame, cue("receptors:0+0.4"), 30)}>
          <Cell y={420} type="Z" />
          <Cell y={680} type="S" />
          <text x={420} y={362} fontSize={36} fontWeight={600} fill={C.ink}>
            Zapfen
          </text>
          <text x={260} y={612} fontSize={36} fontWeight={600} fill={C.ink}>
            Stäbchen
          </text>
        </g>
        {brace(260, 858, "Außensegment", focus(c.aussen, c.innen))}
        {brace(892, 1550, "Innensegment", focus(c.innen, c.zilie))}
        <Label x={875} y={290} px={875} py={412} anchor="middle" opacity={focus(c.zilie, c.kern)}>
          Zilie
        </Label>
        <Label x={1340} y={290} px={1340} py={410} anchor="middle" opacity={focus(c.kern, c.org)}>
          Zellkern
        </Label>
        <Label x={1080} y={290} px={1040} py={428} anchor="middle" opacity={focus(c.org, c.syn)}>
          Zellorganellen
        </Label>
        <Label x={1560} y={556} px={1544} py={636} anchor="middle" opacity={focus(c.syn, c.disks)}>
          synaptische Endigung
        </Label>

        <g opacity={fadeIn(frame, c.disks)}>
          <rect x={430} y={627} width={230} height={106} rx={6} fill="none" stroke={C.red} strokeWidth={4} />
          <text x={545} y={596} textAnchor="middle" fontSize={34} fontWeight={600} fill={C.red}>
            Disks
          </text>
        </g>
        <text x={960} y={895} textAnchor="middle" fontSize={32} fill={C.sub} opacity={fadeIn(frame, cue("receptors:3+3.0"))}>
          Disks = Membranscheibchen mit Fotopigment (bei Stäbchen: Rhodopsin)
        </text>
      </Stage>
      <SceneTitle>Aufbau der Fotorezeptoren</SceneTitle>
      <Subline style={{opacity: fadeIn(frame, cue("receptors:0+1.6"))}}>rund 125 Millionen Fotorezeptoren pro Netzhaut</Subline>
    </AbsoluteFill>
  );
};

export const RezeptorenScene = Interactive.create({
  Component: RezeptorenInner,
  layout: "absolute-fill",
});
