import { CHAINS } from './chains'

export const SAMPLES = 6
export const TIMEOUT_MS = 4000

export type PingResult = { ms: number | null; block: number | null; err: string | null }
export type Stat = { p50: number | null; p95: number | null; block: number | null; fails: number; err: string | null }

/** One JSON-RPC call. Failures are classified instead of collapsed into a generic error. */
export async function ping(url: string, sol = false): Promise<PingResult> {
  const t = performance.now()
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS)
  const fail = (err: string): PingResult => ({ ms: null, block: null, err })
  try {
    const r = await fetch(url, {
      method: 'POST',
      signal: ctl.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: sol ? 'getSlot' : 'eth_blockNumber', params: [] }),
    })
    if (r.status === 429) return fail('rate-limited')
    if (!r.ok) return fail('http-' + r.status)
    let j: any
    try {
      j = await r.json()
    } catch {
      return fail('bad-response')
    }
    if (!j || j.error || j.result === undefined || j.result === null) return fail('rpc-error')
    const block = sol ? Number(j.result) : parseInt(j.result, 16)
    if (!Number.isFinite(block)) return fail('rpc-error')
    return { ms: performance.now() - t, block, err: null }
  } catch (e: any) {
    return fail(e && e.name === 'AbortError' ? 'timeout' : 'network/cors')
  } finally {
    clearTimeout(timer)
  }
}

/** Nearest-rank percentile on a sorted array. */
export function pct(sorted: number[], p: number) {
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)]
}

/** One untimed warm-up call (DNS and TLS), then SAMPLES timed calls in sequence. */
export async function bench(url: string, sol = false): Promise<Stat> {
  const warm = await ping(url, sol)
  const ms: number[] = []
  let block: number | null = null
  let fails = 0
  let err: string | null = null
  let streak = warm.ms === null ? 1 : 0
  for (let i = 0; i < SAMPLES; i++) {
    // Two failures in a row means the endpoint is down. Stop instead of waiting out six more timeouts.
    if (streak >= 2) {
      fails += SAMPLES - i
      break
    }
    const r = await ping(url, sol)
    if (r.ms === null) {
      fails++
      streak++
      err = r.err
    } else {
      streak = 0
      ms.push(r.ms)
      block = r.block
    }
  }
  if (fails > 0 && err === null) err = warm.err
  ms.sort((a, b) => a - b)
  return { p50: ms.length ? pct(ms, 50) : null, p95: ms.length ? pct(ms, 95) : null, block, fails, err }
}

/* A tiny shared store for the quick scan, used by the preloader and the home page. */
export type Quick = Record<string, PingResult>
export const EMPTY: Quick = {}

type Listener = () => void
const listeners = new Set<Listener>()
let results: Quick = EMPTY
let running: Promise<void> | null = null

const notify = () => listeners.forEach((l) => l())

export function getResults() {
  return results
}

export function subscribe(fn: Listener) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** One call per public endpoint, in parallel. Repeated calls share the running scan unless forced. */
export function scan(force = false): Promise<void> {
  if (running && !force) return running
  results = {}
  notify()
  const mine = Promise.all(
    CHAINS.map(async (c) => {
      const r = await ping(c.pub, c.sol)
      results = { ...results, [c.slug]: r }
      notify()
    }),
  ).then(() => {})
  running = mine
  return mine
}
