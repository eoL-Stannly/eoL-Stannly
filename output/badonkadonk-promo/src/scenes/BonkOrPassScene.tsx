import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ThumbsUp, ThumbsDown, Trophy } from "lucide-react";

// Bonk or Pass voting mechanic + Badonk Cup tournament
export const BonkOrPassScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Part 1: Bonk or Pass (frames 0-120) ---

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Voting card entrance
  const cardScale = spring({
    frame: frame - 15,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
    config: { damping: 12, stiffness: 180 },
  });

  // Swipe animation — card tilts right (BONK!)
  const swipeRotation = interpolate(frame, [70, 95], [0, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const swipeX = interpolate(frame, [70, 95], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const swipeOpacity = interpolate(frame, [85, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "BONK!" stamp that appears during swipe
  const bonkStampOpacity = interpolate(frame, [75, 82, 95, 105], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bonkStampScale = spring({
    frame: frame - 75,
    fps,
    from: 2,
    to: 1,
    durationInFrames: 15,
    config: { damping: 8, stiffness: 300 },
  });

  // Part 1 fade out
  const part1Opacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Part 2: Badonk Cup (frames 110-240) ---

  const cupIn = interpolate(frame, [110, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cupTitleScale = spring({
    frame: frame - 115,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
    config: { damping: 10, stiffness: 150 },
  });

  // Tournament bracket lines animate
  const bracketProgress = interpolate(frame, [140, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [210, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Part 1: Bonk or Pass */}
      {frame < 125 && (
        <AbsoluteFill
          style={{
            opacity: part1Opacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: 180,
              textAlign: "center",
              opacity: titleOpacity,
            }}
          >
            <h2
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 64,
                fontWeight: 900,
                color: "#fff",
                margin: 0,
              }}
            >
              BONK{" "}
              <span style={{ color: "#555" }}>OR</span>{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ffc040, #ff8c00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PASS
              </span>
            </h2>
          </div>

          {/* Voting card — center */}
          <div
            style={{
              transform: `scale(${cardScale}) translateX(${swipeX}px) rotate(${swipeRotation}deg)`,
              opacity: swipeOpacity,
            }}
          >
            <div
              style={{
                width: 340,
                height: 420,
                borderRadius: 20,
                border: "2px solid #ff8c0040",
                background: "linear-gradient(180deg, #1a1a1a 0%, #111 100%)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Placeholder for contestant */}
              <div
                style={{
                  width: "100%",
                  height: 300,
                  background: "linear-gradient(135deg, #ff8c0015, #ff6a0010)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff8c0030, #ffc04020)",
                    border: "2px solid #ff8c0040",
                  }}
                />
              </div>

              {/* Card footer */}
              <div style={{ padding: "16px 20px", textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 12px",
                  }}
                >
                  Contestant #42
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
                  <div style={{ textAlign: "center" }}>
                    <ThumbsDown size={28} color="#666" />
                    <div
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: 11,
                        color: "#666",
                        marginTop: 4,
                      }}
                    >
                      PASS
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <ThumbsUp size={28} color="#ff8c00" />
                    <div
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: 11,
                        color: "#ff8c00",
                        marginTop: 4,
                        fontWeight: 700,
                      }}
                    >
                      BONK
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BONK! stamp overlay */}
          <div
            style={{
              position: "absolute",
              opacity: bonkStampOpacity,
              transform: `scale(${bonkStampScale}) rotate(-12deg)`,
            }}
          >
            <div
              style={{
                padding: "16px 48px",
                border: "4px solid #ff8c00",
                borderRadius: 12,
                background: "rgba(255,140,0,0.15)",
              }}
            >
              <span
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 72,
                  fontWeight: 900,
                  color: "#ff8c00",
                  letterSpacing: "4px",
                }}
              >
                BONK!
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Part 2: The Badonk Cup */}
      <AbsoluteFill
        style={{
          opacity: cupIn * exitOpacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Trophy icon */}
        <div
          style={{
            position: "absolute",
            top: 200,
            transform: `scale(${cupTitleScale})`,
          }}
        >
          <Trophy
            size={56}
            color="#ffc040"
            strokeWidth={2}
            style={{ filter: "drop-shadow(0 0 20px rgba(255,192,64,0.4))" }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: 280,
            textAlign: "center",
            transform: `scale(${cupTitleScale})`,
          }}
        >
          <h2
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 64,
              fontWeight: 900,
              margin: 0,
            }}
          >
            <span style={{ color: "#fff" }}>THE </span>
            <span
              style={{
                background: "linear-gradient(135deg, #ffc040, #ff8c00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BADONK CUP
            </span>
          </h2>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 20,
              color: "#888",
              marginTop: 12,
            }}
          >
            16 compete. Twitter decides. One reigns supreme.
          </p>
        </div>

        {/* Mini bracket visualization */}
        <div
          style={{
            position: "absolute",
            top: 440,
            display: "flex",
            gap: 60,
            alignItems: "center",
          }}
        >
          {/* Round of 16 (left) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[0, 1, 2, 3].map((i) => {
              const revealDelay = 140 + i * 5;
              const barWidth = interpolate(
                frame,
                [revealDelay, revealDelay + 15],
                [0, 120],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={i}
                  style={{
                    width: barWidth,
                    height: 24,
                    borderRadius: 6,
                    background: `linear-gradient(90deg, #ff8c0030, #ff8c0015)`,
                    border: "1px solid #ff8c0025",
                  }}
                />
              );
            })}
          </div>

          {/* Quarter finals */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[0, 1].map((i) => {
              const revealDelay = 165 + i * 8;
              const barWidth = interpolate(
                frame,
                [revealDelay, revealDelay + 15],
                [0, 100],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={i}
                  style={{
                    width: barWidth,
                    height: 28,
                    borderRadius: 6,
                    background: `linear-gradient(90deg, #ff8c0050, #ff8c0025)`,
                    border: "1px solid #ff8c0035",
                  }}
                />
              );
            })}
          </div>

          {/* Finals */}
          <div>
            {(() => {
              const barWidth = interpolate(frame, [185, 200], [0, 80], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  style={{
                    width: barWidth,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(90deg, #ffc040, #ff8c00)",
                    border: "1px solid #ffc04060",
                    boxShadow: "0 0 20px rgba(255,140,0,0.3)",
                  }}
                />
              );
            })()}
          </div>

          {/* Trophy icon at end */}
          <div
            style={{
              opacity: interpolate(frame, [195, 210], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Trophy size={40} color="#ffc040" />
          </div>

          {/* Quarter finals (right mirror) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[0, 1].map((i) => {
              const revealDelay = 165 + i * 8;
              const barWidth = interpolate(
                frame,
                [revealDelay, revealDelay + 15],
                [0, 100],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={i}
                  style={{
                    width: barWidth,
                    height: 28,
                    borderRadius: 6,
                    background: `linear-gradient(270deg, #ff8c0050, #ff8c0025)`,
                    border: "1px solid #ff8c0035",
                  }}
                />
              );
            })}
          </div>

          {/* Round of 16 (right) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[0, 1, 2, 3].map((i) => {
              const revealDelay = 140 + i * 5;
              const barWidth = interpolate(
                frame,
                [revealDelay, revealDelay + 15],
                [0, 120],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={i}
                  style={{
                    width: barWidth,
                    height: 24,
                    borderRadius: 6,
                    background: `linear-gradient(270deg, #ff8c0030, #ff8c0015)`,
                    border: "1px solid #ff8c0025",
                  }}
                />
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
