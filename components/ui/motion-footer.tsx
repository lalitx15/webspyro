"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  --pill-bg-1: rgba(255, 255, 255, 0.05);
  --pill-bg-2: rgba(255, 255, 255, 0.02);
  --pill-shadow: rgba(0, 0, 0, 0.6);
  --pill-highlight: rgba(255, 255, 255, 0.15);
  --pill-inset-shadow: rgba(0, 0, 0, 0.8);
  --pill-border: rgba(255, 255, 255, 0.12);
  
  --pill-bg-1-hover: rgba(255, 255, 255, 0.12);
  --pill-bg-2-hover: rgba(255, 255, 255, 0.05);
  --pill-border-hover: rgba(6, 182, 212, 0.45);
  --pill-shadow-hover: rgba(0, 0, 0, 0.7);
  --pill-highlight-hover: rgba(255, 255, 255, 0.25);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.5)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.8)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(6, 182, 212, 0.2) 0%, 
    rgba(59, 130, 246, 0.15) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  color: #ffffff !important;
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #ffffff !important;
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 24vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 25px rgba(6, 182, 212, 0.3));
}

@media (max-width: 767px) {
  .cinematic-footer-wrapper {
    background-color: #ffffff !important;
    color: #000000 !important;
  }
  .footer-giant-bg-text {
    -webkit-text-stroke: 1px rgba(0, 0, 0, 0.05);
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.06) 0%, transparent 60%);
    -webkit-background-clip: text;
    background-clip: text;
  }
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef && typeof forwardedRef === "object" && "current" in forwardedRef) {
            (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>High-Speed Engineering</span> <span className="text-cyan-400">✦</span>
    <span>Modern UI Design</span> <span className="text-blue-400">✦</span>
    <span>Conversion Focused</span> <span className="text-cyan-400">✦</span>
    <span>Dedicated Support</span> <span className="text-blue-400">✦</span>
    <span>5-Day Turnaround</span> <span className="text-cyan-400">✦</span>
  </div>
);

export interface CinematicFooterProps {
  onOpenQuote?: () => void;
  brandText?: string;
  headingText?: string;
  className?: string;
}

export function CinematicFooter({
  onOpenQuote,
  brandText = "WEBSPYRA",
  headingText = "Ready to build something extraordinary?",
  className = "",
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // Only run scrubbed parallax on desktop to prevent mobile GPU compositor lag and blinking
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "12vh", scale: 0.82, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 45%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToServices = () => {
    const el = document.getElementById("services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        Fixed on desktop with clip-path, relative on mobile to prevent GPU layer thrashing.
      */}
      <div
        ref={wrapperRef}
        className={cn("relative min-h-[85vh] md:h-screen w-full select-none overflow-hidden md:overflow-visible", className)}
      >
        {/* The footer stays fixed on desktop, and relative on mobile with white background */}
        <footer className="relative md:fixed md:bottom-0 md:left-0 flex min-h-[85vh] md:h-screen w-full flex-col justify-between overflow-hidden bg-white md:bg-black/[0.98] text-black md:text-white cinematic-footer-wrapper border-y border-slate-200 md:border-none">
          
          {/* Ambient Light & Grid Background (Desktop only) */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[90px] pointer-events-none z-0 hidden md:block" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none hidden md:block" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none uppercase"
          >
            {brandText}
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of section) */}
          <div className="absolute top-10 sm:top-14 left-0 w-full overflow-hidden border-y border-slate-200 md:border-white/15 bg-slate-50 md:bg-black/80 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-sm md:shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-extrabold tracking-[0.3em] text-slate-800 md:text-neutral-200 uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-16 sm:mt-20 w-full max-w-5xl mx-auto text-center">
            <h2
              ref={headingRef}
              className="text-3xl sm:text-6xl md:text-8xl font-black text-black md:text-white md:footer-text-glow tracking-tighter mb-6 sm:mb-12 text-center max-w-4xl"
            >
              {headingText}
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-5 sm:gap-6 w-full">
              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-3.5 sm:gap-5 w-full sm:w-auto">
                <MagneticButton
                  as="button"
                  onClick={onOpenQuote}
                  className="footer-glass-pill w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-5 rounded-full !text-white text-white font-extrabold text-xs sm:text-base flex items-center justify-center gap-2.5 sm:gap-3 group bg-slate-950 md:bg-gradient-to-r md:from-cyan-500/25 md:via-blue-500/25 md:to-cyan-500/25 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5),inset_0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_40px_rgba(6,182,212,0.85),inset_0_0_20px_rgba(6,182,212,0.4)] transition-all drop-shadow-[0_0_12px_rgba(6,182,212,0.7)]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping mr-1 shadow-[0_0_12px_#22d3ee]" />
                  <span className="!text-white text-white tracking-wide">Get Free Website Quote</span>
                  <svg className="w-4 h-4 text-cyan-300 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </MagneticButton>
                
                <MagneticButton
                  as="button"
                  onClick={scrollToServices}
                  className="footer-glass-pill w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-5 rounded-full !text-white text-white font-extrabold text-xs sm:text-base flex items-center justify-center gap-2.5 sm:gap-3 group border-2 border-cyan-500/60 md:border-cyan-400/50 hover:border-cyan-400 bg-slate-900 md:bg-white/[0.08] hover:bg-slate-800 md:hover:bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all"
                >
                  <span className="!text-white text-white tracking-wide">Explore Features</span>
                  <svg className="w-4 h-4 text-cyan-300 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </MagneticButton>
              </div>

              {/* Secondary Quick Links with Neon Highlights */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-5 w-full mt-2">
                <MagneticButton
                  as="a"
                  href="#pricing"
                  className="footer-glass-pill px-6 py-2.5 sm:py-3 rounded-full !text-white text-white font-extrabold text-xs md:text-sm border border-cyan-500/60 md:border-cyan-400/50 hover:border-cyan-400 bg-slate-900 md:bg-black/60 hover:bg-slate-800 md:hover:bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all tracking-wider"
                >
                  Pricing Plans
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="#portfolio"
                  className="footer-glass-pill px-6 py-2.5 sm:py-3 rounded-full !text-white text-white font-extrabold text-xs md:text-sm border border-cyan-500/60 md:border-cyan-400/50 hover:border-cyan-400 bg-slate-900 md:bg-black/60 hover:bg-slate-800 md:hover:bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all tracking-wider"
                >
                  Portfolio Works
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="#faq"
                  className="footer-glass-pill px-6 py-2.5 sm:py-3 rounded-full !text-white text-white font-extrabold text-xs md:text-sm border border-cyan-500/60 md:border-cyan-400/50 hover:border-cyan-400 bg-slate-900 md:bg-black/60 hover:bg-slate-800 md:hover:bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all tracking-wider"
                >
                  FAQ & Support
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-slate-600 md:text-neutral-300 text-[10px] md:text-xs font-bold tracking-widest uppercase order-2 md:order-1">
              © 2026 Webspyra. All rights reserved.
            </div>

            {/* "Made with Passion" Badge */}
            <div className="footer-glass-pill px-6 py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-slate-300 md:border-white/20 bg-slate-900 md:bg-white/10">
              <span className="text-neutral-200 text-[10px] md:text-xs font-bold uppercase tracking-widest">Crafted with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-rose-500">❤</span>
              <span className="text-neutral-200 text-[10px] md:text-xs font-bold uppercase tracking-widest">by</span>
              <span className="text-cyan-400 font-black text-xs md:text-sm tracking-normal ml-1">Webspyra</span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full footer-glass-pill flex items-center justify-center text-white hover:text-cyan-300 group order-3 border-slate-300 md:border-white/20 bg-slate-900 md:bg-white/10"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
