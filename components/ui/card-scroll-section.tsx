"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardScrollSectionProps {
  children: React.ReactNode;
  index: number;
  className?: string;
  id?: string;
}

export function CardScrollSection({
  children,
  index,
  className,
  id,
}: CardScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure scroll progress as the section enters into view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 10%"],
  });

  // Card slide-up and scale-in transforms
  const y = useTransform(scrollYProgress, [0, 1], [index === 0 ? 0 : 70, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [index === 0 ? 1 : 0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [index === 0 ? 1 : 0.82, index === 0 ? 1 : 0.94, 1]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn(
        "relative w-full",
        index > 0 && "-mt-6 md:-mt-10"
      )}
      style={{
        zIndex: index + 10,
      }}
    >
      <motion.div
        style={{
          y,
          scale,
          opacity,
        }}
        className={cn(
          "relative w-full transform-gpu",
          index > 0 && [
            "rounded-t-[32px] sm:rounded-t-[44px] md:rounded-t-[52px]",
            "shadow-[0_-25px_60px_rgba(0,0,0,0.45)]",
            "border-t border-white/10",
            "overflow-hidden",
          ],
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default CardScrollSection;
