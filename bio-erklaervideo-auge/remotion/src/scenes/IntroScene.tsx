import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {EASE_OUT, progress, sceneFade, visible} from "../anim";
import {C, SANS, SERIF} from "../theme";
import {makeCue} from "../timing";

const cue = makeCue("intro");

const IntroInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const stat = cue("intro:1");
  const agenda = cue("intro:2");
  const draw = progress(frame, 4, 40);

  return (
    <AbsoluteFill style={{opacity: sceneFade(frame, durationInFrames)}}>
      {/* 1 – Titel */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: visible(frame, 0, stat),
        }}
      >
        <svg width={360} height={180} viewBox="0 0 360 180" style={{marginBottom: 40}}>
          <path
            d="M20,90 Q180,-20 340,90 Q180,200 20,90 Z"
            fill="none"
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
          <circle cx={180} cy={90} r={50} fill="none" stroke={C.ink} strokeWidth={5} opacity={progress(frame, 24, 16)} />
          <circle cx={180} cy={90} r={22} fill={C.ink} opacity={progress(frame, 30, 14)} />
        </svg>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 190,
            lineHeight: 1,
            color: C.ink,
            letterSpacing: -2,
            opacity: interpolate(frame, [10, 34], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
            translate: interpolate(frame, [10, 34], ["0px 24px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
          }}
        >
          Sinnesorgan Auge
        </div>
        <div style={{fontFamily: SANS, fontSize: 40, color: C.sub, marginTop: 30, opacity: visible(frame, 30)}}>
          Ein Erklärvideo für den Biologieunterricht
        </div>
      </AbsoluteFill>

      {/* 2 – Zahl */}
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", opacity: visible(frame, stat, agenda)}}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 300,
            lineHeight: 1,
            color: C.ink,
            translate: interpolate(frame, [stat, stat + 24], ["0px 30px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
          }}
        >
          über 50 %
        </div>
        <div style={{fontFamily: SANS, fontSize: 48, color: C.sub, marginTop: 24, textAlign: "center", lineHeight: 1.35}}>
          aller Sinnesrezeptoren des Körpers
          <br />
          sitzen in den Augen.
        </div>
      </AbsoluteFill>

      {/* 3 – Ablauf */}
      <AbsoluteFill style={{justifyContent: "center", paddingLeft: 340, opacity: visible(frame, agenda)}}>
        {[
          ["01", "Aufbau von Auge und Netzhaut", agenda + 6],
          ["02", "Signaltransduktion", cue("intro:2+3.2")],
        ].map(([n, t, at]) => (
          <div
            key={n as string}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 48,
              margin: "26px 0",
              opacity: visible(frame, at as number, undefined, 18),
              translate: interpolate(frame, [at as number, (at as number) + 22], ["-30px 0px", "0px 0px"], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT}),
            }}
          >
            <span style={{fontFamily: SERIF, fontSize: 110, color: C.light, lineHeight: 1, width: 120}}>{n}</span>
            <span style={{fontFamily: SANS, fontSize: 64, fontWeight: 500, color: C.ink}}>{t}</span>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const IntroScene = Interactive.create({
  Component: IntroInner,
  layout: "absolute-fill",
});
