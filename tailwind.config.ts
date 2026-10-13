import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "#F4F0E9",
          paper: "#EDE7DC",
          card: "#FFFFFF",
          subtle: "#EAE3D6",
          dark: "#1E1C1A",
        },
        charcoal: {
          main: "#201D1A",
          muted: "#645E55",
          subtle: "#8F877C",
          light: "#F4F0E9",
        },
        border: {
          subtle: "#E4DDD1",
          medium: "#D3CAB9",
          dark: "#201D1A",
        },
        accent: {
          terracotta: "#B8654F",
          indigo: "#3D5A72",
          sage: "#5F6E56",
          gold: "#C09A4D",
          blush: "#DECBC6",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["'Cinzel'", "Georgia", "serif"],
      },
      letterSpacing: {
        editorial: "0.14em",
        wideDisplay: "0.22em",
      },
      boxShadow: {
        editorial: "0 4px 20px -2px rgba(32, 29, 26, 0.05)",
        lift: "0 12px 32px -4px rgba(32, 29, 26, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
