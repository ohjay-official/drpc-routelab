'use client'
import { useMemo, useState } from 'react'

const CHAINS = [
  { slug: 'ethereum', label: 'Ethereum', pub: 'https://eth.drpc.org', viem: 'mainnet' },
  { slug: 'base', label: 'Base', pub: 'https://base.drpc.org', viem: 'base' },
  { slug: 'arbitrum', label: 'Arbitrum', pub: 'https://arbitrum.drpc.org', viem: 'arbitrum' },
  { slug: 'optimism', label: 'Optimism', pub: 'https://optimism.drpc.org', viem: 'optimism' },
  { slug: 'polygon', label: 'Polygon', pub: 'https://polygon.drpc.org', viem: 'polygon' },
  { slug: 'bsc', label: 'BSC', pub: 'https://bsc.drpc.org', viem: 'bsc' },
  { slug: 'solana', label: 'Solana', pub: 'https://solana.drpc.org', viem: null as string | null },
]
const BENCH = CHAINS
const SAMPLES = 6

type Stat = { p50: number | null; p95: number | null; block: number | null; fails: number; err: string | null }
type Target = { id: string; label: string; url: string; sol?: boolean }

async function ping(url: string, sol = false) {
  const t = performance.now()
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), 4000)
  const fail = (err: string) => ({ ms: null as number | null, block: null as number | null, err })
  try {
    const r = await fetch(url, {
      method: 'POST',
      signal: ctl.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: sol ? 'getSlot' : 'eth_blockNumber', params: [] }),
    })
    if (r.status === 429) return fail('rate-limited')
    if (!r.ok) return fail('http-' + r.status)
    const j = await r.json()
    if (j.error || j.result === undefined) return fail('rpc-error')
    const block = sol ? Number(j.result) : parseInt(j.result, 16)
    return { ms: performance.now() - t, block, err: null as string | null }
  } catch (e: any) {
    return fail(e?.name === 'AbortError' ? 'timeout' : 'network/cors')
  } finally {
    clearTimeout(timer)
  }
}

function pct(sorted: number[], p: number) {
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)]
}

async function bench(url: string, sol = false): Promise<Stat> {
  await ping(url, sol) // warm-up: DNS + TLS, not counted
  const ms: number[] = []
  let block: number | null = null
  let fails = 0
  let err: string | null = null
  for (let i = 0; i < SAMPLES; i++) {
    const r = await ping(url, sol)
    if (r.ms === null) { fails++; err = r.err }
    else { ms.push(r.ms); block = r.block }
  }
  ms.sort((a, b) => a - b)
  return { p50: ms.length ? pct(ms, 50) : null, p95: ms.length ? pct(ms, 95) : null, block, fails, err }
}

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500) } catch {} }}
      className="rounded border border-line px-3 py-1.5 text-xs text-ink hover:border-signal"
    >{done ? 'Copied' : 'Copy'}</button>
  )
}

const Panel = ({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) => (
  <section className="rounded-lg border border-line bg-panel p-4 sm:p-6">
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="mb-5 mt-1 max-w-prose text-sm text-mute">{sub}</p>
    {children}
  </section>
)

const inputCls = 'w-full rounded border border-line bg-bg px-3 py-2 font-mono text-xs text-ink placeholder:text-mute'

function Benchmarker() {
  const [primary, setPrimary] = useState('')
  const [backup, setBackup] = useState('')
  const [threshold, setThreshold] = useState(150)
  const [running, setRunning] = useState(false)
  const [res, setRes] = useState<Record<string, Stat>>({})
  const [ran, setRan] = useState(false)

  const targets: Target[] = useMemo(() => {
    const t: Target[] = []
    if (primary.trim()) t.push({ id: 'primary', label: 'Your primary (Ethereum)', url: primary.trim() })
    if (backup.trim()) t.push({ id: 'backup', label: 'Your backup (Ethereum)', url: backup.trim() })
    BENCH.forEach((c) => t.push({ id: c.slug, label: c.label + ' (public)', url: c.pub, sol: c.slug === 'solana' }))
    return t
  }, [primary, backup])

  async function run() {
    setRunning(true); setRes({})
    await Promise.all(targets.map(async (t) => {
      const s = await bench(t.url, t.sol)
      setRes((prev) => ({ ...prev, [t.id]: s }))
    }))
    setRunning(false); setRan(true)
  }

  const pStat = res[primary.trim() ? 'primary' : 'ethereum']
  const bStat = res['backup']
  let verdict: { tone: string; text: string } | null = null
  if (ran && pStat) {
    const ref = res['ethereum']?.block
    const pLag = primary.trim() && pStat.block != null && ref != null ? ref - pStat.block : 0
    const ok = pStat.p50 !== null && pStat.p50 <= threshold && pLag <= 2
    const why = pStat.p50 === null ? `did not respond (${pStat.err})` : pLag > 2 ? `is ${pLag} blocks behind dRPC public` : `p50 ${pStat.p50.toFixed(0)} ms`
    if (ok) verdict = { tone: 'text-ok', text: `Primary passed: p50 ${pStat.p50!.toFixed(0)} ms is within the ${threshold} ms threshold.` }
    else if (backup.trim() && bStat && bStat.p50 !== null)
      verdict = { tone: 'text-warn', text: `Failover triggered: primary ${why}. Traffic would route to your backup (p50 ${bStat.p50.toFixed(0)} ms).` }
    else verdict = { tone: 'text-bad', text: `Failover triggered: primary ${why} and no working backup is set. Add a backup RPC URL.` }
  }

  return (
    <Panel title="Latency benchmark and failover check" sub={`Sends ${SAMPLES} real eth_blockNumber calls (getSlot on Solana) per endpoint from your browser. Results reflect your own network path.`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-mute">Primary RPC (blank uses eth.drpc.org)
          <input className={inputCls + ' mt-1'} value={primary} onChange={(e) => setPrimary(e.target.value)} placeholder="https://lb.drpc.live/ethereum/YOUR_KEY" />
        </label>
        <label className="text-xs text-mute">Backup RPC (optional)
          <input className={inputCls + ' mt-1'} value={backup} onChange={(e) => setBackup(e.target.value)} placeholder="https://your-backup-rpc.example" />
        </label>
      </div>
      <label className="mt-4 block text-xs text-mute">Failover threshold: <span className="font-mono text-ink">{threshold} ms</span> (p50)
        <input type="range" min={50} max={800} step={10} value={threshold} onChange={(e) => setThreshold(+e.target.value)} />
      </label>
      <button onClick={run} disabled={running} className="mt-4 rounded bg-signal px-4 py-2 text-sm font-bold text-bg disabled:opacity-50">
        {running ? 'Benchmarking…' : 'Run benchmark'}
      </button>
      {verdict && <p className={`mt-4 text-sm font-medium ${verdict.tone}`}>{verdict.text}</p>}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs text-mute">
            <tr><th className="py-2 font-normal">Endpoint</th><th className="font-normal">p50</th><th className="font-normal">p95</th><th className="font-normal">Head</th><th className="font-normal">Lag</th><th className="font-normal">Failed</th></tr>
          </thead>
          <tbody className="font-mono text-xs">
            {targets.map((t) => {
              const s = res[t.id]
              const ref = res['ethereum']?.block
              const lag = (t.id === 'primary' || t.id === 'backup') && s?.block != null && ref != null ? ref - s.block : null
              return (
                <tr key={t.id} className="border-t border-line">
                  <td className="py-2 font-sans text-sm">{t.label}</td>
                  <td>{s ? (s.p50 === null ? 'n/a' : s.p50.toFixed(0) + ' ms') : running ? '…' : '–'}</td>
                  <td>{s ? (s.p95 === null ? 'n/a' : s.p95.toFixed(0) + ' ms') : running ? '…' : '–'}</td>
                  <td>{s && s.block !== null ? s.block.toLocaleString() : running ? '…' : '–'}</td>
                  <td className={lag !== null && lag > 2 ? 'text-bad' : ''}>{lag !== null ? `${lag} blk` : '–'}</td>
                  <td className={s && s.fails ? 'text-bad' : ''}>{s ? (s.fails ? `${s.fails}/${SAMPLES} ${s.err}` : `0/${SAMPLES}`) : '–'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

const WORK = {
  read: { label: 'Standard read (eth_call)', alchemy: 13.65, quicknode: 12.4, ankr: 20 },
  logs: { label: 'Heavy indexing (eth_getLogs)', alchemy: 31.5, quicknode: 12.4, ankr: 20 },
  light: { label: 'Light read (eth_blockNumber)', alchemy: 5.25, quicknode: 12.4, ankr: 20 },
}

function CostSim() {
  const [vol, setVol] = useState(25)
  const [rps, setRps] = useState(200)
  const [wk, setWk] = useState<keyof typeof WORK>('read')
  const w = WORK[wk]

  const FREE_REQ = 210 / 20 // 10.5M requests
  const cu = vol * 20
  const freeOk = vol <= FREE_REQ && rps <= 100
  const growthOk = rps <= 5000
  const growthCost = vol * 6
  const comps = [
    { name: 'Alchemy', cost: vol * w.alchemy, note: `$${w.alchemy}/1M requests ($0.525 per 1M CU)` },
    { name: 'QuickNode', cost: vol * w.quicknode, note: `$${w.quicknode}/1M requests (overage rate, plan fees not modeled)` },
    { name: 'Ankr', cost: vol * w.ankr, note: `$${w.ankr}/1M requests (EVM pay-as-you-go)` },
  ]
  const rows = [
    { name: 'dRPC Free', cost: 0, ok: freeOk, note: freeOk ? 'Fits: 210M CU and 100 RPS' : vol > FREE_REQ ? `Over by ${(vol - FREE_REQ).toFixed(1)}M requests` : 'Peak RPS above 100' },
    { name: 'dRPC Growth', cost: growthCost, ok: growthOk, note: growthOk ? `${cu}M CU at a flat $6 per 1M requests` : 'Above 5,000 RPS: talk to Enterprise' },
    ...comps.map((c) => ({ ...c, ok: true })),
  ]
  const max = Math.max(...rows.map((r) => r.cost), 1)
  const cheapest = comps.reduce((m, c) => (c.cost < m.cost ? c : m))
  const diff = cheapest.cost - growthCost
  const verdict = diff >= 0
    ? `On this workload dRPC Growth saves $${diff.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo against the cheapest listed (${cheapest.name}).`
    : `On this workload ${cheapest.name} is $${(-diff).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo cheaper than dRPC Growth.`

  return (
    <Panel title="NodeCloud CU and cost simulator" sub="dRPC charges a flat 20 CU per request on any method: free is 210M CU per 30 days (10.5M requests, 100 RPS), Growth is $6 per 1M requests (5,000 RPS). Competitors weight cost by method, so pick a workload.">
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(WORK) as (keyof typeof WORK)[]).map((k) => (
          <button key={k} onClick={() => setWk(k)} aria-pressed={wk === k}
            className={`rounded border px-3 py-1.5 text-xs ${wk === k ? 'border-signal text-signal' : 'border-line text-mute'}`}>{WORK[k].label}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs text-mute">Monthly requests: <span className="font-mono text-ink">{vol}M</span> = <span className="font-mono text-ink">{cu}M CU</span>
          <input type="range" min={1} max={500} value={vol} onChange={(e) => setVol(+e.target.value)} />
        </label>
        <label className="text-xs text-mute">Peak RPS: <span className="font-mono text-ink">{rps.toLocaleString()}</span>
          <input type="range" min={1} max={10000} step={10} value={rps} onChange={(e) => setRps(+e.target.value)} />
        </label>
      </div>
      <div className="mt-5 space-y-3">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex justify-between text-sm">
              <span className={r.name.startsWith('dRPC') ? 'font-bold' : ''}>{r.name}</span>
              <span className={`font-mono ${r.ok ? '' : 'text-bad'}`}>${r.cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo</span>
            </div>
            <div className="mt-1 h-1.5 rounded bg-line"><div className={`h-1.5 rounded ${r.name.startsWith('dRPC') ? 'bg-signal' : 'bg-mute'}`} style={{ width: `${(r.cost / max) * 100}%` }} /></div>
            <div className={`mt-1 text-xs ${r.ok ? 'text-mute' : 'text-bad'}`}>{r.note}</div>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-sm font-medium">{verdict}</p>
      <p className="mt-2 text-xs text-mute">Competitor rates are published October 2026 figures converted to per-request cost. Free tiers and subscription fees are not modeled. Confirm on each vendor's pricing page.</p>
    </Panel>
  )
}

function Generator() {
  const [sel, setSel] = useState<string[]>(['ethereum', 'base'])
  const [key, setKey] = useState('')
  const [backup, setBackup] = useState('')
  const [quorum, setQuorum] = useState(true)
  const [tab, setTab] = useState<'yml' | 'viem'>('yml')

  const chains = CHAINS.filter((c) => sel.includes(c.slug))
  const k = key.trim() || '${DRPC_KEY}'
  const toggle = (s: string) => setSel((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  const yml = useMemo(() => {
    const ups = chains.map((c) => `    - id: drpc-${c.slug}
      chain: ${c.slug}
      connectors:
        - type: json-rpc
          url: https://lb.drpc.live/${c.slug}/${k}`).join('\n')
    const bk = backup.trim() && chains[0] ? `\n    - id: backup-${chains[0].slug}
      chain: ${chains[0].slug}
      connectors:
        - type: json-rpc
          url: ${backup.trim()}` : ''
    const first = chains[0]?.slug ?? 'ethereum'
    const m = first === 'solana' ? 'getSlot' : 'eth_blockNumber'
    const q = quorum ? `\n\n# Quorum verification (3 providers asked, 2 must agree)
curl -X POST "http://localhost:9090/queries/${first}?quorum=3&quorum_required=2" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"${m}","params":[]}'` : ''
    return `# nodecore.yml
upstream-config:
  upstreams:
${ups}${bk}

# Run (Docker, port 9090)
docker run -d --name nodecore --restart always \\
  -p 9090:9090 \\
  -e DRPC_KEY=${key.trim() || 'your_key'} \\
  -v $(pwd)/nodecore.yml:/nodecore.yml drpcorg/nodecore:latest

# Query
curl -X POST http://localhost:9090/queries/${first} \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"${m}","params":[]}'${q}`
  }, [sel, key, backup, quorum])

  const viem = useMemo(() => {
    const evm = chains.filter((c) => c.viem)
    const imp = evm.map((c) => c.viem).join(', ')
    const solNote = sel.includes('solana') ? `\n\n// Solana is not EVM, so viem can't use it. Use @solana/web3.js:\n// import { Connection } from '@solana/web3.js'\n// export const solana = new Connection('https://lb.drpc.live/solana/' + (process.env.DRPC_KEY ?? ''))` : ''
    const body = evm.map((c) => {
      const url = key.trim() ? `'https://lb.drpc.live/${c.slug}/${key.trim()}'` : `\`https://lb.drpc.live/${c.slug}/\${process.env.DRPC_KEY}\``
      const bk = backup.trim() && c === evm[0] ? `\n    http('${backup.trim()}'),` : ''
      return `export const ${c.slug}Client = createPublicClient({
  chain: ${c.viem},
  transport: fallback(
    [
      http(${url}),
      http('${c.pub}'),${bk}
    ],
    {
      rank: {
        interval: 10_000,
        sampleCount: 5,
        timeout: 500,
        ping: ({ transport }) => transport.request({ method: 'eth_blockNumber' }),
        weights: { latency: 0.4, stability: 0.6 },
      },
      retryCount: 3,
    },
  ),
})`
    }).join('\n\n')
    return `// viem-transport.ts
import { createPublicClient, fallback, http } from 'viem'
import { ${imp || 'mainnet'} } from 'viem/chains'

${body || '// select at least one EVM chain'}${solNote}
`
  }, [sel, key, backup])

  const text = tab === 'yml' ? yml : viem

  return (
    <Panel title="nodecore.yml and viem config generator" sub="Pick chains, add your key and an optional backup. Both files update live. Leave the key blank to use an environment variable.">
      <div className="flex flex-wrap gap-2">
        {CHAINS.map((c) => (
          <button key={c.slug} onClick={() => toggle(c.slug)} aria-pressed={sel.includes(c.slug)}
            className={`rounded border px-3 py-1.5 text-xs ${sel.includes(c.slug) ? 'border-signal text-signal' : 'border-line text-mute'}`}>{c.label}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-mute">dRPC API key (stays in your browser)
          <input className={inputCls + ' mt-1'} value={key} onChange={(e) => setKey(e.target.value)} placeholder="optional" />
        </label>
        <label className="text-xs text-mute">Backup RPC URL (optional)
          <input className={inputCls + ' mt-1'} value={backup} onChange={(e) => setBackup(e.target.value)} placeholder="https://your-backup-rpc.example" />
        </label>
      </div>
      <label className="mt-3 flex items-center gap-2 text-xs text-mute">
        <input type="checkbox" checked={quorum} onChange={(e) => setQuorum(e.target.checked)} /> Include quorum verification curl
      </label>
      <div className="mt-5 flex items-center justify-between border-b border-line">
        <div className="flex gap-4 text-sm">
          {(['yml', 'viem'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`pb-2 ${tab === t ? 'border-b-2 border-signal text-ink' : 'text-mute'}`}>
              {t === 'yml' ? 'nodecore.yml' : 'viem-transport.ts'}
            </button>
          ))}
        </div>
        <div className="pb-2"><Copy text={text} /></div>
      </div>
      <pre className="mt-3 max-h-96 overflow-auto rounded bg-bg p-3 font-mono text-xs leading-relaxed">{text}</pre>
    </Panel>
  )
}

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">dRPC RouteLab</h1>
        <p className="mt-2 max-w-prose text-mute">Test dRPC endpoints live, estimate what your traffic costs, and copy production-ready NodeCore and viem configs. Everything runs in your browser.</p>
      </header>
      <Benchmarker />
      <CostSim />
      <Generator />
      <footer className="pb-6 text-xs text-mute">Independent community tool. Not affiliated with dRPC. Check drpc.org/pricing and drpc.org/docs for current terms.</footer>
    </main>
  )
}
