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
          DEFAULT: '#FAF9F6',
          dim: '#F5F5F4',
          muted: '#E7E5E4',
          container: '#EEEEEC',
          dark: '#1C1917',
        },
        ink: {
          DEFAULT: '#1C1917',
          muted: '#57534E',
          light: '#78716C',
        },
        vermilion: {
          DEFAULT: '#C2410C',
          light: '#EA580C',
          dark: '#9A3412',
        },
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#C2410C',
          600: '#9A3412',
          700: '#7C2D12',
          800: '#1C1917',
          900: '#0C0A09',
        },
        surface: {
          950: '#FAF9F6',
          900: '#F5F5F4',
          800: '#E7E5E4',
          700: '#D6D3D1',
          600: '#A8A29E',
        },
        accent: {
          DEFAULT: '#C2410C',
          light: '#EA580C',
          dark: '#9A3412',
          warm: '#F97316',
          neutral: '#78716C',
        },
        palette: {
          terracotta: '#C2410C',
          terracottaLight: '#FFF7ED',
          stone: '#57534E',
          stoneLight: '#E7E5E4',
          warmDark: '#1C1917',
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
