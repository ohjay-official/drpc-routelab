'use client'
import Link from 'next/link'
import { useState } from 'react'
import { FREE_REQ, GROWTH_PER_M, CU_PER_REQUEST, WORK, money, type WorkKey } from '@/lib/pricing'

export default function CostSim() {
  const [vol, setVol] = useState(25)
  const [rps, setRps] = useState(200)
  const [wk, setWk] = useState<WorkKey>('logs')
  const w = WORK[wk]

  const cu = vol * CU_PER_REQUEST
  const freeOk = vol <= FREE_REQ && rps <= 100
  const growthOk = rps <= 5000
  const growth = vol * GROWTH_PER_M

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

  const lbl = 'text-[13px] font-medium text-gray-900'

  return (
    <div className="mx-auto grid max-w-page grid-cols-1 gap-8 px-5 py-6 sm:px-8 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-4">
        <div className="card space-y-6 p-5 lg:sticky lg:top-24">
          <fieldset>
            <legend className={lbl}>Workload</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(WORK) as WorkKey[]).map((k) => (
                <button key={k} type="button" className="toggle" aria-pressed={wk === k} onClick={() => setWk(k)}>
                  {WORK[k].label}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="vol" className={lbl}>
              Monthly requests <span className="font-normal text-gray-500">{vol}M = {cu}M CU</span>
            </label>
            <input id="vol" type="range" min={1} max={500} value={vol} onChange={(e) => setVol(+e.target.value)} className="mt-2" />
          </div>
          <div>
            <label htmlFor="rps" className={lbl}>
              Peak RPS <span className="font-normal text-gray-500">{rps.toLocaleString()}</span>
            </label>
            <input id="rps" type="range" min={10} max={10000} step={10} value={rps} onChange={(e) => setRps(+e.target.value)} className="mt-2" />
          </div>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-8">
        <div className="card mb-5 p-5">
          <p className="text-[14px] font-medium text-gray-900">Result for {vol}M requests a month</p>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{verdict}</p>
        </div>

        <ul className="card divide-y divide-black/5">
          {rows.map((r) => (
            <li key={r.name} className="p-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className={`text-[14px] ${r.mine ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{r.name}</p>
                <p className={`text-[13px] tabular-nums ${r.ok ? 'text-gray-900' : 'text-bad'}`}>{r.ok ? `${money(r.cost)}/mo` : 'Does not fit'}</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-gray-100">
                <div className={`bar-grow h-2 rounded-full ${r.mine ? 'bg-blue-500' : 'bg-gray-900'}`} style={{ width: `${(r.cost / max) * 100}%` }} />
              </div>
              <p className={`mt-2 text-[12px] ${r.ok ? 'text-gray-400' : 'text-bad'}`}>{r.note}</p>
            </li>
          ))}
        </ul>

        <p className="mt-5 px-1 text-[12px] leading-relaxed text-gray-400">
          Competitor rates are published figures as reported for October 2026, converted to cost per request for the workload you
          picked. Free allowances and subscription fees are not modeled. Confirm every rate on the vendor&rsquo;s own pricing page. The{' '}
          <Link href="/method" className="text-blue-500 underline underline-offset-4 hover:text-blue-600">method page</Link> lists the basis for each rate.
        </p>
      </div>
    </div>
  )
}
