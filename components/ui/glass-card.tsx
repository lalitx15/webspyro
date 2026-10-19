"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  enableTilt?: boolean;
  enableHoverLift?: boolean;
  enableShine?: boolean;
  variant?: "card" | "panel" | "subtle" | "flat";
  glowColor?: "blue" | "pink" | "mint" | "peach" | "purple" | "none";
  className?: string;
}

export function GlassCard({
  children,
  enableTilt = false,
  enableHoverLift = true,
  enableShine = true,
  variant = "card",
  glowColor = "none",
  className,
  style,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseFromCenter = {
      x: e.clientX - rect.left - width / 2,
      y: e.clientY - rect.top - height / 2,
    };
    mouseX.set(mouseFromCenter.x / width);
    mouseY.set(mouseFromCenter.y / height);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (enableTilt) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const variantStyles = {
    card: "rounded-card glass-panel shadow-card",
    panel: "rounded-panel glass-panel shadow-card",
    subtle: "rounded-card bg-white/50 backdrop-blur-md border border-white/60 shadow-card-flat",
    flat: "rounded-card bg-white/90 border border-slate-200/60 shadow-sm",
  };

  const glowStyles = {
    none: "",
    blue: "hover:shadow-glow/40",
    pink: "hover:shadow-glow-pink/40",
    mint: "hover:shadow-glow-mint/40",
    peach: "hover:shadow-glow-peach/40",
    purple: "hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)]",
  };

  const combinedStyle = enableTilt
    ? { ...style, rotateX, rotateY, transformStyle: "preserve-3d" as const }
    : style;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={combinedStyle}
      whileHover={enableHoverLift ? { y: -6 } : undefined}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden transition-shadow duration-300",
        variantStyles[variant],
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {/* Soft glass shine highlight sweep on hover */}
      {enableShine && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-opacity duration-700 transform rotate-12",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {children}
    </motion.div>
  );
}
