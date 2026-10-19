"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ThreeDCardProps {
  title: string;
  description: string;
  gradient?: string;
  badge?: string;
  ctaText?: string;
  ctaHref?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ThreeDCard({
  title,
  description,
  gradient = "linear-gradient(135deg, rgb(0, 255, 214) 0%, rgb(8, 226, 96) 100%)",
  badge,
  ctaText = "View more",
  ctaHref = "#pricing",
  icon,
  className,
}: ThreeDCardProps) {
  return (
    <div className={cn("uiverse-parent w-full h-[300px] sm:h-[380px]", className)}>
      <div
        className="uiverse-card relative h-full w-full rounded-[28px] sm:rounded-[40px] shadow-xl transition-all duration-500 ease-in-out"
        style={{
          background: gradient,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Layered Floating 3D Circles */}
        <div className="uiverse-logo absolute right-0 top-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
          <span className="uiverse-circle uiverse-circle1" />
          <span className="uiverse-circle uiverse-circle2" />
          <span className="uiverse-circle uiverse-circle3" />
          <span className="uiverse-circle uiverse-circle4" />
          <span className="uiverse-circle uiverse-circle5">
            {icon ? (
              <div className="w-6 h-6 flex items-center justify-center text-slate-900">
                {icon}
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.667 31.69" className="w-5 h-5 fill-slate-900">
                <path d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" />
                <path d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" transform="translate(-45.91 0)" />
                <path d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" transform="translate(0 -51.963)" />
              </svg>
            )}
          </span>
        </div>

        {/* Frosted Glass Overlay */}
        <div className="uiverse-glass" />

        {/* Card Main Text Content (100% BLACK TEXT) */}
        <div className="uiverse-content">
          {badge && (
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-black bg-white/90 border border-black/10 px-2.5 py-1 rounded-full mb-3 shadow-xs">
              {badge}
            </span>
          )}
          <span className="uiverse-title">{title}</span>
          <span className="uiverse-text">{description}</span>
        </div>

        {/* Bottom Actions Bar */}
        <div className="uiverse-bottom">
          <div className="uiverse-social-buttons">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="uiverse-social-btn"
            >
              <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-black">
                <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
              </svg>
            </a>

            <a
              href="#pricing"
              aria-label="Features"
              className="uiverse-social-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-black">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </a>

            <a
              href="#enquire"
              aria-label="Enquire"
              className="uiverse-social-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-black">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </a>
          </div>

          <a href={ctaHref} className="uiverse-view-more">
            <span className="uiverse-view-more-text">{ctaText}</span>
            <svg
              className="w-4 h-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ThreeDCard;
