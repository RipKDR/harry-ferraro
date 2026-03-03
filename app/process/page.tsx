import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { Marquee } from '@/components/Marquee'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'

export const metadata: Metadata = {
  title: 'Process',
  description: 'Inside the studio. How Harry Ferraro makes his paintings — from concept through resolution.',
}

const STEPS = [
  { n: '01', title: 'Concept & Composition', body: "Every painting begins with a question I cannot answer in words. The first stage is sitting with the feeling — not rushing to resolve it. I make small studies, sometimes just 10 minutes each, until something arrives that I did not expect. The arrival is the signal to start." },
  { n: '02', title: 'Underpainting', body: "I work on dark grounds. Black gesso first, then a tonal underpainting in raw umber or sienna. This layer sets the emotional key of the entire work — it is impossible to change later, so I take it slowly. The face appears in this stage, already looking back." },
  { n: '03', title: 'Building the Light', body: "Light in these paintings is not illumination. It is information. I build it in thin layers, each one drying before the next, until the face or figure seems to generate its own warmth. The fire paintings glow from inside. That takes weeks to achieve." },
  { n: '04', title: 'The Expressive Layer', body: "This is where the palette knife enters. The controlled, detailed work is interrupted by gesture — large sweeping marks that contradict the precision beneath. This tension is the work. Without it, the painting is merely technical. With it, it becomes a confrontation." },
  { n: '05', title: 'Resolution', body: "I know a painting is finished when I stop wanting to change it. That can take days or months after I put down the brush. Sometimes I return to a dry canvas and add one mark. Sometimes I do nothing. The work tells you. You learn to listen." },
]

export default function ProcessPage() {
  return (
    <div className="page-enter pt-[80px]">

      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden flex items-end" aria-label="Process — studio practice">
        <Image
          src="/paintings/tempest.jpg"
          alt="Tempest by Harry Ferraro — studio detail"
          fill priority className="object-cover"
          style={{ objectPosition: 'center 30%', filter: 'brightness(0.2) contrast(1.35) saturate(0.6)' }}
          sizes="100vw"
          placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS['tempest']}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #07060a 0%, transparent 65%)' }} aria-hidden />
        <div className="relative z-[2] px-[52px] pb-16 max-md:px-6 max-md:pb-12">
          <h1 className="font-serif font-light italic leading-[0.9]" style={{ fontSize: 'clamp(44px,8vw,96px)' }}>
            The making<br />of it
          </h1>
        </div>
      </div>

      {/* Images strip */}
      <div className="grid grid-cols-3 gap-[5px] px-[52px] my-[5px] max-md:px-5 max-sm:grid-cols-1" aria-hidden="true">
        {[
          { src: 'ignition-i', alt: 'Ignition I detail' },
          { src: 'dissolution', alt: 'Dissolution detail' },
          { src: 'radiance', alt: 'Radiance detail' },
        ].map(({ src, alt }) => (
          <div key={src} className="overflow-hidden" style={{ background: '#131118' }}>
            <Image
              src={`/paintings/${src}.jpg`} alt={alt}
              width={600} height={450} className="w-full"
              style={{ aspectRatio: '4/3', objectFit: 'cover', filter: 'brightness(0.82) saturate(0.85)' }}
              placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[src]}
            />
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="px-[52px] pt-20 pb-[160px] max-md:px-6">
        <Reveal className="mb-16">
          <div className="eyebrow mb-4">Studio Practice</div>
          <p className="font-serif font-light leading-[1.6] text-text-2 max-w-[640px]" style={{ fontSize: 'clamp(20px,3vw,32px)' }}>
            I work alone, in one large room, with oil paint and mixed media. There is no process document, only the accumulated sediment of thousands of hours at the same problem.
          </p>
        </Reveal>

        <div role="list" aria-label="Studio steps">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08} className="process-step" as="div">
              <div className="process-num" aria-hidden="true">{step.n}</div>
              <div>
                <h2 className="font-serif font-light text-[32px] mb-4">{step.title}</h2>
                <p className="font-mono text-[14px] text-text-2 leading-[1.9] max-w-[600px]">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section
        className="px-[52px] py-[100px] border-t border-[#1e1c24] flex justify-between items-center flex-wrap gap-8 max-md:px-6"
        aria-label="Commission"
      >
        <Reveal>
          <div className="eyebrow mb-4">Commission</div>
          <h2 className="font-serif font-light leading-[1.1]" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
            Bring me your question.<br />
            <em className="italic text-text-2">I will paint the answer.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <Link href="/commissions" className="btn-ember flex-shrink-0">Start a Commission</Link>
        </Reveal>
      </section>

      <Marquee />
      <Footer />
    </div>
  )
}
