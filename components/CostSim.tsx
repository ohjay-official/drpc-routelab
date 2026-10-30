'use client'
import Link from 'next/link'
import { useState } from 'react'

const WORK = {
  read: { label: 'Standard read (eth_call)', alchemy: 13.65, quicknode: 12.4, ankr: 20, alchemyNote: '26 CU per call at $0.525 per 1M CU' },
  logs: { label: 'Heavy indexing (eth_getLogs)', alchemy: 31.5, quicknode: 12.4, ankr: 20, alchemyNote: '60 CU per call at $0.525 per 1M CU' },
  light: { label: 'Light read (eth_blockNumber)', alchemy: 5.25, quicknode: 12.4, ankr: 20, alchemyNote: '10 CU per call at $0.525 per 1M CU' },
} as const
type Key = keyof typeof WORK

const money = (n: number) =>
  Number.isInteger(n)
    ? `$${n.toLocaleString()}`
    : `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function CostSim() {
  const [vol, setVol] = useState(25)
  const [rps, setRps] = useState(200)
  const [wk, setWk] = useState<Key>('logs')
  const w = WORK[wk]

  const FREE_REQ = 210 / 20 // 210M CU at 20 CU per request = 10.5M requests
  const cu = vol * 20
  const freeOk = vol <= FREE_REQ && rps <= 100
  const growthOk = rps <= 5000
  const growth = vol * 6

  const comps = [
    { name: 'Alchemy', cost: vol * w.alchemy, note: `${money(w.alchemy)} per 1M requests (${w.alchemyNote})` },
    { name: 'QuickNode', cost: vol * w.quicknode, note: `${money(w.quicknode)} per 1M requests (overage rate at 20 credits per call, plan fees not modeled)` },
    { name: 'Ankr', cost: vol * w.ankr, note: `${money(w.ankr)} per 1M requests (EVM pay-as-you-go, 200 credits per call)` },
  ]
  const rows = [
    { name: 'dRPC Free', cost: 0, ok: freeOk, mine: true, note: freeOk ? 'Fits: 210M CU and 100 RPS, public nodes only' : vol > FREE_REQ ? `Over by ${(vol - FREE_REQ).toFixed(1)}M requests` : 'Peak RPS is above 100' },
    { name: 'dRPC Growth', cost: growth, ok: growthOk, mine: true, note: growthOk ? `${cu}M CU at a flat $6 per 1M requests, any method` : 'Above 5,000 RPS. This needs Enterprise.' },
    ...comps.map((c) => ({ ...c, ok: true, mine: false })),
  ]
  const max = Math.max(...rows.map((r) => r.cost), 1)
  const cheapest = comps.reduce((m, c) => (c.cost < m.cost ? c : m))
  const diff = cheapest.cost - growth

  let verdict: string
  if (freeOk) verdict = 'The dRPC Free tier covers this volume at $0. It uses public nodes only. Competitor free allowances are not modeled.'
  else if (!growthOk) verdict = 'Peak RPS is above the 5,000 RPS Growth limit, so the comparison below is for reference only.'
  else if (diff >= 0) verdict = `On this workload dRPC Growth costs ${money(diff)} less per month than the cheapest listed option (${cheapest.name}).`
  else verdict = `On this workload ${cheapest.name} costs ${money(-diff)} less per month than dRPC Growth.`

  return (
    <div className="mx-auto grid max-w-page grid-cols-1 gap-12 px-5 py-12 sm:px-8 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-4">
        <div className="space-y-7 lg:sticky lg:top-24">
          <fieldset>
            <legend className="label-mono">Workload</legend>
            <div className="mt-3 flex flex-col gap-2">
              {(Object.keys(WORK) as Key[]).map((k) => (
                <button key={k} type="button" className="toggle text-left" aria-pressed={wk === k} onClick={() => setWk(k)}>
                  {WORK[k].label}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="vol" className="label-mono">
              Monthly requests <span className="text-ink">{vol}M</span> = <span className="text-ink">{cu}M CU</span>
            </label>
            <input id="vol" type="range" min={1} max={500} value={vol} onChange={(e) => setVol(+e.target.value)} className="mt-2" />
          </div>
          <div>
            <label htmlFor="rps" className="label-mono">
              Peak RPS <span className="text-ink">{rps.toLocaleString()}</span>
            </label>
            <input id="rps" type="range" min={10} max={10000} step={10} value={rps} onChange={(e) => setRps(+e.target.value)} className="mt-2" />
          </div>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-8">
        <div className="mb-8 border-l-4 border-ink bg-card px-5 py-4">
          <p className="font-semibold">Result for {vol}M requests a month</p>
          <p className="mt-1 text-sm">{verdict}</p>
        </div>

        <ul className="border-t border-ink">
          {rows.map((r) => (
            <li key={r.name} className="border-b border-rule py-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className={r.mine ? 'font-semibold' : ''}>{r.name}</p>
                <p className={`font-mono text-sm tabular-nums ${r.ok ? '' : 'text-bad'}`}>{r.ok ? `${money(r.cost)}/mo` : 'Does not fit'}</p>
              </div>
              <div className="mt-3 h-2 bg-rule/60">
                <div className={`bar-grow h-2 ${r.mine ? 'bg-accent' : 'bg-ink'}`} style={{ width: `${(r.cost / max) * 100}%` }} />
              </div>
              <p className={`mt-2 text-xs ${r.ok ? 'text-mute' : 'text-bad'}`}>{r.note}</p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs leading-relaxed text-mute">
          Competitor rates are published figures as reported for October 2026, converted to cost per request for the workload you
          picked. Free allowances and subscription fees are not modeled. Confirm every rate on the vendor&rsquo;s own pricing page.
          The <Link href="/method" className="text-ink underline underline-offset-4 hover:text-accent">method page</Link> lists the basis for each rate.
        </p>
      </div>
    </div>
  )
}
