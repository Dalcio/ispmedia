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
        // ISPmedia Brand Colors
        primary: {
          DEFAULT: '#FDC500',
          50: 'rgba(253, 197, 0, 0.05)',
          100: 'rgba(253, 197, 0, 0.1)',
          200: 'rgba(253, 197, 0, 0.2)',
          300: 'rgba(253, 197, 0, 0.3)',
          500: '#FDC500',
          600: '#E6B200',
          700: '#CC9F00',
          800: '#B38C00',
          900: '#997900',
        },
        dark: {
          DEFAULT: '#0F0F0F',
          50: '#1A1A1A',
          100: '#262626',
          200: '#333333',
          300: '#404040',
          400: '#525252',
          500: '#737373',
          600: '#A3A3A3',
          700: '#D4D4D4',
          800: '#E5E5E5',
          900: '#F5F5F5',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(15, 15, 15, 0.8)',
        },
        success: '#00FF88',
        error: '#FF4757',
        warning: '#FFA726',
        info: '#29B6F6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #FDC500 0%, #E6B200 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 25px 50px rgba(0, 0, 0, 0.4)',
        'primary': '0 10px 40px rgba(253, 197, 0, 0.3)',
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
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          'border-radius': '20px',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
        '.glass-nav': {
          background: 'rgba(15, 15, 15, 0.8)',
          'backdrop-filter': 'blur(15px)',
          'border-bottom': '1px solid rgba(253, 197, 0, 0.2)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
