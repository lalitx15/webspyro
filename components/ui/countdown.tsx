"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";
import { Flame, Sparkles } from "lucide-react";

export interface CountdownProps {
  targetDate: string | Date | number;
  label?: string;
  className?: string;
}

// Single rolling digital tumbler slot
function RollingDigit({ digit }: { digit: string }) {
  return (
    <div className="relative inline-flex h-9 sm:h-12 w-5 sm:w-6 items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: -26, opacity: 0, scale: 0.8, filter: "blur(2px)" }}
          animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ y: 26, opacity: 0, scale: 0.8, filter: "blur(2px)" }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 28,
            mass: 0.8,
          }}
          className="absolute inset-0 flex items-center justify-center font-display font-black text-xl sm:text-3xl leading-none tabular-nums"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Time Unit Card Container (e.g. Hours, Minutes, Seconds)
interface TimeUnitBoxProps {
  value: string; // 2-digit string
  label: string;
  isAccent?: boolean;
}

function TimeUnitBox({ value, label, isAccent = false }: TimeUnitBoxProps) {
  const digits = value.padStart(2, "0").split("");

  return (
    <div className="flex flex-col items-center group">
      {/* 3D Glass Cyber Tile */}
      <div
        className={cn(
          "relative px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl flex items-center justify-center gap-0.5 sm:gap-1 transition-all duration-300 select-none shadow-2xl",
          isAccent
            ? "bg-gradient-to-b from-rose-950/70 via-black/90 to-black/95 border-2 border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.35)]"
            : "bg-gradient-to-b from-neutral-900/80 via-black/90 to-black/95 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        )}
      >
        {/* Top Gloss Highlight Streak */}
        <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Subtle Ambient Back-Glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl pointer-events-none opacity-40 blur-md transition-opacity group-hover:opacity-75",
            isAccent ? "bg-rose-500/20" : "bg-cyan-500/15"
          )}
        />

        {/* Rolling Digits */}
        <div
          className={cn(
            "relative z-10 flex items-center",
            isAccent
              ? "text-transparent bg-clip-text bg-gradient-to-b from-rose-200 via-rose-400 to-amber-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.7)]"
              : "text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          )}
        >
          <RollingDigit digit={digits[0] || "0"} />
          <RollingDigit digit={digits[1] || "0"} />
        </div>
      </div>

      {/* High-Contrast Unit Label */}
      <span
        className={cn(
          "text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-extrabold mt-1.5 transition-colors",
          isAccent ? "text-rose-300 font-black drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]" : "text-cyan-300"
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function Countdown({
  targetDate,
  label = "Limited-Time Launch Offer Ends In:",
  className,
}: CountdownProps) {
  const { hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700 text-xs text-slate-300 font-bold",
          className
        )}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Offer expired — Contact us for new deals</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-2.5", className)}>
      {/* Top Pulsing Live Deal Pill */}
      {label && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/35 text-rose-300 text-[11px] sm:text-xs font-black tracking-wider uppercase backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.25)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]" />
          </span>
          <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
          <span>{label}</span>
        </div>
      )}

      {/* Main Digital Clock Layout */}
      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
        {/* Hours */}
        <TimeUnitBox value={hours} label="Hours" />

        {/* Pulsing Colon Separator */}
        <div className="flex flex-col gap-1.5 px-0.5 -mt-5">
          <motion.span
            animate={{ opacity: [1, 0.25, 1], scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]"
          />
          <motion.span
            animate={{ opacity: [1, 0.25, 1], scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]"
          />
        </div>

        {/* Minutes */}
        <TimeUnitBox value={minutes} label="Minutes" />

        {/* Pulsing Colon Separator */}
        <div className="flex flex-col gap-1.5 px-0.5 -mt-5">
          <motion.span
            animate={{ opacity: [1, 0.25, 1], scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.9)]"
          />
          <motion.span
            animate={{ opacity: [1, 0.25, 1], scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.9)]"
          />
        </div>

        {/* Seconds (Pulsing Accent) */}
        <TimeUnitBox value={seconds} label="Seconds" isAccent />
      </div>
    </div>
  );
}
