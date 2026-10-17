import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: "#B81D24",
          crimsonDark: "#941319",
          crimsonLight: "#E02830",
          black: "#111111",
          darkSurface: "#18181B",
          cardDark: "#222227",
          borderDark: "#2E2E36",
          slate: "#475569",
          muted: "#64748B",
          lightBg: "#F8FAFC",
          lightCard: "#FFFFFF",
          lightBorder: "#E2E8F0",
        },
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-8px)" },
          "40%, 80%": { transform: "translateX(8px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
        "pulse-slow": "pulseSlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
