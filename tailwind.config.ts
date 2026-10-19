import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#EEF2F7",
        warmGlow: "#FFF6DC",
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.72)",
          solid: "#FFFFFF",
        },
        borderGlass: "rgba(255, 255, 255, 0.8)",
        textPrimary: "#000000",
        textSecondary: "#000000",
        textMuted: "#1E293B",
        accent: {
          DEFAULT: "#1F6FEB",
          hover: "#1858c2",
          light: "#5B8CFF",
        },
        pink: {
          DEFAULT: "#F4A9BE",
          light: "#FDECEF",
        },
        rose: {
          DEFAULT: "#F2657F",
        },
        peach: {
          DEFAULT: "#F8CFA6",
          light: "#FDF5ED",
        },
        mint: {
          DEFAULT: "#A9E3DD",
          light: "#EDFAF8",
        },
        sky: {
          DEFAULT: "#8FD3F0",
          light: "#EEF9FD",
        },
        periwinkle: {
          DEFAULT: "#6C7CF0",
          light: "#ECEEFC",
        },
        lavender: {
          DEFAULT: "#C9B8F0",
          light: "#F5F1FC",
        },
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },
      backgroundImage: {
        "page-gradient": "linear-gradient(135deg, #E3EEEA 0%, #E9EDF5 45%, #DCE3F2 100%)",
        "accent-grad": "linear-gradient(90deg, #1F6FEB, #5B8CFF)",
        "hero-art-grad": "linear-gradient(160deg, #F9B8C8 0%, #F8D9B0 28%, #BFD7F5 62%, #E7A8D8 85%, #4F7BFF 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.55) 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 12px 40px rgba(99,115,160,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
        "card-hover": "0 2px 4px rgba(15,23,42,0.06), 0 20px 50px rgba(99,115,160,0.22), inset 0 1px 0 rgba(255,255,255,0.95)",
        "card-flat": "0 1px 3px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
        glow: "0 8px 24px rgba(31,111,235,0.35)",
        "glow-lg": "0 12px 32px rgba(31,111,235,0.45)",
        "glow-pink": "0 8px 24px rgba(244,169,190,0.4)",
        "glow-peach": "0 8px 24px rgba(248,207,166,0.4)",
        "glow-mint": "0 8px 24px rgba(169,227,221,0.4)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
      },
      borderRadius: {
        card: "28px",
        "card-lg": "32px",
        panel: "40px",
        input: "16px",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-jakarta)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 2s infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "marquee": "marquee 35s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
