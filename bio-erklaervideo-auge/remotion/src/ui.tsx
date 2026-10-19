import type React from "react";
import {C, SANS, SERIF} from "./theme";

export const Stage: React.FC<{readonly children: React.ReactNode}> = ({children}) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{position: "absolute", inset: 0, fontFamily: SANS}}
  >
    {children}
  </svg>
);

export const SceneTitle: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      position: "absolute",
      left: 120,
      top: 62,
      fontFamily: SERIF,
      fontSize: 88,
      lineHeight: 1,
      letterSpacing: -0.5,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Subline: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      position: "absolute",
      left: 122,
      top: 168,
      fontFamily: SANS,
      fontSize: 32,
      color: C.sub,
      ...style,
    }}
  >
    {children}
  </div>
);

type LabelProps = {
  readonly x: number;
  readonly y: number;
  readonly px: number;
  readonly py: number;
  readonly children: React.ReactNode;
  readonly anchor?: "start" | "end" | "middle";
  readonly opacity?: number;
  readonly size?: number;
  readonly color?: string;
  readonly note?: string;
};

/** Beschriftung mit dünner Führungslinie zu einem Punkt */
export const Label: React.FC<LabelProps> = ({x, y, px, py, children, anchor = "start", opacity = 1, size = 32, color = C.ink, note}) => {
  const lx = anchor === "start" ? x - 14 : anchor === "end" ? x + 14 : x;
  const ly = anchor === "middle" ? (y < py ? y + 14 + (note ? 40 : 0) : y - size - 4) : y - size * 0.32;
  if (opacity <= 0.001) return null;
  return (
    <g opacity={opacity}>
      <line x1={lx} y1={ly} x2={px} y2={py} stroke={C.ink} strokeOpacity={0.45} strokeWidth={1.5} />
      <circle cx={px} cy={py} r={4.5} fill={C.ink} />
      <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={500} fill={color}>
        {children}
      </text>
      {note ? (
        <text x={x} y={y + size * 1.25} textAnchor={anchor} fontSize={size * 0.8} fill={C.sub}>
          {note}
        </text>
      ) : null}
    </g>
  );
};
