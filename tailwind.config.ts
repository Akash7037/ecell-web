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
          DEFAULT: '#8C3A26',
          light: '#A34630',
          dark: '#6E2D1D',
        },
        brand: {
          50: '#FFEEDB',
          100: '#F5F3EE',
          200: '#EBE7DE',
          300: '#DDD7CB',
          400: '#8A8890',
          500: '#8C3A26',
          600: '#824539',
          700: '#268B8C',
          800: '#121316',
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
          DEFAULT: '#8C3A26',
          light: '#A34630',
          dark: '#6E2D1D',
          teal: '#268B8C',
          emerald: '#268C48',
        },
        palette: {
          cream: '#FFEEDB',
          mint: '#DBFFFD',
          terracotta: '#824539',
          bronze: '#825E39',
          aqua: '#C4FEFF',
          blush: '#FFD0C4',
          emerald: '#268C48',
          teal: '#268B8C',
          crimson: '#8C3A26',
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
        'tactile-vermilion': '3px 3px 0px #8C3A26',
        'tactile-teal': '3px 3px 0px #268B8C',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'ken-burns': 'kenBurns 26s ease-in-out infinite alternate',
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
        kenBurns: {
          '0%': { transform: 'scale(1.02) translate(0%, 0%)' },
          '50%': { transform: 'scale(1.09) translate(-1.5%, 1%)' },
          '100%': { transform: 'scale(1.05) translate(1.5%, -1%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
