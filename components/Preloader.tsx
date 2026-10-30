'use client'
import { useEffect, useState } from 'react'
import { CHAINS } from '@/lib/chains'
import { scan } from '@/lib/rpc'
import { useScan } from '@/lib/useScan'

export default function Preloader() {
  const res = useScan()
  const [phase, setPhase] = useState<'on' | 'out' | 'gone'>('on')

  useEffect(() => {
    const root = document.documentElement
    let seen = false
    try {
      seen = sessionStorage.getItem('rl-seen') === '1'
    } catch {}
    if (seen) {
      root.dataset.ready = '1'
      setPhase('gone')
      scan()
      return
    }
    let alive = true
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
    const finish = () => {
      if (!alive) return
      try {
        sessionStorage.setItem('rl-seen', '1')
      } catch {}
      root.dataset.ready = '1'
      setPhase('out')
      setTimeout(() => {
        if (alive) setPhase('gone')
      }, 750)
    }
    // Wait for the real pings, but never less than 1.2s (so it reads) and never more than 4.5s.
    Promise.race([Promise.all([scan(), wait(1200)]), wait(4500)]).then(finish)
    return () => {
      alive = false
    }
  }, [])

  if (phase === 'gone') return null

  const done = CHAINS.filter((c) => res[c.slug]).length
  const total = CHAINS.length

  return (
    <div
      className={`preloader fixed inset-0 z-50 flex flex-col justify-between bg-paper p-5 sm:p-10 ${phase === 'out' ? 'preloader-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading RouteLab"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-semibold tracking-tight">RouteLab</span>
        <span className="font-mono text-xs text-mute">Pinging dRPC public nodes</span>
      </div>

      <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <ul className="font-mono text-xs sm:w-96 sm:text-sm">
          {CHAINS.map((c) => {
            const r = res[c.slug]
            return (
              <li key={c.slug} className="flex justify-between border-t border-rule py-2">
                <span>{c.label}</span>
                <span className={r ? (r.ms === null ? 'text-bad' : 'text-ink') : 'text-mute'}>
                  {r ? (r.ms === null ? r.err : `${Math.round(r.ms)} ms`) : '...'}
                </span>
              </li>
            )
          })}
        </ul>
        <div className="font-mono text-7xl leading-none tabular-nums sm:text-9xl">
          {String(done).padStart(2, '0')}
          <span className="text-mute">/{String(total).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="h-px bg-rule">
        <div className="bar-grow h-px bg-ink" style={{ width: `${(done / total) * 100}%` }} />
      </div>
    </div>
  )
}
