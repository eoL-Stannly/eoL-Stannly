import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

interface Props {
  frame: number;
  fps: number;
}

const FloatingOrb: React.FC<{
  frame: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  delay: number;
}> = ({ frame, x, y, size, color, speed, delay }) => {
  const adjustedFrame = frame - delay;
  const moveX = Math.sin(adjustedFrame * speed * 0.01) * 50;
  const moveY = Math.cos(adjustedFrame * speed * 0.008) * 35;
  const pulse = interpolate(
    Math.sin(adjustedFrame * 0.03),
    [-1, 1],
    [0.8, 1.2]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x + moveX,
        top: y + moveY,
        width: size * pulse,
        height: size * pulse,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}35 0%, ${color}00 70%)`,
        filter: "blur(50px)",
      }}
    />
  );
};

export const AnimatedBackground: React.FC<Props> = ({ frame }) => {
  const gridOpacity = interpolate(frame, [0, 60], [0, 0.06], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Deep dark base — matches site's near-black background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
        }}
      />

      {/* Subtle warm radial glows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 25% 30%, #ff8c0012 0%, transparent 50%),
            radial-gradient(ellipse at 75% 70%, #ff6a0010 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating orange orbs */}
      <FloatingOrb frame={frame} x={150} y={100} size={350} color="#ff8c00" speed={1.0} delay={0} />
      <FloatingOrb frame={frame} x={1500} y={600} size={280} color="#ff6a00" speed={0.7} delay={30} />
      <FloatingOrb frame={frame} x={900} y={850} size={200} color="#ffa040" speed={0.9} delay={50} />
      <FloatingOrb frame={frame} x={1700} y={80} size={160} color="#ff6a00" speed={1.2} delay={20} />

      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(rgba(255,140,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,140,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Film grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.02) 2px,
            rgba(0,0,0,0.02) 4px
          )`,
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};
