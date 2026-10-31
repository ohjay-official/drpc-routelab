'use client'
import Link from 'next/link'
import { useState } from 'react'
import { CU_PER_REQUEST, DRPC_PLANS, ENTERPRISE_FROM, MAX_PLAN_RPS, WORK, money, planCost, planFits, type WorkKey } from '@/lib/pricing'

export default function CostSim() {
  const [vol, setVol] = useState(25)
  const [rps, setRps] = useState(200)
  const [wk, setWk] = useState<WorkKey>('logs')
  const w = WORK[wk]

  const cu = vol * CU_PER_REQUEST
  const enterprise = rps > MAX_PLAN_RPS

  const comps = [
    { name: 'Alchemy', cost: vol * w.alchemy, note: `${money(w.alchemy)} per 1M requests (${w.alchemyNote})` },
    { name: 'QuickNode', cost: vol * w.quicknode, note: `${money(w.quicknode)} per 1M requests (overage rate at 20 credits per call, plan fees not modeled)` },
    { name: 'Ankr', cost: vol * w.ankr, note: `${money(w.ankr)} per 1M requests (EVM pay-as-you-go, 200 credits per call)` },
  ]

  const plans = DRPC_PLANS.map((p) => {
    const ok = planFits(p, vol, rps)
    const cost = planCost(p, vol)
    let note: string
    if (!ok) note = rps > p.rps ? `Peak RPS is above the ${p.rps} RPS limit` : `Over by ${(vol - p.incl).toFixed(1)}M requests`
    else if (p.id === 'free') note = 'Fits: 210M CU and 100 RPS, public nodes only'
    else if (p.id === 'payg') note = `${vol}M requests at $6 per 1M, no commitment, ${p.rps} RPS limit`
    else note = `${money(p.fee)} a month with ${p.incl}M requests included, then $6 per 1M, ${p.rps} RPS limit`
    return { name: p.name, id: p.id, cost, ok, mine: true, note, from: false }
  })
  const rows = [
    ...plans,
    ...(enterprise
      ? [{ name: 'dRPC Enterprise', id: 'ent', cost: ENTERPRISE_FROM, ok: true, mine: true, from: true, note: 'Starting price, unlimited RPS. Needs a quote from sales.' }]
      : []),
    ...comps.map((c) => ({ ...c, id: c.name, ok: true, mine: false, from: false })),
  ]
  const max = Math.max(...rows.filter((r) => r.ok).map((r) => r.cost), 1)
  const cheapest = comps.reduce((m, c) => (c.cost < m.cost ? c : m))
  const fitting = plans.filter((p) => p.ok)
  const best = fitting.length ? fitting.reduce((m, p) => (p.cost < m.cost ? p : m)) : null

  let verdict: string
  if (best && best.id === 'free') verdict = 'The dRPC Free plan covers this volume at $0. It uses public nodes only. Competitor free allowances are not modeled.'
  else if (enterprise) verdict = `Peak RPS is above the ${MAX_PLAN_RPS} RPS limit of Scale, so dRPC Enterprise (from ${money(ENTERPRISE_FROM)} a month, quoted by sales) is the fit. Competitor figures are shown for reference.`
  else if (best) {
    const diff = cheapest.cost - best.cost
    verdict =
      diff >= 0
        ? `The cheapest dRPC plan that fits is ${best.name} at ${money(best.cost)} a month. That is ${money(diff)} less than the cheapest listed option (${cheapest.name}).`
        : `The cheapest dRPC plan that fits is ${best.name} at ${money(best.cost)} a month. ${cheapest.name} costs ${money(-diff)} less on this workload.`
  } else verdict = 'No listed dRPC plan fits this volume and peak RPS.'

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
            <input id="rps" type="range" min={10} max={1000} step={10} value={rps} onChange={(e) => setRps(+e.target.value)} className="mt-2" />
            <p className="mt-2 text-[12px] text-gray-400">Free and Pay as You Go allow 100 RPS, Pro 300, Scale 600.</p>
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
            <li key={r.id} className="p-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className={`text-[14px] ${r.mine ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{r.name}</p>
                <p className={`text-[13px] tabular-nums ${r.ok ? 'text-gray-900' : 'text-bad'}`}>{r.ok ? `${r.from ? 'from ' : ''}${money(r.cost)}/mo` : 'Does not fit'}</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-gray-100">
                <div className={`bar-grow h-2 rounded-full ${r.mine ? 'bg-blue-500' : 'bg-gray-900'}`} style={{ width: `${r.ok ? (r.cost / max) * 100 : 0}%` }} />
              </div>
              <p className={`mt-2 text-[12px] ${r.ok ? 'text-gray-400' : 'text-bad'}`}>{r.note}</p>
            </li>
          ))}
        </ul>

        <p className="mt-5 px-1 text-[12px] leading-relaxed text-gray-400">
          Competitor rates are published figures as reported for October 2026, converted to cost per request for the workload you
          picked. Competitor free allowances and subscription fees are not modeled. Confirm every rate on the vendor&rsquo;s own pricing page. The{' '}
          <Link href="/method" className="text-blue-500 underline underline-offset-4 hover:text-blue-600">method page</Link> lists the basis for each rate.
        </p>
      </div>
    </div>
  )
}
