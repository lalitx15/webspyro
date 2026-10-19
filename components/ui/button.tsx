"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-cyan-500 hover:bg-cyan-400 text-white shadow-md",
        primary: "bg-accent-grad text-white shadow-glow hover:shadow-glow-lg border border-white/20",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md",
        outline: "bg-transparent hover:bg-white/10 text-white border border-neutral-700 hover:border-neutral-500",
        ghost: "bg-transparent hover:bg-white/10 text-white",
        danger: "bg-rose-600 hover:bg-rose-700 text-white",
      },
      size: {
        default: "h-11 px-6 text-sm font-semibold rounded-xl",
        sm: "h-9 px-4 text-xs font-semibold rounded-lg",
        md: "h-11 px-6 text-sm font-semibold rounded-xl",
        lg: "h-13 px-8 text-base font-semibold rounded-xl",
        icon: "h-10 w-10 p-0 flex items-center justify-center rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "pastel-peach"
  | "pastel-mint"
  | "pastel-pink"
  | "pastel-sky"
  | "pastel-lavender"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-10 px-4 text-xs font-semibold gap-1.5 rounded-pill",
      md: "h-12 px-6 text-sm font-semibold gap-2 rounded-pill",
      lg: "h-14 px-8 text-base font-semibold gap-2.5 rounded-pill",
      icon: "h-11 w-11 p-0 flex items-center justify-center rounded-pill",
    };

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        "bg-accent-grad text-white shadow-glow hover:shadow-glow-lg border border-white/20 relative overflow-hidden group",
      secondary:
        "bg-white/80 hover:bg-white text-textPrimary border border-white/90 shadow-card hover:shadow-card-hover backdrop-blur-md",
      "pastel-peach":
        "bg-[#FDF5ED] hover:bg-[#F8CFA6]/30 text-[#B45309] border border-[#F8CFA6]/50 shadow-card hover:shadow-glow-peach",
      "pastel-mint":
        "bg-[#EDFAF8] hover:bg-[#A9E3DD]/30 text-[#0F766E] border border-[#A9E3DD]/50 shadow-card hover:shadow-glow-mint",
      "pastel-pink":
        "bg-[#FDECEF] hover:bg-[#F4A9BE]/30 text-[#BE123C] border border-[#F4A9BE]/50 shadow-card hover:shadow-glow-pink",
      "pastel-sky":
        "bg-[#EEF9FD] hover:bg-[#8FD3F0]/30 text-[#0369A1] border border-[#8FD3F0]/50 shadow-card",
      "pastel-lavender":
        "bg-[#F5F1FC] hover:bg-[#C9B8F0]/30 text-[#6D28D9] border border-[#C9B8F0]/50 shadow-card",
      outline:
        "bg-transparent hover:bg-white/40 text-textPrimary border border-slate-300/80 hover:border-slate-400 backdrop-blur-sm",
      ghost:
        "bg-transparent hover:bg-white/50 text-textPrimary hover:text-accent",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-lg border border-rose-500",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {/* Shimmer sweep effect on primary button */}
        {variant === "primary" && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
          />
        )}

        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        {children && <span>{children}</span>}

        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
