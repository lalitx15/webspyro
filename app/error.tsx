"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Runtime error caught by root boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose/10 blur-[90px] pointer-events-none -z-10" />

      <div className="p-8 md:p-10 rounded-3xl bg-surface backdrop-blur-2xl border border-borderGlass shadow-glass max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose/10 text-rose mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-heading text-textPrimary">
            Something went wrong
          </h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            We encountered an unexpected error while preparing this page. You can try refreshing or return to the homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/80 border border-borderGlass text-sm font-semibold text-textPrimary hover:bg-white transition-all shadow-sm"
          >
            <Home className="w-4 h-4 text-textSecondary" />
            Back to Home
          </Link>
        </div>

        {/* Technical Error Details */}
        <div className="pt-2 border-t border-borderGlass text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-xs font-semibold text-textSecondary hover:text-textPrimary transition-colors"
          >
            <span>Error Details</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showDetails && (
            <div className="mt-2 p-3 rounded-xl bg-slate-900 text-rose-300 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-36">
              <p className="font-bold text-white mb-1">{error.name}: {error.message}</p>
              {error.digest && <p className="text-slate-400">Digest: {error.digest}</p>}
              {error.stack && <pre className="text-slate-400 text-[10px] mt-1 whitespace-pre-wrap">{error.stack}</pre>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
