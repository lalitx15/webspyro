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
      container: "bg-[#dcfce7] text-slate-950 font-extrabold border-emerald-400/80 shadow-xs",
      dot: "bg-emerald-600",
    },
    peach: {
      container: "bg-[#ffedd5] text-slate-950 font-extrabold border-amber-400/80 shadow-xs",
      dot: "bg-amber-600",
    },
    pink: {
      container: "bg-[#ffe4e6] text-slate-950 font-extrabold border-rose-400/80 shadow-xs",
      dot: "bg-rose-600",
    },
    sky: {
      container: "bg-[#e0f2fe] text-slate-950 font-extrabold border-sky-400/80 shadow-xs",
      dot: "bg-sky-600",
    },
    periwinkle: {
      container: "bg-[#e0e7ff] text-slate-950 font-extrabold border-indigo-400/80 shadow-xs",
      dot: "bg-indigo-600",
    },
    lavender: {
      container: "bg-[#f3e8ff] text-slate-950 font-extrabold border-purple-400/80 shadow-xs",
      dot: "bg-purple-600",
    },
    blue: {
      container: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40",
      dot: "bg-cyan-400",
    },
    neutral: {
      container: "bg-white/95 text-slate-950 font-extrabold border-slate-300 shadow-sm",
      dot: "bg-slate-700",
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
