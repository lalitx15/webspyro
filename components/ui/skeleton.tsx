"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rounded" | "pill" | "circle" | "card";
}

export function Skeleton({ className, variant = "rounded", ...props }: SkeletonProps) {
  const variantClasses = {
    rounded: "rounded-xl",
    pill: "rounded-pill",
    circle: "rounded-full aspect-square",
    card: "rounded-card",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-slate-200/60 dark:bg-slate-300/40",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}
