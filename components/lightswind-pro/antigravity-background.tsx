"use client";

import React, { useEffect, useRef } from "react";

export interface AntigravityBackgroundProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  particleVariance?: number;
  lerpSpeed?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  fieldStrength?: number;
  autoAnimate?: boolean;
  particleColor?: string;
  ringColor?: string;
  className?: string;
}

export default function AntigravityBackground({
  count = 320,
  magnetRadius = 12,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 0.5,
  particleSize = 1.6,
  particleVariance = 1.8,
  lerpSpeed = 0.05,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  fieldStrength = 12,
  autoAnimate = true,
  particleColor = "rgba(6, 182, 212, 0.45)", // cyan accent
  ringColor = "rgba(147, 197, 253, 0.85)", // glowing blue ring
  className = "",
}: AntigravityBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      width = canvas.width = rect.width || window.innerWidth;
      height = canvas.height = rect.height || 600;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const mouse = { x: width / 2, y: height / 2, isDown: false, isInside: false };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isInside =
        mouse.x >= -50 && mouse.x <= width + 50 && mouse.y >= -50 && mouse.y <= height + 50;
    };

    const handleMouseDown = () => {
      mouse.isDown = true;
      setTimeout(() => {
        mouse.isDown = false;
      }, 250);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });

    interface Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      size: number;
      vx: number;
      vy: number;
      baseAlpha: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const rx = Math.random() * (width || window.innerWidth);
      const ry = Math.random() * (height || 600);
      particles.push({
        x: rx,
        y: ry,
        originX: rx,
        originY: ry,
        size: Math.max(0.6, particleSize + (Math.random() - 0.5) * particleVariance),
        vx: 0,
        vy: 0,
        baseAlpha: 0.2 + Math.random() * 0.6,
      });
    }

    let time = 0;

    const render = () => {
      time += waveSpeed * 0.04;
      ctx.clearRect(0, 0, width, height);

      const effectiveMagnetRadius = magnetRadius * 18;
      const effectiveRingRadius = ringRadius * 12;

      // Draw subtle orbital guide aura around cursor when hovering inside
      if (mouse.isInside) {
        ctx.save();
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          effectiveMagnetRadius
        );
        grad.addColorStop(0, "rgba(6, 182, 212, 0.07)");
        grad.addColorStop(0.5, "rgba(59, 130, 246, 0.03)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, effectiveMagnetRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      particles.forEach((p) => {
        // Wave floating motion
        const waveX = Math.sin(time + p.originY * 0.008) * waveAmplitude * 12;
        const waveY = Math.cos(time + p.originX * 0.008) * waveAmplitude * 12;

        const targetX = p.originX + waveX;
        const targetY = p.originY + waveY;

        let fx = 0;
        let fy = 0;

        if (mouse.isInside) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < effectiveMagnetRadius && dist > 1) {
            const angle = Math.atan2(dy, dx);
            const pullForce = (1 - dist / effectiveMagnetRadius) * fieldStrength;

            if (dist < effectiveRingRadius) {
              // Antigravity levitation: push away into ring perimeter
              fx -= Math.cos(angle) * pullForce * 2.5;
              fy -= Math.sin(angle) * pullForce * 2.5;
            } else {
              // Pull towards orbital ring
              fx += Math.cos(angle) * pullForce;
              fy += Math.sin(angle) * pullForce;
            }

            if (mouse.isDown) {
              // Burst effect on click
              fx -= Math.cos(angle) * 35;
              fy -= Math.sin(angle) * 35;
            }
          }
        }

        // Apply physics with spring lerp and velocity damping
        p.vx += (targetX - p.x) * lerpSpeed + fx * 0.12;
        p.vy += (targetY - p.y) * lerpSpeed + fy * 0.12;

        p.vx *= 0.86;
        p.vy *= 0.86;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.size > 2 ? ringColor : particleColor;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    count,
    magnetRadius,
    ringRadius,
    waveSpeed,
    waveAmplitude,
    particleSize,
    particleVariance,
    lerpSpeed,
    rotationSpeed,
    depthFactor,
    pulseSpeed,
    fieldStrength,
    autoAnimate,
    particleColor,
    ringColor,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
}
