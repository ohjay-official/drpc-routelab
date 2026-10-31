export const WORK = {
  read: { label: 'Standard read (eth_call)', alchemy: 13.65, quicknode: 12.4, ankr: 20, alchemyNote: '26 CU per call at $0.525 per 1M CU' },
  logs: { label: 'Heavy indexing (eth_getLogs)', alchemy: 31.5, quicknode: 12.4, ankr: 20, alchemyNote: '60 CU per call at $0.525 per 1M CU' },
  light: { label: 'Light read (eth_blockNumber)', alchemy: 5.25, quicknode: 12.4, ankr: 20, alchemyNote: '10 CU per call at $0.525 per 1M CU' },
} as const
export type WorkKey = keyof typeof WORK

export const CU_PER_REQUEST = 20
export const FREE_CU = 210 // millions per 30 days
export const FREE_REQ = FREE_CU / CU_PER_REQUEST // 10.5M requests
export const GROWTH_PER_M = 6

export const money = (n: number) =>
  Number.isInteger(n)
    ? `$${n.toLocaleString()}`
    : `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
