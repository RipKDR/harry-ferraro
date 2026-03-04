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
        bg: '#15131c',
        'bg-2': '#1c1a24',
        surface: '#22202c',
        'surface-2': '#2b2836',
        ember: '#c8570a',
        'ember-2': '#e06a18',
        'ember-3': '#7a3408',
        text: '#f2ede5',
        'text-2': '#b0a9bc',
        'text-3': '#7c768a',
        border: '#38354a',
        'border-2': '#48455a',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
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
