'use client'
import { useMemo, useState } from 'react'
import { CHAINS } from '@/lib/chains'
import { SAMPLES, bench, ping, type Stat } from '@/lib/rpc'

type Target = { id: string; label: string; sub: string; url: string; sol: boolean; custom: boolean }

const ms = (v: number | null) => (v === null ? 'n/a' : `${Math.round(v)} ms`)

function Cell({ k, v, tone = '' }: { k: string; v: string; tone?: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400">{k}</p>
      <p className={`mt-0.5 text-[13px] tabular-nums text-gray-900 ${tone}`}>{v}</p>
    </div>
  )
}

export default function Benchmarker() {
  const [chainSlug, setChainSlug] = useState('ethereum')
  const [primary, setPrimary] = useState('')
  const [backup, setBackup] = useState('')
  const [threshold, setThreshold] = useState(150)
  const [running, setRunning] = useState(false)
  const [ran, setRan] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [res, setRes] = useState<Record<string, Stat>>({})
  const [lags, setLags] = useState<Record<string, number | null>>({})

  const chain = CHAINS.find((c) => c.slug === chainSlug)!

  // Changing the chain or either URL makes the old results describe a different setup, so clear them.
  const reset = () => {
    setRes({})
    setLags({})
    setRan(false)
    setError(null)
  }

  const hasPrimary = primary.trim() !== ''
  const hasBackup = backup.trim() !== ''

  const targets: Target[] = useMemo(() => {
    const t: Target[] = []
    if (hasPrimary) t.push({ id: 'primary', label: 'Your primary', sub: chain.label, url: primary.trim(), sol: chain.sol, custom: true })
    if (hasBackup) t.push({ id: 'backup', label: 'Your backup', sub: chain.label, url: backup.trim(), sol: chain.sol, custom: true })
    CHAINS.forEach((c) => t.push({ id: c.slug, label: c.label, sub: 'dRPC public', url: c.pub, sol: c.sol, custom: false }))
    return t
  }, [primary, backup, hasPrimary, hasBackup, chain])

  async function run() {
    setError(null)
    const custom = [primary, backup].map((s) => s.trim()).filter(Boolean)
    if (custom.some((u) => !/^https:\/\//i.test(u))) {
      setError('RPC URLs must start with https://')
      return
    }
    setRunning(true)
    setRes({})
    setLags({})
    await Promise.all(
      targets.map(async (t) => {
        const s = await bench(t.url, t.sol)
        setRes((prev) => ({ ...prev, [t.id]: s }))
      }),
    )
    // Head comparison: ask your routes and dRPC's public node for the same chain at the same moment.
    const mine = targets.filter((t) => t.custom)
    if (mine.length) {
      const [ref, ...others] = await Promise.all([ping(chain.pub, chain.sol), ...mine.map((t) => ping(t.url, t.sol))])
      const next: Record<string, number | null> = {}
      mine.forEach((t, i) => {
        const o = others[i]
        next[t.id] = ref.block !== null && o.block !== null ? Math.max(0, ref.block - o.block) : null
      })
      setLags(next)
    }
    setRunning(false)
    setRan(true)
  }

  const pId = hasPrimary ? 'primary' : chainSlug
  const pStat = res[pId]
  const pLag = hasPrimary ? lags['primary'] : 0
  const bStat = res['backup']
  const bLag = lags['backup']
  const stale = (l: number | null | undefined) => typeof l === 'number' && l > chain.lagTol

  let verdict: { tone: 'ok' | 'warn' | 'bad'; head: string; body: string } | null = null
  if (ran && pStat) {
    const slow = pStat.p50 === null || pStat.p50 > threshold
    const behind = stale(pLag)
    if (!slow && !behind) {
      verdict = { tone: 'ok', head: 'Primary passed', body: `p50 ${ms(pStat.p50)} is within the ${threshold} ms threshold${hasPrimary ? ` and the head is within ${chain.lagTol} ${chain.unit} of dRPC public` : ''}.` }
    } else {
      const why =
        pStat.p50 === null
          ? `did not respond (${pStat.err})`
          : slow
            ? `p50 ${ms(pStat.p50)} is over the ${threshold} ms threshold`
            : `is ${pLag} ${chain.unit} behind dRPC public`
      const bOk = hasBackup && bStat && bStat.p50 !== null && !stale(bLag)
      verdict = bOk
        ? { tone: 'warn', head: 'Failover triggered', body: `Primary ${why}. Traffic would move to your backup (p50 ${ms(bStat!.p50)}).` }
        : { tone: 'bad', head: 'Failover triggered, no usable backup', body: `Primary ${why}. ${hasBackup ? 'Your backup also failed a check.' : 'Add a backup RPC URL to give the route somewhere to go.'}` }
    }
  }

  const all: Stat[] = Object.values(res)
  const scaleMax = Math.max(threshold * 1.5, 200, ...all.map((s) => s.p95 ?? 0))
  const dot = { ok: 'bg-ok', warn: 'bg-warn', bad: 'bg-bad' }
  const lbl = 'text-[13px] font-medium text-gray-900'

  return (
    <div className="mx-auto grid max-w-page grid-cols-1 gap-8 px-5 py-6 sm:px-8 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-4">
        <div className="card space-y-5 p-5 lg:sticky lg:top-24">
          <div>
            <label htmlFor="chain" className={lbl}>Chain for your routes</label>
            <select id="chain" className="field mt-2" value={chainSlug} onChange={(e) => { setChainSlug(e.target.value); reset() }}>
              {CHAINS.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="primary" className={lbl}>Primary RPC URL</label>
            <input id="primary" className="field mono mt-2" value={primary} onChange={(e) => { setPrimary(e.target.value); reset() }} placeholder="https://lb.drpc.live/ethereum/KEY" autoComplete="off" spellCheck={false} />
            <p className="mt-2 text-[12px] text-gray-400">Leave blank to treat dRPC public {chain.label} as the primary.</p>
          </div>
          <div>
            <label htmlFor="backup" className={lbl}>Backup RPC URL (optional)</label>
            <input id="backup" className="field mono mt-2" value={backup} onChange={(e) => { setBackup(e.target.value); reset() }} placeholder="https://your-backup.example" autoComplete="off" spellCheck={false} />
          </div>
          <div>
            <label htmlFor="threshold" className={lbl}>
              Failover threshold <span className="font-normal text-gray-500">{threshold} ms on p50</span>
            </label>
            <input id="threshold" type="range" min={50} max={800} step={10} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="mt-2" />
          </div>
          {error && <p className="text-[13px] text-bad" role="alert">{error}</p>}
          <button type="button" className="btn btn-primary w-full" onClick={run} disabled={running}>
            {running ? 'Benchmarking' : ran ? 'Run again' : 'Run benchmark'}
          </button>
          <p className="text-[12px] leading-relaxed text-gray-400">
            {SAMPLES} timed calls per endpoint after one warm-up call, sent from this browser. Nothing is sent to a RouteLab server.
          </p>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-8">
        {verdict ? (
          <div className="card mb-5 flex items-start gap-3 p-5" role="status">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot[verdict.tone]}`} />
            <div>
              <p className="text-[14px] font-medium text-gray-900">{verdict.head}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{verdict.body}</p>
            </div>
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-dashed border-black/15 p-5 text-[13px] text-gray-500">
            {running ? 'Running. Results fill in as each endpoint finishes.' : 'No results yet. Run the benchmark to see latency, chain head and a failover verdict.'}
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 px-1 text-[11px] text-gray-400">
          <span className="inline-flex items-center gap-2"><span className="inline-block h-1.5 w-4 rounded-full bg-gray-900" />p50</span>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-0.5 bg-blue-500" />p95</span>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-0 border-l border-dashed border-gray-400" />threshold</span>
        </div>

        <ul className="card divide-y divide-black/5">
          {targets.map((t) => {
            const s = res[t.id]
            const lag = t.custom ? lags[t.id] : undefined
            const lagBad = stale(lag)
            const unit = t.sol ? 'slots' : 'blk'
            return (
              <li key={t.id} className="p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[14px] font-medium text-gray-900">
                    {t.label} <span className="ml-1 text-[12px] font-normal text-gray-400">{t.sub}</span>
                  </p>
                  {s && s.fails > 0 && (
                    <p className="text-right text-[12px] text-bad" title={s.detail ?? undefined}>
                      {s.fails}/{SAMPLES} failed ({s.err}{s.detail ? `: ${s.detail}` : ''})
                    </p>
                  )}
                </div>
                <div className="relative mt-4 h-2 rounded-full bg-gray-100">
                  {s && s.p50 !== null && (
                    <span className={`bar-grow absolute inset-y-0 left-0 rounded-full ${t.custom ? 'bg-blue-500' : 'bg-gray-900'}`} style={{ width: `${Math.min(100, (s.p50 / scaleMax) * 100)}%` }} />
                  )}
                  {s && s.p95 !== null && (
                    <span className="absolute -inset-y-1 w-0.5 bg-blue-500" style={{ left: `${Math.min(99.5, (s.p95 / scaleMax) * 100)}%` }} />
                  )}
                  <span className="absolute -inset-y-2 w-0 border-l border-dashed border-gray-400" style={{ left: `${Math.min(100, (threshold / scaleMax) * 100)}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  <Cell k="p50" v={s ? ms(s.p50) : running ? '...' : '-'} />
                  <Cell k="p95" v={s ? ms(s.p95) : running ? '...' : '-'} />
                  <Cell k="Head" v={s && s.block !== null ? s.block.toLocaleString() : running ? '...' : '-'} />
                  <Cell k="Lag" v={t.custom ? (lag === undefined ? (running ? '...' : '-') : lag === null ? 'n/a' : `${lag} ${unit}`) : 'ref'} tone={lagBad ? '!text-bad' : ''} />
                  <Cell k="Failed" v={s ? `${s.fails}/${SAMPLES}` : '-'} tone={s && s.fails ? '!text-bad' : ''} />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
