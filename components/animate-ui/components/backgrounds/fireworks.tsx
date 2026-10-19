"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface FireworksBackgroundProps {
  className?: string;
  color?: string;
  population?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
}

export function FireworksBackground({
  className,
  color = "white",
  population = 6,
}: FireworksBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    // Palette generator
    const getBurstColor = () => {
      if (color === "white") {
        const whiteTints = [
          "rgba(255, 255, 255, ",
          "rgba(254, 240, 138, ", // warm golden glow
          "rgba(186, 230, 253, ", // icy cyan
          "rgba(253, 186, 116, ", // peach amber
          "rgba(244, 114, 182, ", // soft pink
        ];
        return whiteTints[Math.floor(Math.random() * whiteTints.length)];
      }
      if (color === "black") {
        const darkTints = [
          "rgba(15, 23, 42, ",
          "rgba(30, 41, 59, ",
          "rgba(2, 6, 23, ",
          "rgba(67, 56, 202, ",
        ];
        return darkTints[Math.floor(Math.random() * darkTints.length)];
      }
      return `rgba(255, 255, 255, `;
    };

    const explodeRocket = (x: number, y: number, baseColor: string) => {
      const particleCount = 38 + Math.floor(Math.random() * 25);
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 4.5 + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: baseColor,
          size: Math.random() * 2.2 + 1.2,
          decay: Math.random() * 0.018 + 0.012,
        });
      }
    };

    const launchRocket = () => {
      const startX = width * 0.15 + Math.random() * (width * 0.7);
      const targetY = height * 0.12 + Math.random() * (height * 0.45);
      rockets.push({
        x: startX,
        y: height,
        targetY,
        vy: -(Math.random() * 4 + 7),
        color: getBurstColor(),
        exploded: false,
      });
    };

    let tick = 0;
    const loop = () => {
      tick++;

      // Clear trail smoothly
      ctx.clearRect(0, 0, width, height);

      // Launch new rockets periodically according to population
      const launchFrequency = Math.max(25, Math.floor(120 / population));
      if (tick % launchFrequency === 0 && rockets.length < population * 2) {
        launchRocket();
      }

      // Update rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;

        // Draw rocket spark trail
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${r.color}0.9)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${r.color}1)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (r.y <= r.targetY) {
          explodeRocket(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045; // gentle gravity
        p.vx *= 0.985; // air drag
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = p.alpha > 0.5 ? 6 : 0;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [color, population]);

  return (
    <div className={cn("pointer-events-none overflow-hidden", className)}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default FireworksBackground;
