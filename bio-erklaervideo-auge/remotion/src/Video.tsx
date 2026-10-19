import {Track} from "remotion";
import {IntroScene} from "./scenes/IntroScene";
import {AugeScene} from "./scenes/AugeScene";
import {NetzhautScene} from "./scenes/NetzhautScene";
import {RezeptorenScene} from "./scenes/RezeptorenScene";
import {VergleichScene} from "./scenes/VergleichScene";
import {TransduktionScene} from "./scenes/TransduktionScene";
import {StaebchenScene} from "./scenes/StaebchenScene";
import {ZusammenfassungScene} from "./scenes/ZusammenfassungScene";
import {OutroScene} from "./scenes/OutroScene";
import {C} from "./theme";
import {groupDuration, groupFrom} from "./timing";

// Szenenfolge; Start und Dauer jeder Szene ergeben sich aus dem Sprechertext (script.ts)
export const Erklaervideo = () => (
  <Track name="Szenen">
    <IntroScene name="Intro" from={groupFrom("intro")} durationInFrames={groupDuration("intro")} style={{backgroundColor: C.bg}} />
    <AugeScene name="Auge" from={groupFrom("auge")} durationInFrames={groupDuration("auge")} style={{backgroundColor: C.bg}} />
    <NetzhautScene name="Netzhaut" from={groupFrom("netzhaut")} durationInFrames={groupDuration("netzhaut")} style={{backgroundColor: C.bg}} />
    <RezeptorenScene name="Fotorezeptoren" from={groupFrom("rezeptoren")} durationInFrames={groupDuration("rezeptoren")} style={{backgroundColor: C.bg}} />
    <VergleichScene name="Vergleich" from={groupFrom("vergleich")} durationInFrames={groupDuration("vergleich")} style={{backgroundColor: C.bg}} />
    <TransduktionScene name="Signaltransduktion" from={groupFrom("transduktion")} durationInFrames={groupDuration("transduktion")} style={{backgroundColor: C.bg}} />
    <StaebchenScene name="Staebchen" from={groupFrom("staebchen")} durationInFrames={groupDuration("staebchen")} style={{backgroundColor: C.bg}} />
    <ZusammenfassungScene name="Zusammenfassung" from={groupFrom("zusammenfassung")} durationInFrames={groupDuration("zusammenfassung")} style={{backgroundColor: C.bg}} />
    <OutroScene name="Outro" from={groupFrom("outro")} durationInFrames={groupDuration("outro")} style={{backgroundColor: C.bg}} />
  </Track>
);
