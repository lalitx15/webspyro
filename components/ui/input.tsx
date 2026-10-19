"use client";

import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, className, value, defaultValue, onFocus, onBlur, onChange, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      onChange?.(e);
    };

    const isFloating = isFocused || hasValue || Boolean(value);

    return (
      <div className="w-full space-y-1.5">
        <motion.div
          animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative w-full"
        >
          <input
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              "w-full h-14 px-4 pt-5 pb-1 rounded-input text-base text-textPrimary glass-input transition-all duration-200 placeholder-transparent",
              error
                ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
                : success
                ? "border-success focus:border-success focus:ring-2 focus:ring-success/20"
                : "focus:border-accent focus:ring-2 focus:ring-accent/20",
              className
            )}
            {...props}
          />

          {/* Floating Label */}
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 pointer-events-none transition-all duration-200 select-none",
              isFloating
                ? "top-1.5 text-xs font-medium"
                : "top-4 text-base text-textSecondary",
              error
                ? "text-danger"
                : success
                ? "text-success"
                : isFocused
                ? "text-accent font-semibold"
                : "text-textSecondary"
            )}
          >
            {label}
          </label>

          {/* Status Icons */}
          <div className="absolute right-4 top-4 pointer-events-none flex items-center">
            {error && <AlertCircle className="w-5 h-5 text-danger" />}
            {success && !error && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success"
              >
                <Check className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Error or Helper Text */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-danger font-medium pl-1 flex items-center gap-1"
            >
              {error}
            </motion.p>
          )}
          {!error && helperText && (
            <p className="text-xs text-textSecondary pl-1">{helperText}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, success, helperText, className, value, defaultValue, onFocus, onBlur, onChange, id, rows = 4, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    const isFloating = isFocused || hasValue || Boolean(value);

    return (
      <div className="w-full space-y-1.5">
        <motion.div
          animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative w-full"
        >
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            value={value}
            defaultValue={defaultValue}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(Boolean(e.target.value));
              onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value));
              onChange?.(e);
            }}
            className={cn(
              "w-full px-4 pt-6 pb-2 rounded-input text-base text-textPrimary glass-input transition-all duration-200 placeholder-transparent resize-y",
              error
                ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
                : success
                ? "border-success focus:border-success focus:ring-2 focus:ring-success/20"
                : "focus:border-accent focus:ring-2 focus:ring-accent/20",
              className
            )}
            {...props}
          />

          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 pointer-events-none transition-all duration-200 select-none",
              isFloating
                ? "top-1.5 text-xs font-medium"
                : "top-4 text-base text-textSecondary",
              error
                ? "text-danger"
                : success
                ? "text-success"
                : isFocused
                ? "text-accent font-semibold"
                : "text-textSecondary"
            )}
          >
            {label}
          </label>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-danger font-medium pl-1 flex items-center gap-1"
            >
              {error}
            </motion.p>
          )}
          {!error && helperText && (
            <p className="text-xs text-textSecondary pl-1">{helperText}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className, id, value, defaultValue, onChange, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full space-y-1.5">
        <div className="relative w-full">
          <select
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            className={cn(
              "w-full max-w-full h-14 pl-3.5 pr-8 pt-5 pb-1 rounded-input text-xs sm:text-sm text-textPrimary glass-input appearance-none bg-white/95 cursor-pointer focus:border-accent focus:ring-2 focus:ring-accent/20 truncate overflow-hidden",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-black bg-white text-xs sm:text-sm py-1">
                {opt.label}
              </option>
            ))}
          </select>

          <label
            htmlFor={inputId}
            className="absolute left-4 top-1.5 text-xs font-medium text-textSecondary pointer-events-none select-none"
          >
            {label}
          </label>

          <div className="pointer-events-none absolute right-4 top-5 text-textMuted">
            ▼
          </div>
        </div>

        {error && <p className="text-xs text-danger font-medium pl-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-textSecondary pl-1">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
