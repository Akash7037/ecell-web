import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FBF9F4',
          dim: '#F5F3EE',
          muted: '#EBE7DE',
          container: '#EDE9E0',
          dark: '#121316',
        },
        ink: {
          DEFAULT: '#121316',
          muted: '#5C5A60',
          light: '#8A8890',
        },
        vermilion: {
          DEFAULT: '#FF4D2E',
          light: '#FF6B50',
          dark: '#D6391C',
        },
        brand: {
          50: '#FBF9F4',
          100: '#F5F3EE',
          200: '#EBE7DE',
          300: '#DDD7CB',
          400: '#8A8890',
          500: '#FF4D2E',
          600: '#E03E1D',
          700: '#121316',
          800: '#0E0E10',
          900: '#0A0A0C',
        },
        surface: {
          950: '#FBF9F4',
          900: '#F5F3EE',
          800: '#EDE9E0',
          700: '#E4E0D6',
          600: '#DDD7CB',
        },
        accent: {
          DEFAULT: '#FF4D2E',
          light: '#FF6B50',
          dark: '#D6391C',
        },
        palette: {
          cream: '#EDE8D0',
          ice: '#D0E4ED',
          lavender: '#DAD0ED',
        },
      },
      fontFamily: {
        headline: ['"Syne"', '"Space Grotesk"', 'sans-serif'],
        display: ['"Syne"', '"Space Grotesk"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '28': '7rem',
      },
      boxShadow: {
        'tactile': '3px 3px 0px #121316',
        'tactile-lg': '6px 6px 0px #121316',
        'tactile-vermilion': '3px 3px 0px #FF4D2E',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
