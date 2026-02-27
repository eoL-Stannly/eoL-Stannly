import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { WebsiteRevealScene } from "./scenes/WebsiteRevealScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { WalkthroughScene } from "./scenes/WalkthroughScene";
import { CTAScene } from "./scenes/CTAScene";
import { AnimatedBackground } from "./scenes/AnimatedBackground";

// 30 seconds at 30fps = 900 frames
// Scene breakdown:
// Intro:          0-150   (5s)  - Brand reveal with energy
// Website Reveal: 120-330 (7s)  - Animated website mockup entrance
// Features:       300-540 (8s)  - Feature showcase with icons
// Walkthrough:    510-750 (8s)  - Scrolling website walkthrough
// CTA:            720-900 (6s)  - Call to action with URL

export const BadonkadonkPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      {/* Persistent animated background */}
      <AnimatedBackground frame={frame} fps={fps} />

      {/* Scene 1: Intro - Brand Name Reveal */}
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Website Reveal - Browser mockup flies in */}
      <Sequence from={120} durationInFrames={210}>
        <WebsiteRevealScene />
      </Sequence>

      {/* Scene 3: Features - Animated feature cards */}
      <Sequence from={300} durationInFrames={240}>
        <FeaturesScene />
      </Sequence>

      {/* Scene 4: Walkthrough - Scrolling site content */}
      <Sequence from={510} durationInFrames={240}>
        <WalkthroughScene />
      </Sequence>

      {/* Scene 5: CTA - Final call to action */}
      <Sequence from={720} durationInFrames={180}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
