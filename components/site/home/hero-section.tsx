"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Tag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getHeroData, HeroData, defaultHero } from "@/lib/home-data";
import { SonarGrid } from "@/components/ui/sonar-grid";

export interface HeroSectionProps {
  onOpenQuote?: () => void;
}

export function HeroSection({ onOpenQuote }: HeroSectionProps) {
  const [hero, setHero] = useState<HeroData>(defaultHero);

  useEffect(() => {
    getHeroData().then(setHero);
  }, []);

  const badgeText = hero.badge_text || "WE BUILD WEBSITES THAT HELP BUSINESSES GROW";
  const subtitleText =
    hero.subtitle ||
    "Fast, modern websites built to turn visitors into enquiries — without the agency complexity.";

  const handleScrollToPortfolio = () => {
    const el = document.getElementById("portfolio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "portfolio";
    }
  };

  return (
    <SonarGrid
      id="hero-sonar-grid"
      ringWidth={90}
      speed={260}
      amplitude={2.2}
      pingEvery={2.4}
      interactive={true}
      spacing={26}
      baseOpacity={0.25}
      color="#06b6d4"
      pingArea={[0.15, 0.2, 0.85, 0.8]}
      className="relative w-full min-h-[92vh] lg:min-h-screen bg-black/[0.98] overflow-hidden flex flex-col justify-center items-center border-b border-neutral-900"
    >
      {/* Soft wash behind copy to keep it ultra-legible while expanding sonar rings pass underneath */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,0,0,0.85)_0%,transparent_100%)]"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-28 flex flex-col items-center text-center">
        
        {/* 1. Top Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.25)] mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{badgeText}</span>
        </motion.div>

        {/* 2. Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[1.08] text-white max-w-4xl"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400">
            A better website.
          </span>{" "}
          <span className="text-white">More trust. </span>
          <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]">
            More customers.
          </span>
        </motion.h1>

        {/* 3. Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-neutral-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-normal mt-6"
        >
          {subtitleText}
        </motion.p>

        {/* 4. Price Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-sm mt-7"
        >
          <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            <Tag className="w-3 h-3 fill-black stroke-none" />
          </span>
          <span className="text-xs sm:text-sm font-medium text-neutral-200">
            Website starts from{" "}
            <strong className="font-extrabold text-cyan-400 text-sm sm:text-base">
              ₹6,999/-
            </strong>
          </span>
        </motion.div>

        {/* 5. CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto"
        >
          <button
            type="button"
            onClick={onOpenQuote}
            className="group w-full sm:w-auto px-6 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs sm:text-base tracking-wider uppercase shadow-[0_12px_32px_rgba(6,182,212,0.4)] hover:shadow-[0_16px_40px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>GET A FREE WEBSITE QUOTE</span>
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={handleScrollToPortfolio}
            className="px-6 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white underline underline-offset-8 decoration-neutral-700 hover:decoration-cyan-400 transition-colors cursor-pointer"
          >
            See our work
          </button>
        </motion.div>

      </div>
    </SonarGrid>
  );
}

export default HeroSection;
