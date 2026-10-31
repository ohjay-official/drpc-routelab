'use client'
import { useEffect, useState } from 'react'

/** Counts a real measured value up from zero once. Used for latencies, never for invented figures. */
export default function Count({ to, ms = 700, suffix = '' }: { to: number; ms?: number; suffix?: string }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, ms])
  return <>{Math.round(v)}{suffix}</>
}
