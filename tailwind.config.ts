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
        bg: '#080706',
        'bg-2': '#100d0a',
        surface: '#15120f',
        'surface-2': '#211a15',
        oxide: '#b65d2c',
        'oxide-2': '#d1844a',
        text: '#f0e7dc',
        'text-2': '#b7aa9b',
        'text-3': '#8f8375',
        border: '#3a342d',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'soft': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      animation: {
        'page-in': 'pageIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'marquee': 'marquee 32s linear infinite',
      },
      keyframes: {
        pageIn: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'none' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-33.333%)' } },
      },
    },
  },
  plugins: [],
}

export default config
