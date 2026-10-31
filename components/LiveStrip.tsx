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
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-[13px] font-medium text-gray-900">dRPC public nodes, from this browser</p>
        <button type="button" onClick={() => scan(true)} className="shrink-0 whitespace-nowrap pl-3 text-[13px] font-medium text-blue-500 hover:text-blue-600">
          Run again
        </button>
      </div>
      <ul className="border-t border-black/5">
        {CHAINS.map((c) => {
          const r = res[c.slug]
          const ms = r?.ms
          return (
            <li key={c.slug} className="grid grid-cols-[5.5rem_1fr_5.5rem] items-center gap-3 border-b border-black/5 px-5 py-3 last:border-b-0">
              <span className="text-[13px] text-gray-900">{c.label}</span>
              <span className="relative block h-1.5 rounded-full bg-gray-100">
                {typeof ms === 'number' && (
                  <span className="bar-grow absolute inset-y-0 left-0 rounded-full bg-gray-900" style={{ width: `${Math.min(100, (ms / max) * 100)}%` }} />
                )}
              </span>
              <span className={`text-right text-[12px] tabular-nums ${r && ms === null ? 'text-bad' : 'text-gray-700'}`} title={r && r.detail ? r.detail : undefined}>
                {r ? (ms === null ? r.err : `${Math.round(ms as number)} ms`) : '...'}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="border-t border-black/5 px-5 py-4 text-[12px] leading-relaxed text-gray-400">
        One call per endpoint, so each figure includes connection setup. The benchmark page takes six timed calls for p50 and p95.
      </p>
    </div>
  )
}
