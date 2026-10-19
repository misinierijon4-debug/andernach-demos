import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {EASE_OUT, fadeIn, sceneFade} from "../anim";
import {C, SANS, SERIF} from "../theme";
import {makeCue} from "../timing";

const cue = makeCue("transduktion");

const PLAYERS: ReadonlyArray<readonly [string, string, string, string]> = [
  ["Rh", "Rhodopsin", "st:1+2.2", C.red],
  ["T", "Transducin", "st:1+3.4", C.red],
  ["E", "Enzym", "st:1+4.4", C.green],
  ["cGMP", "sek. Botenstoff", "st:1+5.8", C.cgmp],
];

const TransduktionInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{opacity: sceneFade(frame, durationInFrames), alignItems: "center"}}>
      <div
        style={{
          marginTop: 250,
          fontFamily: SERIF,
          fontSize: 170,
          lineHeight: 1,
          color: C.ink,
          opacity: fadeIn(frame, 6, 24),
          translate: interpolate(frame, [6, 34], ["0px 24px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
        }}
      >
        Signaltransduktion
      </div>
      <div style={{fontFamily: SANS, fontSize: 44, color: C.sub, marginTop: 34, opacity: fadeIn(frame, cue("st:0+2.0"), 18)}}>
        Wie wird aus Licht ein elektrisches Signal?
      </div>
      <div style={{display: "flex", gap: 110, marginTop: 120}}>
        {PLAYERS.map(([sym, name, at, color]) => {
          const t = cue(at);
          return (
            <div
              key={sym}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: fadeIn(frame, t, 16),
                translate: interpolate(frame, [t, t + 18], ["0px 16px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
              }}
            >
              <span style={{fontFamily: SERIF, fontSize: 96, lineHeight: 1, color}}>{sym}</span>
              <span style={{fontFamily: SANS, fontSize: 30, color: C.sub, marginTop: 14}}>{name}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const TransduktionScene = Interactive.create({
  Component: TransduktionInner,
  layout: "absolute-fill",
});
