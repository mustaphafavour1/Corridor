import type { Config } from "tailwindcss";

/**
 * ── CORRIDOR DESIGN SYSTEM ────────────────────────────────────────────────────
 * Dark-first institutional fintech. All colour comes from CSS variables defined
 * in src/app/globals.css so UI, charts and the calendar pull from ONE source.
 *
 *  • Brand tone: dirty green (#51645A) built into a dark surface scale.
 *  • Accent: rose gold (#C08A7D) — used sparingly for CTAs / active / key figures.
 *  • Semantic status colours are deliberately distinct from brand + accent.
 *  • Type scale is dense (base ~10px) with weight/size as the hierarchy tool.
 *  • Divider lines are intentionally very faint (see `hairline` tokens).
 * ──────────────────────────────────────────────────────────────────────────────
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Dense, px-based type scale. Body base is ~10px (see globals.css).
    fontSize: {
      "3xs": ["8px", { lineHeight: "12px" }],
      "2xs": ["9px", { lineHeight: "13px", letterSpacing: "0.01em" }],
      xs: ["10px", { lineHeight: "15px" }],
      sm: ["11px", { lineHeight: "16px" }],
      base: ["12px", { lineHeight: "17px" }],
      md: ["13px", { lineHeight: "18px" }],
      lg: ["14px", { lineHeight: "20px" }],
      xl: ["16px", { lineHeight: "22px" }],
      "2xl": ["19px", { lineHeight: "25px", letterSpacing: "-0.01em" }],
      "3xl": ["23px", { lineHeight: "28px", letterSpacing: "-0.015em" }],
      "4xl": ["28px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
      "5xl": ["34px", { lineHeight: "38px", letterSpacing: "-0.02em" }],
      "6xl": ["44px", { lineHeight: "46px", letterSpacing: "-0.025em" }],
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
          4: "var(--surface-4)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          muted: "var(--brand-muted)",
          soft: "var(--brand-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hi: "var(--accent-hi)",
          deep: "var(--accent-deep)",
          contrast: "var(--accent-contrast)",
          soft: "var(--accent-soft)",
        },
        content: {
          DEFAULT: "var(--text)",
          2: "var(--text-2)",
          muted: "var(--text-muted)",
          faint: "var(--text-faint)",
          dim: "var(--text-dim)",
        },
        success: { DEFAULT: "var(--success)", soft: "var(--success-soft)" },
        warning: { DEFAULT: "var(--warning)", soft: "var(--warning-soft)" },
        danger: { DEFAULT: "var(--danger)", soft: "var(--danger-soft)" },
        info: { DEFAULT: "var(--info)", soft: "var(--info-soft)" },
        violet: { DEFAULT: "var(--violet)", soft: "var(--violet-soft)" },
        hairline: {
          DEFAULT: "var(--border)",
          faint: "var(--border-faint)",
          strong: "var(--border-strong)",
        },
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-parkinsans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-parkinsans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        card: "14px",
        panel: "12px",
        control: "8px",
        sm: "6px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.35)",
        card: "0 2px 10px rgba(0,0,0,0.28)",
        pop: "0 12px 34px rgba(0,0,0,0.48)",
        "accent-glow": "0 4px 20px rgba(192,138,125,0.22)",
      },
      ringColor: {
        DEFAULT: "var(--ring)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.24s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-right": "slide-in-right 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-up": "slide-in-up 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
