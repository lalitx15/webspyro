"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "bottom" | "right" | "left";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  position = "bottom",
  title,
  children,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const variants = {
    bottom: {
      initial: { y: "100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: 0 },
    },
    right: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
    },
    left: {
      initial: { x: "-100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
    },
  };

  const containerClasses = {
    bottom: "bottom-0 inset-x-0 max-h-[88dvh] rounded-t-card-lg border-t border-white/80 pb-safe",
    right: "top-0 right-0 h-full w-full max-w-md border-l border-white/80",
    left: "top-0 left-0 h-full w-full max-w-md border-r border-white/80",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm"
          />

          {/* Drawer Sheet */}
          <motion.div
            variants={variants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "fixed z-10 glass-panel bg-white/90 shadow-2xl flex flex-col p-6 overflow-hidden",
              containerClasses[position],
              className
            )}
          >
            {/* Top Handle for Bottom Drawer */}
            {position === "bottom" && (
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 shrink-0" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 mb-4 shrink-0">
              {title ? (
                <h3 className="font-display text-lg font-bold text-textPrimary">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-textSecondary cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto flex-1 pr-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
