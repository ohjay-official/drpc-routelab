'use client'
import { useEffect, useRef, useState } from 'react'
import { delay } from '@/lib/ui'

/** Fades a block in once, the first time it scrolls into view. Small movement on purpose. */
export default function Reveal({
  children,
  d = 0,
  className = '',
}: {
  children: React.ReactNode
  d?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={delay(`${d}s`)}>
      {children}
    </div>
  )
}
