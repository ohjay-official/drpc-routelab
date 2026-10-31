import DrpcMark from './DrpcMark'
import { DRPC_PLANS, WORK, money, planCost, qnBest } from '@/lib/pricing'

// A worked example, computed from the same rates the simulator uses. Not a measurement.
const VOL = 25
const RPS = 100
const w = WORK.read
const qn = qnBest(VOL, RPS)!
const pro = DRPC_PLANS.find((p) => p.id === 'pro')!
const ROWS = [
  { name: 'dRPC Pro', cost: planCost(pro, VOL), mine: true },
  { name: `QuickNode ${qn.plan.name}`, cost: qn.cost, mine: false },
  { name: 'Ankr', cost: VOL * w.ankr, mine: false },
  { name: 'Alchemy', cost: VOL * w.alchemy, mine: false },
]

export default function CostPreview() {
  const max = Math.max(...ROWS.map((r) => r.cost))
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-[13px] font-medium text-gray-900">Example: {VOL}M eth_call requests a month, up to {RPS} RPS</p>
        <p className="mt-0.5 text-[12px] text-gray-400">Worked from list rates with dRPC Pro, not a live quote</p>
      </div>
      <ul className="border-t border-black/5">
        {ROWS.map((r) => (
          <li key={r.name} className="border-b border-black/5 px-5 py-4 last:border-b-0">
            <div className="flex items-baseline justify-between">
              <span className={`flex items-center gap-2 text-[13px] ${r.mine ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{r.mine && <DrpcMark size={13} />}{r.name}</span>
              <span className="text-[13px] tabular-nums text-gray-900">{money(r.cost)}/mo</span>
            </div>
            <div className="mt-2.5 h-1.5 rounded-full bg-gray-100">
              <div className={`h-1.5 rounded-full ${r.mine ? 'bg-drpc' : 'bg-gray-900'}`} style={{ width: `${(r.cost / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
