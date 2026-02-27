import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ArrowRight, ExternalLink } from "lucide-react";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Big "JOIN THE TEMPLE" entrance
  const titleScale = spring({
    frame,
    fps,
    from: 0.3,
    to: 1,
    durationInFrames: 35,
    config: { damping: 10, stiffness: 140 },
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.8]
  );

  // Subtitle
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA buttons
  const btn1Scale = spring({
    frame: frame - 45,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 25,
    config: { damping: 12, stiffness: 200 },
  });
  const btn2Scale = spring({
    frame: frame - 55,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 25,
    config: { damping: 12, stiffness: 200 },
  });

  // URL bar at bottom
  const urlOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing button glow
  const btnGlow = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.6, 1]
  );

  // Particle ring
  const ringRotation = frame * 0.3;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Large rotating ring of particles */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          transform: `rotate(${ringRotation}deg)`,
          opacity: 0.15,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 380;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 400 + Math.cos(angle) * radius - 3,
                top: 400 + Math.sin(angle) * radius - 3,
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#ff8c00",
                boxShadow: "0 0 12px #ff8c00",
              }}
            />
          );
        })}
      </div>

      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, #ff8c0020 0%, transparent 60%)`,
          opacity: glowIntensity,
          filter: "blur(40px)",
        }}
      />

      {/* Main title */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 88,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: "#ffffff" }}>JOIN THE</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #ffc040 0%, #ff8c00 50%, #ff6a00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(255,140,0,0.4))",
            }}
          >
            TEMPLE
          </span>
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 520,
          opacity: subtitleOpacity,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: "#999",
            letterSpacing: "4px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          $BADONK on Solana
        </p>
      </div>

      {/* CTA buttons */}
      <div
        style={{
          position: "absolute",
          top: 590,
          display: "flex",
          gap: 24,
        }}
      >
        <div
          style={{
            transform: `scale(${btn1Scale})`,
            opacity: btn1Scale,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 40px",
              borderRadius: 12,
              backgroundColor: "#ff8c00",
              boxShadow: `0 0 ${30 * btnGlow}px rgba(255,140,0,${0.4 * btnGlow})`,
              cursor: "pointer",
            }}
          >
            <ExternalLink size={18} color="#000000" strokeWidth={2.5} />
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "#000000",
                letterSpacing: "1px",
              }}
            >
              DEXSCREENER
            </span>
          </div>
        </div>

        <div
          style={{
            transform: `scale(${btn2Scale})`,
            opacity: btn2Scale,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 40px",
              borderRadius: 12,
              border: "2px solid #ff8c0060",
              background: "rgba(255,140,0,0.06)",
            }}
          >
            <ArrowRight size={18} color="#ff8c00" strokeWidth={2.5} />
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "#ff8c00",
                letterSpacing: "1px",
              }}
            >
              JOIN COMMUNITY
            </span>
          </div>
        </div>
      </div>

      {/* URL at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          opacity: urlOpacity,
        }}
      >
        <div
          style={{
            padding: "10px 32px",
            borderRadius: 24,
            border: "1px solid #ff8c0030",
            background: "rgba(255,140,0,0.04)",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              color: "#ff8c00",
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
