import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Church, Calendar, Sword, Users } from "lucide-react";

// The Temple of Curves + Weekly Rituals combined scene
export const TempleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Part 1: Temple of Curves (frames 0-120) ---

  // Section title entrance
  const templeTitleScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
    config: { damping: 12, stiffness: 180 },
  });

  const templeTitleY = interpolate(templeTitleScale, [0, 1], [40, 0]);

  // Origin text
  const originOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tweet card
  const tweetScale = spring({
    frame: frame - 40,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
    config: { damping: 14, stiffness: 150 },
  });

  // Temple fade out
  const templeFadeOut = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Part 2: Weekly Rituals (frames 100-240) ---

  const ritualsIn = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ritualCards = [
    {
      day: "MONDAY",
      title: "BADONK OF THE WEEK",
      desc: "Community votes for the best",
      icon: Users,
      color: "#ff8c00",
    },
    {
      day: "WEDNESDAY",
      title: "BOOTY RAID",
      desc: "Raid top KOLs together",
      icon: Sword,
      color: "#ffa040",
    },
    {
      day: "FRIDAY",
      title: "THE GREAT ASS-AULT",
      desc: "Raid other communities",
      icon: Calendar,
      color: "#ff6a00",
    },
  ];

  // Exit
  const exitOpacity = interpolate(frame, [210, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Part 1: Temple of Curves */}
      {frame < 130 && (
        <AbsoluteFill
          style={{
            opacity: templeFadeOut,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              position: "absolute",
              top: 260,
              transform: `scale(${templeTitleScale})`,
              opacity: templeTitleScale,
            }}
          >
            <Church size={48} color="#ff8c00" strokeWidth={2} />
          </div>

          {/* Title */}
          <div
            style={{
              transform: `scale(${templeTitleScale}) translateY(${templeTitleY}px)`,
              textAlign: "center",
              marginTop: -40,
            }}
          >
            <h2
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 72,
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-2px",
                margin: 0,
              }}
            >
              THE TEMPLE OF{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ffc040, #ff8c00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CURVES
              </span>
            </h2>
          </div>

          {/* Origin tweet card */}
          <div
            style={{
              position: "absolute",
              top: 520,
              transform: `scale(${tweetScale})`,
              opacity: originOpacity,
            }}
          >
            <div
              style={{
                padding: "24px 40px",
                borderRadius: 16,
                border: "1px solid #ff8c0030",
                background: "rgba(255,140,0,0.05)",
                maxWidth: 600,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#ccc",
                  lineHeight: 1.5,
                  margin: "0 0 12px",
                }}
              >
                "Born from a single tweet by{" "}
                <span style={{ color: "#ff8c00", fontWeight: 700 }}>@gr3g</span>{" "}
                — the prophet of posterior."
              </p>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: "#666",
                }}
              >
                The origin of $BADONK
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Part 2: Weekly Rituals */}
      <AbsoluteFill
        style={{
          opacity: ritualsIn * exitOpacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Section title */}
        <div
          style={{
            position: "absolute",
            top: 200,
            textAlign: "center",
            opacity: interpolate(frame, [110, 130], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <h2
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 56,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            WEEKLY{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ffc040, #ff8c00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              RITUALS
            </span>
          </h2>
        </div>

        {/* Three ritual cards */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 80,
          }}
        >
          {ritualCards.map((card, i) => {
            const cardScale = spring({
              frame: frame - 125 - i * 10,
              fps,
              from: 0,
              to: 1,
              durationInFrames: 25,
              config: { damping: 12, stiffness: 200 },
            });
            const cardY = interpolate(cardScale, [0, 1], [50, 0]);
            const Icon = card.icon;

            return (
              <div
                key={card.day}
                style={{
                  width: 300,
                  padding: "32px 28px",
                  borderRadius: 16,
                  border: `1px solid ${card.color}30`,
                  background: `linear-gradient(180deg, ${card.color}08, transparent)`,
                  textAlign: "center",
                  transform: `translateY(${cardY}px) scale(${cardScale})`,
                  opacity: cardScale,
                }}
              >
                {/* Day badge */}
                <div
                  style={{
                    display: "inline-flex",
                    padding: "4px 14px",
                    borderRadius: 12,
                    backgroundColor: `${card.color}20`,
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: 12,
                      fontWeight: 800,
                      color: card.color,
                      letterSpacing: "2px",
                    }}
                  >
                    {card.day}
                  </span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Icon size={36} color={card.color} strokeWidth={2} />
                </div>

                <h3
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#fff",
                    margin: "0 0 8px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "#888",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
