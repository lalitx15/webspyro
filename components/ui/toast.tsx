"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 3500 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => addToast({ type: "success", title, message }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) => addToast({ type: "error", title, message }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) => addToast({ type: "info", title, message }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => addToast({ type: "warning", title, message }),
    [addToast]
  );

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
    info: <Info className="w-5 h-5 text-accent shrink-0" />,
  };

  const borderStyles = {
    success: "border-success/30 bg-[#EDFAF8]/95",
    error: "border-danger/30 bg-[#FDECEF]/95",
    warning: "border-warning/30 bg-[#FEF3C7]/95",
    info: "border-accent/30 bg-[#EEF9FD]/95",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}

      {/* Toast Viewport (top-center on mobile, top-right on desktop) */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "pointer-events-auto rounded-2xl glass-panel p-4 shadow-xl border backdrop-blur-xl relative overflow-hidden flex items-start gap-3",
                borderStyles[t.type]
              )}
            >
              {icons[t.type]}

              <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-display text-sm font-bold text-textPrimary leading-tight">
                  {t.title}
                </h4>
                {t.message && (
                  <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="w-6 h-6 rounded-full hover:bg-slate-200/50 flex items-center justify-center text-textMuted hover:text-textPrimary transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Shrinking progress bar */}
              {t.duration && t.duration > 0 && (
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: t.duration / 1000, ease: "linear" }}
                  className={cn(
                    "absolute bottom-0 left-0 h-1",
                    t.type === "success" && "bg-success",
                    t.type === "error" && "bg-danger",
                    t.type === "warning" && "bg-warning",
                    t.type === "info" && "bg-accent"
                  )}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
