# Harry Ferraro Studio — UI/UX Overhaul Design Spec

## Design Philosophy
Dark, moody, cinematic art portfolio. The overhaul deepens the existing foundation with more depth, richer motion, and stricter cohesion.

## Color System (Enhanced)
| Token | Value | Usage |
|-------|-------|-------|
| bg | #0f0d16 | Deepest background |
| bg-2 | #16131f | Secondary background |
| surface | #1e1b28 | Cards, panels |
| surface-2 | #282533 | Elevated surfaces |
| surface-glass | rgba(30,27,40,0.72) | Glassmorphism backdrop |
| border | #2e2a3d | Subtle borders |
| border-2 | #3d3850 | Active borders |
| text | #f0ebe3 | Primary text |
| text-2 | #a9a2b8 | Secondary text |
| text-3 | #6b6580 | Tertiary / disabled |
| ember | #d45a0e | Primary accent (slightly warmer) |
| ember-2 | #e8721f | Hover accent |
| ember-3 | #8a3d0a | Dark accent |
| ember-glow | rgba(212,90,14,0.15) | Ambient glow |
| gold | #c9a96e | Secondary accent |

## Typography Scale
- display-xl: clamp(72px, 12vw, 160px) / 0.85 / 300 / -0.04em
- display-lg: clamp(48px, 8vw, 108px) / 0.88 / 300 / -0.03em
- display-md: clamp(36px, 5vw, 72px) / 0.95 / 300 / -0.02em
- heading-lg: clamp(32px, 4vw, 60px) / 1.05 / 300 / -0.01em
- heading-md: clamp(28px, 3.5vw, 48px) / 1.1 / 300 / -0.01em
- heading-sm: clamp(22px, 2.5vw, 32px) / 1.2 / 400 / 0
- body-lg: 18px / 1.75 / 300 / 0.01em
- body: 14px / 1.85 / 300 / 0.02em
- body-sm: 12px / 1.7 / 300 / 0.04em
- caption: 10px / 1.5 / 400 / 0.16em
- micro: 9px / 1.4 / 400 / 0.2em

Fonts: Cormorant Garamond (display) + JetBrains Mono (utility)

## Spacing Scale
space-1: 4px, space-2: 8px, space-3: 12px, space-4: 16px, space-5: 20px, space-6: 24px, space-8: 32px, space-10: 40px, space-12: 48px, space-16: 64px, space-20: 80px, space-24: 96px, space-32: 128px, space-40: 160px

Page padding: clamp(24px, 4vw, 64px)

## Animation (Framer Motion)
- ease-out-expo: [0.16, 1, 0.3, 1]
- ease-in-out: [0.25, 0.46, 0.45, 0.94]
- ease-out-quart: [0.25, 1, 0.5, 1]
- ease-spring: { type: "spring", stiffness: 100, damping: 15 }
- Reveal: fadeUp, fadeIn, scaleIn, clipReveal, slideLeft
- Stagger: container staggerChildren: 0.08, child duration: 0.7
- Page transition: exit {opacity:0,y:-12,duration:0.3}, enter {opacity:1,y:0,duration:0.5,ease:easeOutExpo}

## New Components
1. MotionReveal — Framer Motion scroll reveal (replaces CSS Reveal)
2. TextReveal — Word-by-word text animation
3. StaggerContainer — Wrapper for staggered children
4. AmbientGlow — Decorative glow orb
5. ScrollProgress — Thin scroll progress bar
6. ParallaxWrapper — Scroll-driven parallax
7. MagneticButton — Hover magnetic effect
8. PageTransition — AnimatePresence wrapper for routes

## Responsive Breakpoints
- xs: < 480px (mobile)
- sm: 480-768px (tablet small)
- md: 768-1024px (tablet large)
- lg: 1024-1440px (desktop)
- xl: > 1440px (wide)

## Key Improvements Per Page
- Home: parallax hero, word-by-word text reveal, ambient glow, staggered sections
- Gallery: animated filter tabs, layout animation on filter, enhanced card hover
- Artwork Detail: sticky image parallax, staggered info panel, enhanced lightbox
- Series: hover zoom cards, staggered grid entrance
- Process: timeline border reveal, parallax image strip
- About: parallax hero, staggered bio paragraphs
- Commissions/Contact: enhanced form focus states, shake on error, success animation
- All: glassmorphism nav on scroll, scroll progress indicator, page transitions
