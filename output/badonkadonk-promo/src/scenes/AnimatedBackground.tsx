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
  const moveX = Math.sin(adjustedFrame * speed * 0.01) * 60;
  const moveY = Math.cos(adjustedFrame * speed * 0.008) * 40;
  const pulse = interpolate(
    Math.sin(adjustedFrame * 0.03),
    [-1, 1],
    [0.7, 1.3]
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
        background: `radial-gradient(circle, ${color}40 0%, ${color}00 70%)`,
        filter: "blur(40px)",
      }}
    />
  );
};

export const AnimatedBackground: React.FC<Props> = ({ frame, fps }) => {
  const gridOpacity = interpolate(frame, [0, 60], [0, 0.08], {
    extrapolateRight: "clamp",
  });

  const gradientAngle = interpolate(frame, [0, 900], [0, 360]);

  return (
    <AbsoluteFill>
      {/* Deep dark base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 30% 20%, #1a0a2e22 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, #0a1a2e22 0%, transparent 50%),
            #06060c
          `,
        }}
      />

      {/* Animated gradient sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `conic-gradient(from ${gradientAngle}deg at 50% 50%, transparent 0deg, #ff6b3520 60deg, transparent 120deg, #3b82f615 200deg, transparent 280deg, #f59e0b10 340deg, transparent 360deg)`,
          opacity: 0.4,
        }}
      />

      {/* Floating orbs */}
      <FloatingOrb frame={frame} x={200} y={150} size={300} color="#ff6b35" speed={1.2} delay={0} />
      <FloatingOrb frame={frame} x={1400} y={600} size={250} color="#3b82f6" speed={0.8} delay={30} />
      <FloatingOrb frame={frame} x={800} y={800} size={200} color="#f59e0b" speed={1.0} delay={60} />
      <FloatingOrb frame={frame} x={1600} y={100} size={180} color="#ff6b35" speed={1.4} delay={45} />
      <FloatingOrb frame={frame} x={100} y={700} size={220} color="#3b82f6" speed={0.9} delay={15} />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scanline effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          )`,
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
