import {Composition, Folder} from "remotion";
import {IntroScene} from "./scenes/IntroScene";
import {AugeScene} from "./scenes/AugeScene";
import {NetzhautScene} from "./scenes/NetzhautScene";
import {RezeptorenScene} from "./scenes/RezeptorenScene";
import {VergleichScene} from "./scenes/VergleichScene";
import {TransduktionScene} from "./scenes/TransduktionScene";
import {StaebchenScene} from "./scenes/StaebchenScene";
import {ZusammenfassungScene} from "./scenes/ZusammenfassungScene";
import {OutroScene} from "./scenes/OutroScene";
import {FPS, TOTAL_FRAMES, groupDuration} from "./timing";
import {Sprechhilfe} from "./Sprechhilfe";
import {Erklaervideo} from "./Video";

export const RemotionRoot = () => (
  <>
    <Composition id="Erklaervideo" component={Erklaervideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Sprechhilfe" component={Sprechhilfe} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Folder name="Szenen">
      <Composition
        id="Intro"
        component={IntroScene}
        durationInFrames={groupDuration("intro")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
      <Composition
        id="Auge"
        component={AugeScene}
        durationInFrames={groupDuration("auge")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
      <Composition
        id="Netzhaut"
        component={NetzhautScene}
        durationInFrames={groupDuration("netzhaut")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
      <Composition
        id="Fotorezeptoren"
        component={RezeptorenScene}
        durationInFrames={groupDuration("rezeptoren")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
      <Composition
        id="Vergleich"
        component={VergleichScene}
        durationInFrames={groupDuration("vergleich")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
      <Composition
        id="Signaltransduktion"
        component={TransduktionScene}
        durationInFrames={groupDuration("transduktion")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
      <Composition
        id="Staebchen"
        component={StaebchenScene}
        durationInFrames={groupDuration("staebchen")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
      <Composition
        id="Zusammenfassung"
        component={ZusammenfassungScene}
        durationInFrames={groupDuration("zusammenfassung")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
      <Composition
        id="Outro"
        component={OutroScene}
        durationInFrames={groupDuration("outro")}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{style: {backgroundColor: "#F4F1EA"}}}
      />
    </Folder>
  </>
);
