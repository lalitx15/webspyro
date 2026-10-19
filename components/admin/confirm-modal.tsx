"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case "info":
      default:
        return <Info className="w-6 h-6 text-accent" />;
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case "danger":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "success":
        return "bg-emerald-50 border-emerald-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "danger":
        return "danger" as const;
      default:
        return "primary" as const;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getIconBg()}`}
            >
              {getIcon()}
            </div>
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs font-semibold px-4 py-2"
            >
              {cancelText}
            </Button>
            <Button
              variant={getConfirmButtonVariant()}
              onClick={onConfirm}
              isLoading={isLoading}
              className="text-xs font-semibold px-5 py-2 shadow-md"
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
