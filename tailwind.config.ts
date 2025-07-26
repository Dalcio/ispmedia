import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ISPmedia Brand Colors (Tailwind-style palette)
        primary: {
          50: "#FFFDF0",
          100: "#FFFADC",
          200: "#FFF4B8",
          300: "#FFED94",
          400: "#FFE670",
          500: "#FDC500", // Main brand color
          600: "#E6B200",
          700: "#CC9F00",
          800: "#B38C00",
          900: "#997900",
          950: "#664D00",
        },
        dark: {
          50: "#F9F9F9",
          100: "#F0F0F0",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
        background: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#0F0F0F", // Main dark background
          950: "#000000",
        },
        glass: {
          50: "rgba(255, 255, 255, 0.02)",
          100: "rgba(255, 255, 255, 0.05)",
          200: "rgba(255, 255, 255, 0.08)",
          300: "rgba(255, 255, 255, 0.1)",
          400: "rgba(255, 255, 255, 0.15)",
          500: "rgba(255, 255, 255, 0.2)",
          600: "rgba(255, 255, 255, 0.3)",
          700: "rgba(255, 255, 255, 0.4)",
          800: "rgba(15, 15, 15, 0.8)",
          900: "rgba(15, 15, 15, 0.9)",
        },
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#00FF88", // Main success color
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#FF4757", // Main error color
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#FFA726", // Main warning color
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        info: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#29B6F6", // Main info color
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.05)", // Very subtle borders
          light: "rgba(255, 255, 255, 0.1)", // Light borders
          medium: "rgba(255, 255, 255, 0.15)", // Medium visibility
          strong: "rgba(255, 255, 255, 0.2)", // Strong borders
          heavy: "rgba(255, 255, 255, 0.3)", // Heavy borders
          primary: "rgba(253, 197, 0, 0.3)", // Primary accent borders
          accent: "rgba(253, 197, 0, 0.2)", // Accent borders
          focus: "rgba(253, 197, 0, 0.5)", // Focus state borders
          card: "rgba(255, 255, 255, 0.1)", // Card borders
          input: "rgba(255, 255, 255, 0.2)", // Input borders
          DEFAULT: "rgba(255, 255, 255, 0.1)",
        },
        text: {
          primary: "#FFFFFF", // Main text color (white)
          title: "#FFFFFF", // Headings and titles
          subtitle: "rgba(255, 255, 255, 0.9)", // Subtitles
          paragraph: "rgba(255, 255, 255, 0.8)", // Body text
          muted: "rgba(255, 255, 255, 0.6)", // Muted text
          disabled: "rgba(255, 255, 255, 0.4)", // Disabled state
          placeholder: "rgba(255, 255, 255, 0.5)", // Placeholder text
          caption: "rgba(255, 255, 255, 0.7)", // Captions and metadata
          accent: "#FDC500", // Brand accent text
          link: "#FDC500", // Link text
          DEFAULT: "#FFFFFF",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #FDC500 0%, #E6B200 100%)",
        "gradient-dark": "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
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
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 25px 50px rgba(0, 0, 0, 0.4)",
        primary: "0 10px 40px rgba(253, 197, 0, 0.3)",
      },
    },
  },
  plugins: [
    forms,
    typography,
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      const newUtilities = {
        ".glass-card": {
          background: "rgba(255, 255, 255, 0.05)",
          "backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          "border-radius": "20px",
          "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
        ".glass-nav": {
          background: "rgba(15, 15, 15, 0.8)",
          "backdrop-filter": "blur(15px)",
          "border-bottom": "1px solid rgba(253, 197, 0, 0.2)",
        },
        ".text-gradient": {
          background: "linear-gradient(135deg, #FDC500 0%, #E6B200 100%)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
        ".border-gradient": {
          border: "1px solid transparent",
          "background-clip": "padding-box",
          "background-image":
            "linear-gradient(135deg, rgba(253, 197, 0, 0.3) 0%, rgba(230, 178, 0, 0.1) 100%)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
