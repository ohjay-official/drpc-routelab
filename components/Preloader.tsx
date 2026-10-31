'use client'
import { useEffect, useState } from 'react'
import { CHAINS } from '@/lib/chains'
import { scan } from '@/lib/rpc'
import { useScan } from '@/lib/useScan'
import Count from './Count'
import DrpcMark from './DrpcMark'

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
      className={`preloader fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f0ee] px-6 ${phase === 'out' ? 'preloader-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading RouteLab"
    >
      <DrpcMark size={72} tile build />
      <p className="mt-5 text-[13px] text-gray-500">Pinging dRPC public nodes</p>
      <ul className="mt-6 w-full max-w-xs text-[13px]">
        {CHAINS.map((c) => {
          const r = res[c.slug]
          return (
            <li key={c.slug} className="flex justify-between border-b border-black/5 py-2 last:border-b-0">
              <span className="text-gray-900">{c.label}</span>
              {r ? (
                <span className={`row-in tabular-nums ${r.ms === null ? 'text-bad' : 'text-gray-900'}`}>
                  {r.ms === null ? r.err : (<><Count to={r.ms} /> ms</>)}
                </span>
              ) : (
                <span className="tabular-nums text-gray-400">...</span>
              )}
            </li>
          )
        })}
      </ul>
      <div className="mt-6 h-1 w-full max-w-xs overflow-hidden rounded-full bg-black/10">
        <div className="bar-grow h-1 rounded-full bg-drpc" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <p className="mt-3 text-[12px] tabular-nums text-gray-400">
        {done} of {total}
      </p>
      <p className="mt-10 text-[12px] text-gray-400">RouteLab, an independent tool. Not affiliated with dRPC.</p>
    </div>
  )
}
