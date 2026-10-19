"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";

export interface KpiCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change?: number; // e.g. +14.2 or -3.5
  changePeriod?: string; // e.g. "vs last 30 days"
  icon: LucideIcon;
  themeColor?: "blue" | "mint" | "pink" | "peach" | "lavender";
  description?: string;
}

export function KpiCard({
  title,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  change,
  changePeriod = "vs last month",
  icon: Icon,
  themeColor = "blue",
  description,
}: KpiCardProps) {
  const getThemeStyles = () => {
    switch (themeColor) {
      case "mint":
        return {
          iconBg: "bg-teal-50 border-teal-200 text-teal-600",
          cardBorder: "hover:border-teal-300",
          glow: "from-teal-100/40 via-transparent to-transparent",
        };
      case "pink":
        return {
          iconBg: "bg-rose-50 border-rose-200 text-rose-500",
          cardBorder: "hover:border-rose-300",
          glow: "from-rose-100/40 via-transparent to-transparent",
        };
      case "peach":
        return {
          iconBg: "bg-amber-50 border-amber-200 text-amber-600",
          cardBorder: "hover:border-amber-300",
          glow: "from-amber-100/40 via-transparent to-transparent",
        };
      case "lavender":
        return {
          iconBg: "bg-purple-50 border-purple-200 text-purple-600",
          cardBorder: "hover:border-purple-300",
          glow: "from-purple-100/40 via-transparent to-transparent",
        };
      case "blue":
      default:
        return {
          iconBg: "bg-blue-50 border-blue-200 text-accent",
          cardBorder: "hover:border-blue-300",
          glow: "from-blue-100/40 via-transparent to-transparent",
        };
    }
  };

  const theme = getThemeStyles();
  const isPositive = change !== undefined ? change >= 0 : true;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all ${theme.cardBorder}`}
    >
      {/* Background subtle gradient glow */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${theme.glow} rounded-full blur-2xl pointer-events-none`}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm ${theme.iconBg}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        {prefix && <span className="text-xl font-bold text-slate-700">{prefix}</span>}
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          <CountUp
            to={value}
            duration={1.8}
            decimals={decimals}
          />
        </span>
        {suffix && <span className="text-base font-semibold text-slate-500">{suffix}</span>}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100/80">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-rose-50 text-rose-700 border border-rose-200/60"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-slate-400 font-medium">{changePeriod}</span>
          </div>
        ) : (
          <span className="text-slate-400 font-medium">{description || "Real-time metric"}</span>
        )}
      </div>
    </motion.div>
  );
}
