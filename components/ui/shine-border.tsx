"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ShineBorderProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  borderWidth?: number;
  duration?: number;
  gradient?: string;
  borderRadius?: number | string;
};

export const ShineBorder = ({
  children,
  className,
  contentClassName,
  borderWidth = 2,
  duration = 4,
  gradient = "from-blue-500 via-red-500 to-teal-400",
  borderRadius = "1.5rem",
}: ShineBorderProps) => {
  const radius = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <div
      className={cn("relative", className)}
      style={{ padding: borderWidth, borderRadius: radius }}
    >
      {/* Animated Gradient Layer */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ borderRadius: radius }}
      >
        <div
          className={cn(
            "absolute -inset-full blur-[2px] animate-spin bg-conic",
            gradient
          )}
          style={{
            animationDuration: `${duration}s`,
            backgroundImage: "conic-gradient(from 0deg at 50% 50%, var(--tw-gradient-stops))",
          }}
        />
      </div>

      {/* Content Layer */}
      {children ? (
        <div
          className={cn("relative z-10 w-full h-full bg-white overflow-hidden", contentClassName)}
          style={{ borderRadius: `calc(${radius} - ${borderWidth}px)` }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default ShineBorder;
