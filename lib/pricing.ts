// Competitor rates are published list rates as reported for October 2026. Confirm on each vendor page.
export const ALCHEMY_PER_M_CU = 0.525

export const WORK = {
  read: { label: 'Standard read (eth_call)', alchemy: 26 * ALCHEMY_PER_M_CU, ankr: 20, alchemyNote: `26 CU per call at $${ALCHEMY_PER_M_CU} per 1M CU` },
  logs: { label: 'Heavy indexing (eth_getLogs)', alchemy: 60 * ALCHEMY_PER_M_CU, ankr: 20, alchemyNote: `60 CU per call at $${ALCHEMY_PER_M_CU} per 1M CU` },
  light: { label: 'Light read (eth_blockNumber)', alchemy: 10 * ALCHEMY_PER_M_CU, ankr: 20, alchemyNote: `10 CU per call at $${ALCHEMY_PER_M_CU} per 1M CU` },
} as const
export type WorkKey = keyof typeof WORK

export const CU_PER_REQUEST = 20

// QuickNode plans as listed on quicknode.com/pricing. Every call costs 20 credits on the six chains this tool covers.
export const QN_CREDITS_PER_CALL = 20
export type QnPlan = { name: string; fee: number; inclM: number; over: number; rps: number }
export const QN_PLANS: QnPlan[] = [
  { name: 'Build', fee: 49, inclM: 80, over: 0.62, rps: 50 },
  { name: 'Accelerate', fee: 249, inclM: 450, over: 0.56, rps: 125 },
  { name: 'Scale', fee: 499, inclM: 950, over: 0.53, rps: 250 },
  { name: 'Business', fee: 999, inclM: 2000, over: 0.5, rps: 500 },
]
export function qnBest(volM: number, rps: number) {
  const credits = volM * QN_CREDITS_PER_CALL
  const fits = QN_PLANS.filter((p) => rps <= p.rps).map((p) => ({ plan: p, cost: p.fee + Math.max(0, credits - p.inclM) * p.over }))
  return fits.length ? fits.reduce((m, c) => (c.cost < m.cost ? c : m)) : null
}

// dRPC plans as listed on drpc.org/pricing. Volumes in millions of requests per month.
// Overage is charged from the account balance at $6 per 1M multi-chain requests.
export type Plan = { id: string; name: string; fee: number; incl: number; over: number | null; rps: number }
export const DRPC_PLANS: Plan[] = [
  { id: 'free', name: 'dRPC Free', fee: 0, incl: 10.5, over: null, rps: 100 },
  { id: 'payg', name: 'dRPC Pay as You Go', fee: 0, incl: 0, over: 6, rps: 100 },
  { id: 'pro', name: 'dRPC Pro', fee: 49, incl: 10, over: 6, rps: 300 },
  { id: 'scale', name: 'dRPC Scale', fee: 199, incl: 47, over: 6, rps: 600 },
]
export const ENTERPRISE_FROM = 990
export const MAX_PLAN_RPS = 600

export function planFits(p: Plan, vol: number, rps: number) {
  if (rps > p.rps) return false
  if (p.over === null && vol > p.incl) return false
  return true
}
export function planCost(p: Plan, vol: number) {
  return p.fee + Math.max(0, vol - p.incl) * (p.over ?? 0)
}

export const money = (n: number) => {
  const v = Math.round(n * 100) / 100
  return Number.isInteger(v)
    ? `$${v.toLocaleString()}`
    : `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
