import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {EASE_OUT, fadeIn} from "../anim";
import {C, SANS, SERIF} from "../theme";
import {makeCue} from "../timing";

const cue = makeCue("outro");

const OutroInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = cue("outro:1-0.2");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn(frame, 0, 12) * interpolate(frame, [durationInFrames - 24, durationInFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
      }}
    >
      <div style={{fontFamily: SANS, fontSize: 30, letterSpacing: 6, color: C.sub, opacity: fadeIn(frame, 6, 18)}}>SINNESORGAN AUGE</div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 170,
          lineHeight: 1,
          color: C.ink,
          marginTop: 30,
          opacity: fadeIn(frame, t, 20),
          translate: interpolate(frame, [t, t + 26], ["0px 24px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
        }}
      >
        Danke fürs Zuschauen!
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 190,
          fontFamily: SANS,
          fontSize: 24,
          lineHeight: 1.6,
          color: C.sub,
          textAlign: "center",
          opacity: fadeIn(frame, 20, 20),
        }}
      >
        Quellen: Biologie heute – Erweiterte Ausgabe SII (2011) · Biosphäre Neurobiologie SII (2016)
        <br />
        Unterrichtsmaterial M1 „Zellulärer Aufbau der Retina“ und M2 „Aufbau der Fotorezeptoren“
      </div>
    </AbsoluteFill>
  );
};

export const OutroScene = Interactive.create({
  Component: OutroInner,
  layout: "absolute-fill",
});
