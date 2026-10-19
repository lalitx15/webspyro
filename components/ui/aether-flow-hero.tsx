"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Tag } from "lucide-react";

export interface AetherFlowHeroProps {
  badgeText?: string;
  headline?: React.ReactNode;
  subtitle?: string;
  priceText?: string;
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
  secondaryCtaText?: string;
  onSecondaryCta?: () => void;
  className?: string;
}

export const AetherFlowHero = ({
  badgeText = "WE BUILD WEBSITES THAT HELP BUSINESSES GROW",
  headline,
  subtitle = "Fast, modern websites built to turn visitors into enquiries — without the agency complexity.",
  priceText = "₹2,999/-",
  primaryCtaText = "GET A FREE WEBSITE QUOTE",
  onPrimaryCta,
  secondaryCtaText = "See our work",
  onSecondaryCta,
  className = "",
}: AetherFlowHeroProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 180 };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(
        x: number,
        y: number,
        directionX: number,
        directionY: number,
        size: number,
        color: string
      ) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (!canvas) return;
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse collision & repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size && distance > 0) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 5;
            this.y -= forceDirectionY * force * 5;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      if (!canvas) return;
      particles = [];
      const numberOfParticles = Math.min(140, Math.max(40, (canvas.height * canvas.width) / 9500));
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 4) + size * 2;
        const y = Math.random() * (canvas.height - size * 4) + size * 2;
        const directionX = Math.random() * 0.4 - 0.2;
        const directionY = Math.random() * 0.4 - 0.2;
        const color = "rgba(191, 128, 255, 0.85)"; // Luminous violet
        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth || window.innerWidth;
      canvas.height = containerRef.current.clientHeight || window.innerHeight;
      init();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const connect = () => {
      if (!ctx || !canvas) return;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance =
            (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) +
            (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y);

          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            const opacityValue = Math.max(0, 1 - distance / 22000);

            let isNearMouse = false;
            if (mouse.x !== null && mouse.y !== null) {
              const dx_mouse_a = particles[a].x - mouse.x;
              const dy_mouse_a = particles[a].y - mouse.y;
              const distMouse = Math.sqrt(dx_mouse_a * dx_mouse_a + dy_mouse_a * dy_mouse_a);
              if (distMouse < mouse.radius) {
                isNearMouse = true;
              }
            }

            if (isNearMouse) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.9})`;
            } else {
              ctx.strokeStyle = `rgba(180, 130, 255, ${opacityValue * 0.45})`;
            }

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!ctx || !canvas) return;
      ctx.fillStyle = "#030206"; // Deep nocturnal space
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseOut);
    }

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseOut);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15 + 0.2,
        duration: 0.7,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[92vh] md:min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030206] text-white ${className}`}
    >
      {/* Interactive Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Overlay Content */}
      <div className="relative z-10 text-center px-5 sm:px-8 py-16 max-w-5xl mx-auto flex flex-col items-center">
        {/* 1. Mint / Electric Pill Badge */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-purple-500/15 border border-purple-400/30 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)]"
        >
          <Zap className="h-4 w-4 text-purple-300 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-purple-200">
            {badgeText}
          </span>
        </motion.div>

        {/* 2. Main Title */}
        <motion.div
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          {headline ? (
            headline
          ) : (
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight leading-[1.12]">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
                A better website.
              </span>
              <br />
              <span className="text-white">More trust. </span>
              <span className="text-[#FF7A45] drop-shadow-[0_0_25px_rgba(255,122,69,0.4)]">
                More customers.
              </span>
            </h1>
          )}
        </motion.div>

        {/* 3. Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300/90 leading-relaxed font-normal mb-6"
        >
          {subtitle}
        </motion.p>

        {/* 4. Price Badge */}
        {priceText && (
          <motion.div
            custom={2.5}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
              <span className="w-5 h-5 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Tag className="w-3 h-3 fill-white stroke-none" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                Website starts from{" "}
                <strong className="font-extrabold text-[#FF7A45] text-sm sm:text-base">
                  {priceText}
                </strong>
              </span>
            </div>
          </motion.div>
        )}

        {/* 5. CTAs */}
        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            type="button"
            onClick={onPrimaryCta}
            className="group px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-[#FF7A45] to-[#FF5500] hover:from-[#FF6A30] hover:to-[#E64A00] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-[0_12px_32px_rgba(255,85,0,0.38)] hover:shadow-[0_16px_40px_rgba(255,85,0,0.52)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <span>{primaryCtaText}</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>

          {secondaryCtaText && (
            <button
              type="button"
              onClick={onSecondaryCta}
              className="px-6 py-3 rounded-full text-sm font-semibold text-slate-300 hover:text-white underline underline-offset-8 decoration-slate-600 hover:decoration-white transition-colors cursor-pointer"
            >
              {secondaryCtaText}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AetherFlowHero;
