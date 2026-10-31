export type Chain = {
  slug: string
  label: string
  pub: string
  viem: string
  /** Head lag treated as stale, in blocks. Roughly 6 seconds of chain time. */
  lagTol: number
}

export const CHAINS: Chain[] = [
  { slug: 'ethereum', label: 'Ethereum', pub: 'https://eth.drpc.org', viem: 'mainnet', lagTol: 2 },
  { slug: 'base', label: 'Base', pub: 'https://base.drpc.org', viem: 'base', lagTol: 3 },
  { slug: 'arbitrum', label: 'Arbitrum', pub: 'https://arbitrum.drpc.org', viem: 'arbitrum', lagTol: 24 },
  { slug: 'optimism', label: 'Optimism', pub: 'https://optimism.drpc.org', viem: 'optimism', lagTol: 3 },
  { slug: 'polygon', label: 'Polygon', pub: 'https://polygon.drpc.org', viem: 'polygon', lagTol: 3 },
  { slug: 'bsc', label: 'BSC', pub: 'https://bsc.drpc.org', viem: 'bsc', lagTol: 12 },
]
