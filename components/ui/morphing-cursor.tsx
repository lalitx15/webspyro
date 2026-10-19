"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// 1. MAGNETIC TEXT COMPONENT
// ---------------------------------------------------------------------------
export interface MagneticTextProps {
  text: string;
  hoverText?: string;
  className?: string;
}

export function MagneticText({ text = "CREATIVE", hoverText = "EXPLORE", className }: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const innerTextRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15);

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
      }

      if (innerTextRef.current) {
        innerTextRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y };
    currentPos.current = { x, y };
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative inline-flex items-center justify-center cursor-none select-none", className)}
    >
      {/* Base text layer - original text */}
      <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 tracking-wide">
        {text}
      </span>

      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none rounded-full bg-slate-950 overflow-hidden shadow-2xl"
        style={{
          width: isHovered ? 160 : 0,
          height: isHovered ? 160 : 0,
          transition: "width 0.45s cubic-bezier(0.33, 1, 0.68, 1), height 0.45s cubic-bezier(0.33, 1, 0.68, 1)",
          willChange: "transform, width, height",
        }}
      >
        <div
          ref={innerTextRef}
          className="absolute flex items-center justify-center"
          style={{
            width: containerSize.width,
            height: containerSize.height,
            top: "50%",
            left: "50%",
            willChange: "transform",
          }}
        >
          <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-cyan-300 whitespace-nowrap tracking-wide">
            {hoverText}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. GLOBAL MORPHING CURSOR (Replaces SmokeyCursor across the site)
// ---------------------------------------------------------------------------
export function MorphingCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const hoveringRef = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let animId: number | null = null;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const startAnimation = () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;

      const animateRing = () => {
        const dx = mousePos.current.x - ringPos.current.x;
        const dy = mousePos.current.y - ringPos.current.y;

        ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.22);
        ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.22);

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
        }

        // Only keep looping while moving toward target
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          animId = requestAnimationFrame(animateRing);
        } else {
          isRunningRef.current = false;
        }
      };

      animId = requestAnimationFrame(animateRing);
    };

    let lastCheckTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      startAnimation();

      // Throttle interactive element checks to reduce DOM traversal overhead
      const now = performance.now();
      if (now - lastCheckTime > 60) {
        lastCheckTime = now;
        const target = e.target as HTMLElement | null;
        if (target) {
          const isClickable = Boolean(
            target.closest("a, button, [role='button'], input, textarea, select, [data-magnetic]")
          );
          if (isClickable !== hoveringRef.current) {
            hoveringRef.current = isClickable;
            setIsHoveringInteractive(isClickable);
          }
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      isRunningRef.current = false;
      if (animId) cancelAnimationFrame(animId);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animId) cancelAnimationFrame(animId);
      isRunningRef.current = false;
    };
  }, [isVisible]);

  return (
    <>
      {/* Center dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-cyan-500 will-change-transform transition-opacity duration-200 hidden md:block",
          isVisible ? "opacity-100" : "opacity-0",
          isHoveringInteractive ? "w-2 h-2 opacity-0" : "w-2 h-2 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
        )}
      />

      {/* Trailing Morphing Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[9998] rounded-full will-change-transform transition-[width,height,background-color,border-color,opacity] duration-300 ease-out hidden md:block",
          isVisible ? "opacity-100" : "opacity-0",
          isHoveringInteractive
            ? "w-12 h-12 bg-cyan-500/15 border border-cyan-400 backdrop-blur-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            : "w-8 h-8 bg-transparent border border-cyan-500/40"
        )}
      />
    </>
  );
}

export default MorphingCursor;
