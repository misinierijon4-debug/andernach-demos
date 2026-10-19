import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {EASE_OUT, fadeIn, sceneFade} from "../anim";
import {C, SANS, SERIF} from "../theme";
import {makeCue} from "../timing";
import {SceneTitle} from "../ui";

const cue = makeCue("zusammenfassung");

const STEPS: ReadonlyArray<readonly [string, string]> = [
  ["Licht aktiviert Rhodopsin (Rh*)", "summary:1+0.2"],
  ["Rh* aktiviert Transducin (T*)", "summary:1+1.8"],
  ["T* aktiviert das Enzym", "summary:1+3.4"],
  ["Das Enzym spaltet cGMP", "summary:1+5.2"],
  ["Na⁺-Kanäle schließen sich", "summary:2+0.2"],
  ["Hyperpolarisation auf −70 mV", "summary:2+2.0"],
  ["Kein Glutamat mehr", "summary:2+4.0"],
  ["Hemmung der Bipolarzelle fällt weg", "summary:2+6.2"],
];

const ZusammenfassungInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{opacity: sceneFade(frame, durationInFrames)}}>
      <SceneTitle>Die Kaskade bei Licht</SceneTitle>
      {STEPS.map(([text, at], i) => {
        const t = cue(at);
        const col = i < 4 ? 0 : 1;
        const row = i % 4;
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              left: col === 0 ? 120 : 960,
              top: 270 + row * 150,
              width: 900,
              display: "flex",
              alignItems: "baseline",
              gap: 30,
              opacity: fadeIn(frame, t, 16),
              translate: interpolate(frame, [t, t + 20], ["0px 16px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
            }}
          >
            <span style={{fontFamily: SERIF, fontSize: 84, lineHeight: 1, width: 70, color: i < 4 ? C.red : C.signal}}>{i + 1}</span>
            <span style={{fontFamily: SANS, fontSize: 42, fontWeight: 500, color: C.ink}}>{text}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const ZusammenfassungScene = Interactive.create({
  Component: ZusammenfassungInner,
  layout: "absolute-fill",
});
