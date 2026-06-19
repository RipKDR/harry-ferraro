export function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[8990]"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse 120% 80% at 50% 0%, transparent 42%, rgba(0,0,0,0.45) 100%), radial-gradient(ellipse 90% 60% at 50% 100%, rgba(0,0,0,0.55), transparent 55%)',
      }}
    />
  )
}