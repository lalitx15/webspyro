"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface OrbsBackgroundProps {
  className?: string;
  variant?: "hero" | "section" | "minimal";
}

export function OrbsBackground({ className, variant = "hero" }: OrbsBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden -z-10", className)}
    >
      {/* Pink Orb */}
      <motion.div
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.94, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-pink/35 blur-[100px]"
      />

      {/* Sky Blue Orb */}
      <motion.div
        animate={{
          x: [0, -35, 20, 0],
          y: [0, 40, -25, 0],
          scale: [1, 0.95, 1.06, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -right-28 w-[480px] h-[480px] rounded-full bg-sky/35 blur-[120px]"
      />

      {/* Peach Orb */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -25, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-2/3 -left-24 w-[380px] h-[380px] rounded-full bg-peach/30 blur-[90px]"
      />

      {/* Lavender Orb */}
      {variant !== "minimal" && (
        <motion.div
          animate={{
            x: [0, -20, 30, 0],
            y: [0, -35, 15, 0],
            scale: [1, 1.05, 0.92, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-36 right-1/4 w-[450px] h-[450px] rounded-full bg-lavender/35 blur-[110px]"
        />
      )}

      {/* Soft Cream Warm Beam */}
      <div className="absolute top-0 right-1/3 w-72 h-full bg-warmGlow/40 blur-[130px] transform -rotate-12 pointer-events-none" />
    </div>
  );
}
