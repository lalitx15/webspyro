"use client";

import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  step?: number;
  centerTop?: string;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 260,
  mainCircleOpacity = 0.36,
  numCircles = 9,
  step = 100,
  centerTop = "42%",
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white_60%,transparent_98%)] select-none overflow-hidden",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * step;
        const opacity = Math.max(0.08, mainCircleOpacity - i * 0.028);
        const animationDelay = `${i * 0.18}s`;
        const borderStyle = "solid";

        return (
          <div
            key={i}
            className="animate-ripple bg-foreground/25 absolute rounded-full border shadow-xl"
            style={
              {
                "--i": i,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: "1.5px",
                borderColor: `var(--foreground, rgba(56, 189, 248, 0.45))`,
                boxShadow: `0 0 25px rgba(56, 189, 248, 0.12), inset 0 0 20px rgba(56, 189, 248, 0.04)`,
                top: centerTop,
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";

export default Ripple;
