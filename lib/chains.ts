export type Chain = {
  slug: string
  label: string
  pub: string
  viem: string | null
  sol: boolean
  /** Head lag treated as stale, in blocks (slots on Solana). Roughly 6 seconds of chain time. */
  lagTol: number
  unit: 'blocks' | 'slots'
}

export const CHAINS: Chain[] = [
  { slug: 'ethereum', label: 'Ethereum', pub: 'https://eth.drpc.org', viem: 'mainnet', sol: false, lagTol: 2, unit: 'blocks' },
  { slug: 'base', label: 'Base', pub: 'https://base.drpc.org', viem: 'base', sol: false, lagTol: 3, unit: 'blocks' },
  { slug: 'arbitrum', label: 'Arbitrum', pub: 'https://arbitrum.drpc.org', viem: 'arbitrum', sol: false, lagTol: 24, unit: 'blocks' },
  { slug: 'optimism', label: 'Optimism', pub: 'https://optimism.drpc.org', viem: 'optimism', sol: false, lagTol: 3, unit: 'blocks' },
  { slug: 'polygon', label: 'Polygon', pub: 'https://polygon.drpc.org', viem: 'polygon', sol: false, lagTol: 3, unit: 'blocks' },
  { slug: 'bsc', label: 'BSC', pub: 'https://bsc.drpc.org', viem: 'bsc', sol: false, lagTol: 12, unit: 'blocks' },
  { slug: 'solana', label: 'Solana', pub: 'https://solana.drpc.org', viem: null, sol: true, lagTol: 15, unit: 'slots' },
]
