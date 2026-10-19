import {Easing, interpolate} from "remotion";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/** 0 → 1 ab Frame `at` */
export const fadeIn = (frame: number, at: number, dur = 14) =>
  interpolate(frame, [at, at + dur], [0, 1], {...clamp, easing: EASE_OUT});

/** sichtbar von `from` bis `to` (weich ein- und ausgeblendet) */
export const visible = (frame: number, from: number, to?: number, dur = 14) =>
  fadeIn(frame, from, dur) * (to == null ? 1 : interpolate(frame, [to - dur, to], [1, 0], {...clamp, easing: EASE_IN_OUT}));

/** Fortschritt 0 → 1 über `dur` Frames */
export const progress = (frame: number, at: number, dur: number) =>
  interpolate(frame, [at, at + dur], [0, 1], {...clamp, easing: EASE_IN_OUT});

/** Werte über mehrere Keyframes */
export const keyframes = (frame: number, frames: ReadonlyArray<readonly [number, number]>) =>
  interpolate(frame, frames.map((f) => f[0]), frames.map((f) => f[1]), {...clamp, easing: EASE_IN_OUT});

/** Ein- und Ausblenden der ganzen Szene */
export const sceneFade = (frame: number, duration: number) =>
  interpolate(frame, [0, 12, duration - 12, duration], [0, 1, 1, 0], clamp);
