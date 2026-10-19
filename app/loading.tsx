import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Soft Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-accent/10 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-pink/15 blur-[90px] pointer-events-none -z-10" />

      {/* Loading Glass Card */}
      <div className="p-8 rounded-3xl bg-surface backdrop-blur-2xl border border-borderGlass shadow-glass flex flex-col items-center space-y-4 max-w-sm w-full text-center animate-fade-in">
        <div className="relative flex items-center justify-center">
          {/* Animated Spinner Ring */}
          <div className="w-14 h-14 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
          <div className="absolute w-6 h-6 rounded-full bg-accent/10 animate-pulse flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <h3 className="font-heading font-bold text-base text-textPrimary">
            Webspyra
          </h3>
          <p className="text-xs text-textSecondary">
            Loading next-gen digital experience...
          </p>
        </div>

        {/* Shimmer Bar */}
        <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-accent via-periwinkle to-pink animate-shimmer-sweep rounded-full w-2/3" />
        </div>
      </div>
    </div>
  );
}
