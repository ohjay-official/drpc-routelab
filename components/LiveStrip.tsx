'use client'
import { useEffect } from 'react'
import { CHAINS } from '@/lib/chains'
import { scan } from '@/lib/rpc'
import { useScan } from '@/lib/useScan'

export default function LiveStrip() {
  const res = useScan()

  useEffect(() => {
    scan()
  }, [])

  const vals = CHAINS.map((c) => res[c.slug]?.ms).filter((v): v is number => typeof v === 'number')
  const max = Math.max(300, ...vals)

  return (
    <div className="border border-ink bg-card">
      <div className="flex items-center justify-between border-b border-ink px-4 py-3">
        <p className="font-mono text-xs">dRPC public nodes, from this browser</p>
        <button
          type="button"
          onClick={() => scan(true)}
          className="shrink-0 whitespace-nowrap pl-3 font-mono text-xs underline underline-offset-4 hover:text-accent"
        >
          Run again
        </button>
      </div>
      <ul>
        {CHAINS.map((c) => {
          const r = res[c.slug]
          const ms = r?.ms
          return (
            <li
              key={c.slug}
              className="grid grid-cols-[5.5rem_1fr_5.5rem] items-center gap-3 border-b border-rule px-4 py-3 last:border-b-0"
            >
              <span className="text-sm">{c.label}</span>
              <span className="relative block h-2 bg-rule/60">
                {typeof ms === 'number' && (
                  <span
                    className="bar-grow absolute inset-y-0 left-0 bg-ink"
                    style={{ width: `${Math.min(100, (ms / max) * 100)}%` }}
                  />
                )}
              </span>
              <span className={`text-right font-mono text-xs tabular-nums ${r && ms === null ? 'text-bad' : ''}`}>
                {r ? (ms === null ? r.err : `${Math.round(ms as number)} ms`) : '...'}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="border-t border-ink px-4 py-3 text-xs leading-relaxed text-mute">
        One call per endpoint, so each figure includes connection setup. The benchmark page takes six timed calls for p50 and p95.
      </p>
    </div>
  )
}
