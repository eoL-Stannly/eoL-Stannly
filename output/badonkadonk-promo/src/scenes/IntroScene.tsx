import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Zap } from "lucide-react";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Particle burst on entry
  const burstProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 40,
    config: { damping: 12, stiffness: 200 },
  });

  // Main title scale and entrance
  const titleScale = spring({
    frame: frame - 15,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 35,
    config: { damping: 10, stiffness: 180 },
  });

  const titleY = interpolate(titleScale, [0, 1], [80, 0]);

  // Subtitle entrance
  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [45, 65], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Decorative line wipe
  const lineWidth = spring({
    frame: frame - 30,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
    config: { damping: 20, stiffness: 150 },
  });

  // Exit transition - scale up and fade
  const exitProgress = interpolate(frame, [110, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 1.3]);
  const exitOpacity = interpolate(exitProgress, [0, 0.6, 1], [1, 1, 0]);

  // Glow pulse behind title
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.7]
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${exitScale})`,
        opacity: exitOpacity,
      }}
    >
      {/* Radial glow behind title */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, #ff6b3530 0%, transparent 60%)`,
          opacity: glowPulse * burstProgress,
          filter: "blur(60px)",
        }}
      />

      {/* Burst particles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = burstProgress * 400;
        const particleOpacity = interpolate(
          burstProgress,
          [0, 0.3, 1],
          [0, 1, 0]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + Math.cos(angle) * distance - 4,
              top: 540 + Math.sin(angle) * distance - 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: i % 2 === 0 ? "#ff6b35" : "#f59e0b",
              opacity: particleOpacity,
              boxShadow: `0 0 20px ${i % 2 === 0 ? "#ff6b35" : "#f59e0b"}`,
            }}
          />
        );
      })}

      {/* Icon */}
      <div
        style={{
          position: "absolute",
          top: 340,
          opacity: titleScale,
          transform: `scale(${titleScale}) translateY(${titleY}px)`,
        }}
      >
        <Zap
          size={64}
          color="#ff6b35"
          strokeWidth={2.5}
          style={{
            filter: "drop-shadow(0 0 20px #ff6b3580)",
          }}
        />
      </div>

      {/* Main Title */}
      <div
        style={{
          transform: `scale(${titleScale}) translateY(${titleY}px)`,
          textAlign: "center",
          marginTop: 40,
        }}
      >
        <h1
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 120,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-4px",
            lineHeight: 1,
            margin: 0,
            textShadow: "0 0 60px rgba(255, 107, 53, 0.3)",
          }}
        >
          BADONKA
          <span style={{ color: "#ff6b35" }}>DONK</span>
        </h1>
      </div>

      {/* Decorative line */}
      <div
        style={{
          position: "absolute",
          top: 580,
          width: 200 * lineWidth,
          height: 3,
          background: "linear-gradient(90deg, transparent, #ff6b35, #f59e0b, transparent)",
          borderRadius: 2,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 610,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 32,
            fontWeight: 400,
            color: "#a0a0b0",
            letterSpacing: "8px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          The Future Is Here
        </p>
      </div>

      {/* Domain badge */}
      <div
        style={{
          position: "absolute",
          top: 680,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px) scale(${subtitleOpacity})`,
        }}
      >
        <div
          style={{
            padding: "10px 30px",
            border: "1px solid #ff6b3540",
            borderRadius: 30,
            backdropFilter: "blur(10px)",
            background: "rgba(255, 107, 53, 0.05)",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              color: "#ff6b35",
              letterSpacing: "2px",
            }}
          >
            badonkadonk.xyz
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
