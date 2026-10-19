import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {EASE_OUT} from "./anim";
import {SANS} from "./theme";
import {TIMING} from "./timing";
import {Erklaervideo} from "./Video";

const NAMES = {A: "Person A", B: "Person B"};
const COLORS = {A: "#9DB8FF", B: "#FFC27A"};
const LINES = TIMING.scenes.flatMap((s) => s.lines);

/** Mitlese-Text für die Aufnahme: wer spricht gerade, und wer ist als Nächstes dran */
const CaptionsInner = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = LINES.findIndex((l, k) => t >= l.start - 0.15 && (k + 1 >= LINES.length || t < LINES[k + 1].start - 0.15));
  if (i < 0) return null;
  const line = LINES[i];
  const next = LINES[i + 1];
  const until = next ? Math.min(next.start - 0.15, line.end + 1.2) : line.end + 1.5;
  const opacity = interpolate(t, [line.start - 0.15, line.start + 0.15, until - 0.2, until], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const showNext = next && next.speaker !== line.speaker && t > next.start - 2.5;

  return (
    <AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 34, fontFamily: SANS}}>
      {showNext ? (
        <div style={{fontSize: 24, fontWeight: 600, color: COLORS[next.speaker], backgroundColor: "rgba(22,24,29,0.82)", padding: "6px 16px", borderRadius: 999, marginBottom: 10}}>
          gleich: {NAMES[next.speaker]}
        </div>
      ) : null}
      <div
        style={{
          maxWidth: 1560,
          backgroundColor: "rgba(22,24,29,0.86)",
          borderRadius: 16,
          padding: "16px 30px",
          fontSize: 34,
          lineHeight: 1.4,
          color: "#FFFFFF",
          opacity,
          translate: interpolate(t, [line.start - 0.15, line.start + 0.2], ["0px 8px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
        }}
      >
        <span style={{fontWeight: 700, color: COLORS[line.speaker], marginRight: 14}}>{NAMES[line.speaker]}</span>
        {line.text}
      </div>
    </AbsoluteFill>
  );
};

export const Captions = Interactive.create({
  Component: CaptionsInner,
  layout: "absolute-fill",
});

export const Sprechhilfe = () => (
  <>
    <Erklaervideo />
    <Captions name="Sprechertext" />
  </>
);
