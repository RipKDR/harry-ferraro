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
        bg: '#0b0a09',
        'bg-2': '#141210',
        surface: '#1c1916',
        'surface-2': '#221e1a',
        ember: '#b8714c',
        'ember-2': '#c9885f',
        'ember-3': '#6e4631',
        text: '#ede8e1',
        'text-2': '#a8a099',
        'text-3': '#6e665f',
        border: '#2a2622',
        'border-2': '#353029',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jetbrains)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
      },
    },
  },
  plugins: [],
}

export default config
