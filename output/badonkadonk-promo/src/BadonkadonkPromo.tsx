import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { WebsiteRevealScene } from "./scenes/WebsiteRevealScene";
import { TempleScene } from "./scenes/TempleScene";
import { BonkOrPassScene } from "./scenes/BonkOrPassScene";
import { CTAScene } from "./scenes/CTAScene";
import { AnimatedBackground } from "./scenes/AnimatedBackground";

// 30 seconds at 30fps = 900 frames
//
// Scene breakdown (with overlapping transitions):
// 1. Intro:         0–150   (5.0s)  Brand reveal — ticker, BADONK title, tagline
// 2. Website Reveal: 130–340 (7.0s)  Browser mockup of actual site flies in
// 3. Temple/Rituals: 310–560 (8.3s)  Temple of Curves origin + Weekly Rituals cards
// 4. Bonk/Cup:       530–770 (8.0s)  Bonk or Pass voting + Badonk Cup bracket
// 5. CTA:            740–900 (5.3s)  "Join The Temple" finale with URL

export const BadonkadonkPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Persistent animated background — always visible */}
      <AnimatedBackground frame={frame} fps={fps} />

      {/* Scene 1: Intro — $BADONK brand reveal */}
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Website Reveal — browser mockup of the actual site */}
      <Sequence from={130} durationInFrames={210}>
        <WebsiteRevealScene />
      </Sequence>

      {/* Scene 3: Temple of Curves + Weekly Rituals */}
      <Sequence from={310} durationInFrames={250}>
        <TempleScene />
      </Sequence>

      {/* Scene 4: Bonk or Pass + The Badonk Cup */}
      <Sequence from={530} durationInFrames={240}>
        <BonkOrPassScene />
      </Sequence>

      {/* Scene 5: CTA — Join The Temple */}
      <Sequence from={740} durationInFrames={160}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
