import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";

export const C = {
  bg: "#F4F1EA",
  ink: "#16181D",
  sub: "#77705F",
  faint: "#C9C1B1",
  rule: "#E2DCCF",
  light: "#E09A00",
  lightSoft: "#F6D58A",
  signal: "#2048C8",
  red: "#B3243F",
  cgmp: "#CC3B57",
  green: "#2F7D4A",
  na: "#E2B23B",
  naFill: "#FBEBB5",
  vitreous: "#EAEFF2",
  retina: "#E59A72",
  choroid: "#9C4F3E",
  sclera: "#D6CFC1",
  cornea: "#8FBFDD",
  lens: "#CFE3F0",
  iris: "#5F7F68",
  nerve: "#EBD3A2",
  nerveStroke: "#C7A465",
};

export const SERIF = "Instrument Serif";
export const SANS = "Inter";

Promise.all([
  loadFont({family: SERIF, url: staticFile("fonts/InstrumentSerif-Regular.woff2"), weight: "400"}),
  loadFont({family: SANS, url: staticFile("fonts/Inter-Regular.otf"), weight: "400"}),
  loadFont({family: SANS, url: staticFile("fonts/Inter-Medium.otf"), weight: "500"}),
  loadFont({family: SANS, url: staticFile("fonts/Inter-SemiBold.otf"), weight: "600"}),
  loadFont({family: SANS, url: staticFile("fonts/Inter-Bold.otf"), weight: "700"}),
]);
