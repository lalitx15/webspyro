"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FloatingPaths({
  position,
  className,
}: {
  position: number;
  className?: string;
}) {
  // Graceful full-bleed curves that sweep across the entire section
  const paths = useMemo(() => {
    const isMirrored = position < 0;
    return Array.from({ length: 28 }, (_, i) => {
      // Base coordinates spanning 0 to 1600 width and 0 to 1200 height
      const startX = isMirrored ? 1750 - i * 30 : -150 + i * 30;
      const startY = -120 - i * 12;
      const c1X = isMirrored ? 1480 - i * 24 : 120 + i * 24;
      const c1Y = 320 + i * 14;
      const c2X = isMirrored ? 780 - i * 18 : 820 + i * 18;
      const c2Y = 680 + i * 16;
      const endX = isMirrored ? -150 - i * 15 : 1750 + i * 15;
      const endY = 1180 + i * 12;

      return {
        id: i,
        d: `M${startX} ${startY}C${c1X} ${c1Y} ${c2X} ${c2Y} ${endX} ${endY}`,
        width: 0.85 + (i % 8) * 0.12,
        strokeOpacity: 0.18 + (i % 6) * 0.05,
        duration: 17 + (i % 7) * 2.3,
      };
    });
  }, [position]);

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      <svg
        className="w-full h-full text-cyan-400"
        viewBox="0 0 1600 1200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.strokeOpacity}
            initial={{ pathLength: 0.35, opacity: 0.3, pathOffset: 0 }}
            animate={{
              pathLength: [0.35, 0.85, 0.35],
              opacity: [0.3, 0.8, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              willChange: "stroke-dashoffset, stroke-dasharray",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPathsContainer({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

export default FloatingPaths;
