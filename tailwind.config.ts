import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f0d16',
        'bg-2': '#16131f',
        surface: '#1e1b28',
        'surface-2': '#282533',
        'surface-glass': 'rgba(30,27,40,0.72)',
        ember: '#d45a0e',
        'ember-2': '#e8721f',
        'ember-3': '#8a3d0a',
        'ember-glow': 'rgba(212,90,14,0.15)',
        gold: '#c9a96e',
        text: '#f0ebe3',
        'text-2': '#a9a2b8',
        'text-3': '#6b6580',
        border: '#2e2a3d',
        'border-2': '#3d3850',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      animation: {
        'hero-zoom': 'heroZoom 18s ease-out forwards',
        'fade-up': 'fadeUp 1.5s cubic-bezier(0.16,1,0.3,1) both',
        'scroll-pulse': 'scrollPulse 2.4s ease-in-out infinite',
        'marquee': 'marquee 32s linear infinite',
        'marquee-2': 'marquee 32s linear infinite -16s',
        'grain': 'grain 10s steps(2) infinite',
        'page-in': 'pageIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-right': 'slideRight 1.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        heroZoom: { from: { transform: 'scale(1.06)' }, to: { transform: 'scale(1)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(40px)' }, to: { opacity: '1', transform: 'none' } },
        scrollPulse: { '0%,100%': { opacity: '0.3' }, '50%': { opacity: '1' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        grain: { '0%,100%': { transform: 'translate(0,0)' }, '20%': { transform: 'translate(-1%,-2%)' }, '40%': { transform: 'translate(2%,-1%)' }, '60%': { transform: 'translate(-1%,2%)' }, '80%': { transform: 'translate(1%,0)' } },
        pageIn: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'none' } },
        slideRight: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        glowPulse: { '0%,100%': { opacity: '0.5', transform: 'scale(1)' }, '50%': { opacity: '0.8', transform: 'scale(1.05)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'xs': '2px',
      },
      maxWidth: {
        'content': '1440px',
      },
    },
  },
  plugins: [],
}

export default config
