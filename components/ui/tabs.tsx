"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  layoutId?: string;
  className?: string;
  variant?: "pill" | "glass" | "underline";
  isDark?: boolean;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  layoutId = "active-tab-indicator",
  className,
  variant = "glass",
  isDark = false,
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center p-1.5 rounded-pill select-none overflow-x-auto max-w-full",
        isDark
          ? "bg-neutral-900/90 border border-neutral-700/80 shadow-2xl"
          : "glass-pill border border-white/80 shadow-card",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-5 py-2.5 rounded-pill text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
              isDark
                ? isActive
                  ? "text-black font-extrabold"
                  : "text-neutral-300 hover:text-white"
                : isActive
                ? "text-accent"
                : "text-textSecondary hover:text-textPrimary"
            )}
          >
            {/* Sliding Pill Indicator */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className={cn(
                  "absolute inset-0 rounded-pill shadow-card",
                  isDark
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    : variant === "glass"
                    ? "bg-white border border-white/95"
                    : "bg-accent-grad text-white"
                )}
              />
            )}

            <span className={cn(
              "relative z-10 flex items-center gap-2",
              isDark && isActive && "!text-black font-extrabold",
              !isDark && isActive && variant === "pill" && "text-white"
            )}>
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-pill font-bold",
                    isDark
                      ? isActive
                        ? "bg-black/20 text-black"
                        : "bg-neutral-800 text-neutral-300"
                      : isActive
                      ? "bg-accent/15 text-accent"
                      : "bg-slate-200 text-textSecondary"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
