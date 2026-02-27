import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Lock, Flame } from "lucide-react";

// Mimics the actual badonkadonk.xyz hero section in a browser frame
const SiteMockup: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const navOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heroOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heroScale = spring({
    frame: frame - 45,
    fps,
    from: 0.9,
    to: 1,
    durationInFrames: 30,
    config: { damping: 15, stiffness: 120 },
  });

  return (
    <div
      style={{
        width: 1200,
        height: 720,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow:
          "0 50px 120px rgba(255,140,0,0.15), 0 0 1px rgba(255,140,0,0.3)",
        border: "1px solid rgba(255,140,0,0.15)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 42,
          background: "#1a1a16",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          borderBottom: "1px solid rgba(255,140,0,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
        </div>
        <div
          style={{
            flex: 1,
            height: 28,
            borderRadius: 8,
            backgroundColor: "#0c0c08",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
          }}
        >
          <Lock size={12} color="#28c840" />
          <span style={{ fontFamily: "monospace", fontSize: 13, color: "#777" }}>
            badonkadonk.xyz
          </span>
        </div>
      </div>

      {/* Site content area */}
      <div
        style={{
          height: 678,
          background: "#000000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange ticker at top */}
        <div
          style={{
            height: 36,
            background: "#ff8c00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: navOpacity,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            THE TEMPLE OF CURVES &bull; $BADONK &bull; BOOTY MONDAY &bull; BONK OR PASS
          </span>
        </div>

        {/* Hero section */}
        <div
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
            textAlign: "center",
            padding: "40px 40px 20px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: 20,
              border: "1px solid #ff8c0040",
              background: "rgba(255,140,0,0.06)",
              marginBottom: 16,
            }}
          >
            <Flame size={13} color="#ff8c00" />
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#ff8c00",
                letterSpacing: "2px",
              }}
            >
              $BADONK ON SOLANA
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 72,
              fontWeight: 900,
              margin: "0 0 12px",
              lineHeight: 1,
              background: "linear-gradient(180deg, #ffc040, #ff8c00, #ff6a00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BADONK
          </h2>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "6px",
              margin: "0 0 20px",
            }}
          >
            TIMELESS. UNIVERSAL. ASS.
          </p>

          {/* CTA row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                backgroundColor: "#ff8c00",
                fontSize: 12,
                fontWeight: 800,
                color: "#000000",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              DEXSCREENER
            </div>
            <div
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "1px solid #ff8c0050",
                fontSize: 12,
                fontWeight: 800,
                color: "#ff8c00",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              JOIN COMMUNITY
            </div>
          </div>
        </div>

        {/* Cards preview at bottom — three orange-outlined cards */}
        <div
          style={{
            display: "flex",
            gap: 14,
            padding: "20px 40px",
            justifyContent: "center",
            opacity: interpolate(frame, [75, 95], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {["The Temple", "Weekly Rituals", "Bonk or Pass"].map(
            (label, i) => {
              const cardY = spring({
                frame: frame - 80 - i * 6,
                fps,
                from: 30,
                to: 0,
                durationInFrames: 20,
                config: { damping: 14, stiffness: 200 },
              });
              return (
                <div
                  key={label}
                  style={{
                    width: 180,
                    height: 100,
                    borderRadius: 10,
                    border: "1px solid #ff8c0030",
                    background: "rgba(255,140,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    transform: `translateY(${cardY}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: "#ff8c0020",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#ccc",
                      letterSpacing: "1px",
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export const WebsiteRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3D entrance
  const entranceProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 40,
    config: { damping: 14, stiffness: 100 },
  });

  const rotateY = interpolate(entranceProgress, [0, 1], [20, 0]);
  const rotateX = interpolate(entranceProgress, [0, 1], [12, 2]);
  const translateZ = interpolate(entranceProgress, [0, 1], [-300, 0]);
  const browserOpacity = interpolate(entranceProgress, [0, 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  const floatY = Math.sin(frame * 0.035) * 5;

  // Exit — zoom into browser
  const exitProgress = interpolate(frame, [170, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 2.8]);
  const exitOpacity = interpolate(exitProgress, [0.4, 1], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        perspective: 1200,
      }}
    >
      <div
        style={{
          transform: `
            translateY(${floatY}px)
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            translateZ(${translateZ}px)
            scale(${exitScale})
          `,
          opacity: browserOpacity * exitOpacity,
          transformStyle: "preserve-3d",
        }}
      >
        <SiteMockup frame={frame} fps={fps} />
      </div>
    </AbsoluteFill>
  );
};
