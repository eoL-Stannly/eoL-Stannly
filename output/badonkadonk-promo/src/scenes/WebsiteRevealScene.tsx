import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Globe, Search, Lock } from "lucide-react";

const BrowserMockup: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Content reveal - sections appear sequentially
  const heroOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const navItemsOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardReveal = (index: number) =>
    spring({
      frame: frame - 70 - index * 8,
      fps,
      from: 0,
      to: 1,
      durationInFrames: 25,
      config: { damping: 12, stiffness: 200 },
    });

  return (
    <div
      style={{
        width: 1100,
        height: 680,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 44,
          background: "linear-gradient(180deg, #2a2a35 0%, #1e1e28 100%)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            height: 28,
            borderRadius: 8,
            backgroundColor: "#12121a",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
          }}
        >
          <Lock size={12} color="#28c840" />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              color: "#888",
            }}
          >
            badonkadonk.xyz
          </span>
        </div>
      </div>

      {/* Website content */}
      <div
        style={{
          height: 636,
          background: "linear-gradient(180deg, #0c0c14 0%, #0a0a12 100%)",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Nav bar */}
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            opacity: navItemsOpacity,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #ff6b35, #f59e0b)",
              }}
            />
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              BADONKADONK
            </span>
          </div>
          <div style={{ display: "flex", gap: 30 }}>
            {["Home", "Features", "Pricing", "Docs"].map((item) => (
              <span
                key={item}
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 14,
                  color: "#888",
                }}
              >
                {item}
              </span>
            ))}
            <div
              style={{
                padding: "6px 18px",
                borderRadius: 6,
                background: "linear-gradient(135deg, #ff6b35, #f59e0b)",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Get Started
            </div>
          </div>
        </div>

        {/* Hero section */}
        <div
          style={{
            padding: "50px 40px 30px",
            opacity: heroOpacity,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 42,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              margin: "0 0 16px",
            }}
          >
            Build Something{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff6b35, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Extraordinary
            </span>
          </h2>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 16,
              color: "#666",
              maxWidth: 500,
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            The next-generation platform that empowers creators
            to push boundaries and redefine what's possible.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <div
              style={{
                padding: "10px 28px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #ff6b35, #f59e0b)",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Launch App
            </div>
            <div
              style={{
                padding: "10px 28px",
                borderRadius: 8,
                border: "1px solid #333",
                fontSize: 14,
                fontWeight: 500,
                color: "#aaa",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Learn More
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "20px 40px",
            justifyContent: "center",
          }}
        >
          {[
            { color: "#ff6b35", label: "Lightning Fast" },
            { color: "#3b82f6", label: "Secure & Private" },
            { color: "#f59e0b", label: "Easy to Use" },
          ].map((card, i) => {
            const reveal = cardReveal(i);
            return (
              <div
                key={card.label}
                style={{
                  width: 200,
                  padding: "20px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transform: `translateY(${(1 - reveal) * 30}px)`,
                  opacity: reveal,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `${card.color}20`,
                    marginBottom: 12,
                  }}
                />
                <span
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#ccc",
                  }}
                >
                  {card.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const WebsiteRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser entrance - 3D perspective rotation
  const entranceProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 45,
    config: { damping: 14, stiffness: 120 },
  });

  const rotateY = interpolate(entranceProgress, [0, 1], [25, 0]);
  const rotateX = interpolate(entranceProgress, [0, 1], [15, 2]);
  const translateZ = interpolate(entranceProgress, [0, 1], [-400, 0]);
  const browserOpacity = interpolate(entranceProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtle floating animation
  const floatY = Math.sin(frame * 0.04) * 6;

  // Exit: zoom into the browser
  const exitProgress = interpolate(frame, [170, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 2.5]);
  const exitOpacity = interpolate(exitProgress, [0.5, 1], [1, 0], {
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
        <BrowserMockup frame={frame} fps={fps} />
      </div>

      {/* "Live Preview" badge */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 200,
          opacity: interpolate(frame, [30, 50, 170, 200], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [30, 50], [20, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 20,
            background: "rgba(255,107,53,0.1)",
            border: "1px solid rgba(255,107,53,0.3)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#ff6b35",
              boxShadow: "0 0 10px #ff6b35",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              color: "#ff6b35",
              letterSpacing: 1,
            }}
          >
            LIVE PREVIEW
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
