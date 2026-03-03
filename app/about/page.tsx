import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { Marquee } from '@/components/Marquee'

export const metadata: Metadata = {
  title: 'About',
  description: 'Harry Ferraro is a Melbourne-based figurative oil painter. Fine art with emotional intensity and technical precision.',
}

export default function AboutPage() {
  return (
    <div className="page-enter pt-[80px]">

      {/* Hero */}
      <div className="relative h-[72vh] overflow-hidden flex items-end">
        <Image
          src="/paintings/ascendant.jpg"
          alt="Harry Ferraro studio"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 22%', filter: 'brightness(0.24) contrast(1.3) saturate(0.65)' }}
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #07060a 0%, rgba(7,6,10,0.4) 55%, transparent 100%)' }}
        />
        <div className="relative z-[2] px-[52px] pb-[72px] max-md:px-6 max-md:pb-[52px]">
          <h1
            className="font-light italic leading-[0.88] tracking-[-0.02em]"
            style={{ fontFamily: "'Cormorant Garant', Georgia, serif", fontSize: 'clamp(48px,9vw,108px)' }}
          >
            The work<br />& the why
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-24 px-[52px] py-24 max-md:grid-cols-1 max-md:gap-12 max-md:px-6">
        {/* Statement */}
        <Reveal>
          <blockquote
            className="font-light leading-[1.7]"
            style={{ fontFamily: "'Cormorant Garant', Georgia, serif", fontSize: 'clamp(20px,2.5vw,24px)' }}
          >
            "Painting is the only language I speak fluently. Everything else is translation."
          </blockquote>
          <div className="mt-12 flex gap-3 flex-wrap">
            <Link href="/gallery" className="btn-ember">View Gallery</Link>
            <Link href="/commissions" className="btn-ghost">Commission a Work</Link>
          </div>
        </Reveal>

        {/* Bio */}
        <Reveal delay={0.2}>
          <div
            className="text-[14px] text-text-2 leading-[1.95] space-y-6"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <p>
              My practice centres on the emotional and physical truth of the female form. Not beauty as aesthetics, but as power. The power to feel, to burn, to dissolve and reform.
            </p>
            <p>
              Working primarily in oils with forays into mixed media, I am drawn to the tension between hyper-real detail and expressive abstraction. A face rendered with surgical precision, surrounded by the controlled chaos of a palette knife.
            </p>
            <p>
              The recurring motifs across my work — fire, wind, dissolution — are not symbols. They are states of being I return to because they are honest. We are all at various points burning, windswept, or coming apart at the edges.
            </p>
            <p>
              Each painting begins as a question I cannot answer in words. If I could explain it, I would not need to paint it.
            </p>
            <p className="text-[12px] text-text-3 pt-4 border-t border-[#1e1c24] tracking-[0.05em]">
              Available for exhibitions, print licensing, and private commissions.<br />
              Based in Melbourne, AU.
            </p>
          </div>
        </Reveal>
      </div>

      <Marquee />

      <Footer />
    </div>
  )
}
