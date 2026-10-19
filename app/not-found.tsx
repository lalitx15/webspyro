"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrbsBackground } from "@/components/ui/orbs-background";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-page-gradient relative overflow-hidden text-center">
      <OrbsBackground variant="minimal" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="glass-panel p-8 sm:p-12 rounded-card max-w-lg w-full space-y-6 shadow-2xl border border-white/90 relative z-10"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FDECEF] flex items-center justify-center text-rose shadow-glow-pink">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="font-display text-5xl sm:text-6xl font-extrabold text-accent tracking-tight block">
            404
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-textPrimary">
            Page Not Found
          </h1>
          <p className="text-sm text-textSecondary max-w-sm mx-auto leading-relaxed">
            The page you are looking for does not exist or may have been relocated to a new address.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link href="/design-system">
            <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Design System
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
