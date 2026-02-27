import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Flame } from "lucide-react";

// Scrolling ticker — matches the site's top banner
const Ticker: React.FC<{ frame: number }> = ({ frame }) => {
  const tickerItems = [
    "THE TEMPLE OF CURVES",
    "BOOTY MONDAY",
    "$BADONK",
    "TIMELESS. UNIVERSAL. ASS.",
    "BONK OR PASS",
    "THE TEMPLE OF CURVES",
    "BOOTY MONDAY",
    "$BADONK",
    "TIMELESS. UNIVERSAL. ASS.",
    "BONK OR PASS",
  ];

  const scrollX = -(frame * 3) % 2400;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        backgroundColor: "#ff8c00",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          whiteSpace: "nowrap",
          transform: `translateX(${scrollX}px)`,
        }}
      >
        {tickerItems.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 14,
              fontWeight: 800,
              color: "#000000",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ticker slides in
  const tickerReveal = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // $BADONK ON SOLANA badge
  const badgeScale = spring({
    frame: frame - 20,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 25,
    config: { damping: 12, stiffness: 200 },
  });

  // Main BADONK title
  const titleScale = spring({
    frame: frame - 30,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
    config: { damping: 10, stiffness: 150 },
  });
  const titleY = interpolate(titleScale, [0, 1], [60, 0]);

  // Tagline
  const taglineOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [60, 80], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA buttons
  const ctaOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit — zoom out and fade
  const exitProgress = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.85]);
  const exitOpacity = interpolate(exitProgress, [0, 0.5, 1], [1, 1, 0]);

  // Glow pulse
  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.4, 0.8]);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${exitScale})`,
        opacity: exitOpacity,
      }}
    >
      {/* Ticker bar at top */}
      <div style={{ opacity: tickerReveal }}>
        <Ticker frame={frame} />
      </div>

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 44,
        }}
      >
        {/* Radial glow behind title */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: `radial-gradient(circle, #ff8c0025 0%, transparent 60%)`,
            opacity: glowPulse,
            filter: "blur(40px)",
          }}
        />

        {/* $BADONK ON SOLANA badge */}
        <div
          style={{
            transform: `scale(${badgeScale})`,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 24px",
            borderRadius: 24,
            border: "1px solid #ff8c0050",
            background: "rgba(255, 140, 0, 0.08)",
          }}
        >
          <Flame size={18} color="#ff8c00" strokeWidth={2.5} />
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#ff8c00",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            $BADONK ON SOLANA
          </span>
        </div>

        {/* Main BADONK title — orange gradient */}
        <div
          style={{
            transform: `scale(${titleScale}) translateY(${titleY}px)`,
          }}
        >
          <h1
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 160,
              fontWeight: 900,
              lineHeight: 1,
              margin: 0,
              letterSpacing: "-3px",
              background: "linear-gradient(180deg, #ffc040 0%, #ff8c00 40%, #ff6a00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: "drop-shadow(0 0 60px rgba(255, 140, 0, 0.3))",
            }}
          >
            BADONK
          </h1>
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: interpolate(frame, [50, 70], [0, 300], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            height: 2,
            background: "linear-gradient(90deg, transparent, #ff8c00, transparent)",
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <p
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "12px",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            TIMELESS. UNIVERSAL. ASS.
          </p>
        </div>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 40,
            opacity: ctaOpacity,
          }}
        >
          <div
            style={{
              padding: "14px 36px",
              borderRadius: 10,
              backgroundColor: "#ff8c00",
              fontFamily: "system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            DEXSCREENER
          </div>
          <div
            style={{
              padding: "14px 36px",
              borderRadius: 10,
              border: "2px solid #ff8c0060",
              fontFamily: "system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: "#ff8c00",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            JOIN COMMUNITY
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
