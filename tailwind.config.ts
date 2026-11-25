import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          light: "#EEF2FF",
          dark: "#6366F1",
        },
        secondary: {
          DEFAULT: "#7C3AED",
          hover: "#6D28D9",
          light: "#F5F3FF",
          dark: "#8B5CF6",
        },
        accent: {
          DEFAULT: "#06B6D4",
          light: "#ECFEFF",
        },
        navy: {
          DEFAULT: "#0F172A",
          dark: "#0A0F1D",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "sans-serif"],
        heading: ["var(--font-heading)", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
