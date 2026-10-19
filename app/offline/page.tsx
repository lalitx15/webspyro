import Link from "next/link";
import { WifiOff, RotateCcw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-page-gradient">
      <div className="glass-panel max-w-md w-full p-8 rounded-card text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-peach/30 flex items-center justify-center text-rose">
          <WifiOff className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-textPrimary">You are offline</h1>
          <p className="text-textSecondary text-sm">
            It looks like your internet connection is currently unavailable. Please check your network and try again.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-pill bg-accent text-white font-medium hover:bg-accent-hover transition-colors shadow-glow"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Reloading</span>
        </Link>
      </div>
    </div>
  );
}
