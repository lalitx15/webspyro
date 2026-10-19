"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "mint"
  | "peach"
  | "pink"
  | "sky"
  | "periwinkle"
  | "lavender"
  | "blue"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  withDot?: boolean;
  pulseDot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "blue",
  withDot = true,
  pulseDot = true,
  className,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    mint: {
      container: "bg-[#EDFAF8] text-[#0F766E] border-[#A9E3DD]/60",
      dot: "bg-[#0D9488]",
    },
    peach: {
      container: "bg-[#FDF5ED] text-[#B45309] border-[#F8CFA6]/60",
      dot: "bg-[#D97706]",
    },
    pink: {
      container: "bg-[#FDECEF] text-[#BE123C] border-[#F4A9BE]/60",
      dot: "bg-[#E11D48]",
    },
    sky: {
      container: "bg-[#EEF9FD] text-[#0369A1] border-[#8FD3F0]/60",
      dot: "bg-[#0284C7]",
    },
    periwinkle: {
      container: "bg-[#ECEEFC] text-[#4338CA] border-[#6C7CF0]/50",
      dot: "bg-[#4F46E5]",
    },
    lavender: {
      container: "bg-[#F5F1FC] text-[#6D28D9] border-[#C9B8F0]/60",
      dot: "bg-[#7C3AED]",
    },
    blue: {
      container: "bg-accent/10 text-accent border-accent/20",
      dot: "bg-accent",
    },
    neutral: {
      container: "bg-white/80 text-textSecondary border-white shadow-card-flat",
      dot: "bg-slate-400",
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill text-xs font-semibold tracking-wide border shadow-sm backdrop-blur-md select-none",
        current.container,
        className
      )}
      {...props}
    >
      {withDot && (
        <span className="relative flex h-2 w-2">
          {pulseDot && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                current.dot
              )}
            />
          )}
          <span className={cn("relative inline-flex rounded-full h-2 w-2", current.dot)} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
