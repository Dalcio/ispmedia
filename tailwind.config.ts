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
        // Cores principais da identidade visual ISPmedia
        primary: {
          DEFAULT: "#FDC500",
          hover: "#E6B200",
          light: "rgba(253, 197, 0, 0.1)",
          dark: "#D4A900",
        },
        dark: {
          DEFAULT: "#1A1A1A",
          medium: "#2A2A2A",
          light: "#3A3A3A",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B3B3B3",
          tertiary: "#808080",
        },
        status: {
          success: "#22C55E",
          error: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(42, 42, 42, 0.6) 0%, rgba(58, 58, 58, 0.4) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 20px 40px rgba(0, 0, 0, 0.4)",
        "primary-glow": "0 0 20px rgba(253, 197, 0, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
