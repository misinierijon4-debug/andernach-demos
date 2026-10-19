import type React from "react";
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {EASE_OUT, fadeIn, sceneFade} from "../anim";
import {C, SANS} from "../theme";
import {makeCue} from "../timing";
import {SceneTitle, Subline} from "../ui";

const cue = makeCue("vergleich");

// [Kriterium, Stäbchen, Zapfen, Cue Kriterium, Cue Stäbchen, Cue Zapfen]
const ROWS: ReadonlyArray<readonly [string, string, string, string, string, string]> = [
  ["Anzahl pro Netzhaut", "ca. 120 Mio.", "ca. 6 Mio.", "compare:1+0.4", "compare:1+2.8", "compare:1+4.6"],
  ["Außensegment", "lang, zylindrisch, viele Disks", "kürzer, kegelförmig", "compare:2+0.2", "compare:2+0.6", "compare:3+0.6"],
  ["Lichtempfindlichkeit", "sehr hoch", "geringer", "compare:2+4.8", "compare:2+5.2", "compare:3+3.6"],
  ["Funktion", "Dämmerungssehen (Grautöne)", "Farbsehen, scharfes Sehen", "compare:2+8.0", "compare:2+8.4", "compare:3+5.6"],
  ["Lage", "v. a. am Rand der Netzhaut", "dicht im gelben Fleck", "compare:3+8.6", "compare:3+9.0", "compare:3+9.0"],
];
const COLS = [120, 640, 1240];

const VergleichInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const cell = (text: string, at: string, x: number, y: number, style: React.CSSProperties) => {
    const t = cue(at);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          fontFamily: SANS,
          fontSize: 34,
          opacity: fadeIn(frame, t, 16),
          translate: interpolate(frame, [t, t + 18], ["0px 12px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
          ...style,
        }}
      >
        {text}
      </div>
    );
  };

  const tableIn = fadeIn(frame, cue("compare:1"), 18);

  return (
    <AbsoluteFill style={{opacity: sceneFade(frame, durationInFrames)}}>
      <SceneTitle>Stäbchen und Zapfen im Vergleich</SceneTitle>
      <Subline style={{opacity: fadeIn(frame, cue("compare:0+2.6"))}}>
        Gemeinsam: Außensegment, Zilie, Innensegment, Disks mit Fotopigment
      </Subline>

      <div style={{opacity: tableIn}}>
        <div style={{position: "absolute", left: COLS[1], top: 290, fontFamily: SANS, fontSize: 30, fontWeight: 600, color: "#4A5B7E"}}>Stäbchen</div>
        <div style={{position: "absolute", left: COLS[2], top: 290, fontFamily: SANS, fontSize: 30, fontWeight: 600, color: "#2F66A8"}}>Zapfen</div>
        {ROWS.map((_, i) => (
          <div key={i} style={{position: "absolute", left: 120, right: 120, top: 352 + i * 104, height: 2, backgroundColor: C.rule}} />
        ))}
      </div>
      {ROWS.map(([k, s, z, ck, cs, cz], i) => {
        const y = 376 + i * 104;
        return (
          <div key={k}>
            {cell(k, ck, COLS[0], y, {color: C.sub, fontWeight: 500})}
            {cell(s, cs, COLS[1], y, {color: C.ink})}
            {cell(z, cz, COLS[2], y, {color: C.ink})}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const VergleichScene = Interactive.create({
  Component: VergleichInner,
  layout: "absolute-fill",
});
