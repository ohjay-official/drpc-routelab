'use client'
import { useMemo, useState } from 'react'
import { CHAINS } from '@/lib/chains'
import { SAMPLES, bench, ping, type Stat } from '@/lib/rpc'

type Target = { id: string; label: string; sub: string; url: string; sol: boolean; custom: boolean }

const ms = (v: number | null) => (v === null ? 'n/a' : `${Math.round(v)} ms`)

function Cell({ k, v, tone = '' }: { k: string; v: string; tone?: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-mute">{k}</p>
      <p className={`mt-0.5 font-mono text-xs tabular-nums ${tone}`}>{v}</p>
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

  // Verdict
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

  const all = Object.values(res)
  const scaleMax = Math.max(threshold * 1.5, 200, ...all.map((s) => s.p95 ?? 0))
  const toneCls = { ok: 'border-ok text-ok', warn: 'border-warn text-warn', bad: 'border-bad text-bad' }

  return (
    <div className="mx-auto grid max-w-page gap-12 px-5 py-12 sm:px-8 lg:grid-cols-12">
      {/* Controls */}
      <div className="lg:col-span-4">
        <div className="space-y-6 lg:sticky lg:top-24">
          <div>
            <label htmlFor="chain" className="label-mono">Chain for your routes</label>
            <select id="chain" className="field mt-2" value={chainSlug} onChange={(e) => setChainSlug(e.target.value)}>
              {CHAINS.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="primary" className="label-mono">Primary RPC URL</label>
            <input id="primary" className="field mt-2" value={primary} onChange={(e) => setPrimary(e.target.value)} placeholder="https://lb.drpc.live/ethereum/KEY" autoComplete="off" spellCheck={false} />
            <p className="mt-2 text-xs text-mute">Leave blank to treat dRPC public {chain.label} as the primary.</p>
          </div>
          <div>
            <label htmlFor="backup" className="label-mono">Backup RPC URL (optional)</label>
            <input id="backup" className="field mt-2" value={backup} onChange={(e) => setBackup(e.target.value)} placeholder="https://your-backup.example" autoComplete="off" spellCheck={false} />
          </div>
          <div>
            <label htmlFor="threshold" className="label-mono">
              Failover threshold <span className="text-ink">{threshold} ms</span> on p50
            </label>
            <input id="threshold" type="range" min={50} max={800} step={10} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="mt-2" />
          </div>
          {error && <p className="text-sm text-bad" role="alert">{error}</p>}
          <button type="button" className="btn btn-primary w-full" onClick={run} disabled={running}>
            {running ? 'Benchmarking' : ran ? 'Run again' : 'Run benchmark'}
          </button>
          <p className="text-xs leading-relaxed text-mute">
            {SAMPLES} timed calls per endpoint after one warm-up call, sent from this browser. Nothing is sent to a RouteLab server.
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-8">
        {verdict ? (
          <div className={`mb-8 border-l-4 bg-card px-5 py-4 ${toneCls[verdict.tone]}`} role="status">
            <p className="font-semibold">{verdict.head}</p>
            <p className="mt-1 text-sm text-ink">{verdict.body}</p>
          </div>
        ) : (
          <div className="mb-8 border border-dashed border-rule px-5 py-4 text-sm text-mute">
            {running ? 'Running. Results fill in as each endpoint finishes.' : 'No results yet. Run the benchmark to see latency, chain head and a failover verdict.'}
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[11px] text-mute">
          <span className="inline-flex items-center gap-2"><span className="inline-block h-2 w-4 bg-ink" />p50</span>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-0.5 bg-accent" />p95</span>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-0 border-l border-dashed border-ink" />threshold</span>
        </div>

        <ul className="border-t border-ink">
          {targets.map((t) => {
            const s = res[t.id]
            const lag = t.custom ? lags[t.id] : undefined
            const lagBad = stale(lag)
            const unit = t.sol ? 'slots' : 'blk'
            return (
              <li key={t.id} className="border-b border-rule py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-semibold">
                    {t.label} <span className="ml-1 font-mono text-[11px] font-normal text-mute">{t.sub}</span>
                  </p>
                  {s && s.fails > 0 && <p className="font-mono text-xs text-bad">{s.fails}/{SAMPLES} failed ({s.err})</p>}
                </div>
                <div className="relative mt-4 h-3 bg-rule/60">
                  {s && s.p50 !== null && (
                    <span className={`bar-grow absolute inset-y-0 left-0 ${t.custom ? 'bg-accent' : 'bg-ink'}`} style={{ width: `${Math.min(100, (s.p50 / scaleMax) * 100)}%` }} />
                  )}
                  {s && s.p95 !== null && (
                    <span className="absolute -inset-y-1 w-0.5 bg-accent" style={{ left: `${Math.min(99.5, (s.p95 / scaleMax) * 100)}%` }} />
                  )}
                  <span className="absolute -inset-y-2 w-0 border-l border-dashed border-ink/60" style={{ left: `${Math.min(100, (threshold / scaleMax) * 100)}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  <Cell k="p50" v={s ? ms(s.p50) : running ? '...' : '-'} />
                  <Cell k="p95" v={s ? ms(s.p95) : running ? '...' : '-'} />
                  <Cell k="Head" v={s && s.block !== null ? s.block.toLocaleString() : running ? '...' : '-'} />
                  <Cell
                    k="Lag"
                    v={t.custom ? (lag === undefined ? (running ? '...' : '-') : lag === null ? 'n/a' : `${lag} ${unit}`) : 'ref'}
                    tone={lagBad ? 'text-bad' : ''}
                  />
                  <Cell k="Failed" v={s ? `${s.fails}/${SAMPLES}` : '-'} tone={s && s.fails ? 'text-bad' : ''} />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
