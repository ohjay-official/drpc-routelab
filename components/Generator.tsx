'use client'
import { useMemo, useState } from 'react'
import { CHAINS } from '@/lib/chains'
import CopyButton from './CopyButton'

type Tab = 'yml' | 'run' | 'viem'
const TABS: { id: Tab; label: string }[] = [
  { id: 'yml', label: 'nodecore.yml' },
  { id: 'run', label: 'Run and verify' },
  { id: 'viem', label: 'viem-transport.ts' },
]

export default function Generator() {
  const [sel, setSel] = useState<string[]>(['ethereum', 'base'])
  const [backup, setBackup] = useState('')
  const [quorum, setQuorum] = useState(true)
  const [tab, setTab] = useState<Tab>('yml')

  const chains = CHAINS.filter((c) => sel.includes(c.slug))
  const evm = chains
  const toggle = (s: string) => setSel((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
  const bk = backup.trim()

  const yml = useMemo(() => {
    if (!chains.length) return '# Select at least one chain'
    const lines: string[] = ['# nodecore.yml', '# Replace YOUR_DRPC_KEY with your key. Do not commit this file.', 'upstream-config:', '  upstreams:']
    chains.forEach((c) => {
      lines.push(`    - id: drpc-${c.slug}`, `      chain: ${c.slug}`, '      connectors:', '        - type: json-rpc', `          url: https://lb.drpc.live/${c.slug}/YOUR_DRPC_KEY`)
    })
    if (bk) {
      const c = chains[0]
      lines.push(`    - id: backup-${c.slug}`, `      chain: ${c.slug}`, '      connectors:', '        - type: json-rpc', `          url: ${bk}`)
    }
    return lines.join('\n')
  }, [sel, bk])

  const run = useMemo(() => {
    const first = chains[0]
    const slug = first ? first.slug : 'ethereum'
    const method = 'eth_blockNumber'
    const body = `-d '{"jsonrpc":"2.0","id":1,"method":"${method}","params":[]}'`
    const lines = [
      '# 1. Save nodecore.yml here and replace YOUR_DRPC_KEY with your key (keep the file out of git)',
      '',
      '# 2. Start NodeCore on port 9090',
      'docker run -d --name nodecore --restart always \\',
      '  -p 9090:9090 \\',
      '  -v $(pwd)/nodecore.yml:/nodecore.yml \\',
      '  drpcorg/nodecore',
      '',
      '# 3. Send a request through it',
      `curl -X POST http://localhost:9090/queries/${slug} \\`,
      '  -H "Content-Type: application/json" \\',
      `  ${body}`,
    ]
    if (quorum) {
      lines.push(
        '',
        '# 4. Quorum verification: ask for 3 signed responses, require 2 to verify',
        `curl -X POST "http://localhost:9090/queries/${slug}?quorum=3&quorum_required=2" \\`,
        '  -H "Content-Type: application/json" \\',
        `  ${body}`,
      )
    }
    return lines.join('\n')
  }, [sel, quorum])

  const viem = useMemo(() => {
    const imp = evm.map((c) => c.viem).join(', ')
    const blocks = evm.map((c, i) => {
      const l: string[] = [
        `export const ${c.slug}Client = createPublicClient({`,
        `  chain: ${c.viem},`,
        '  transport: fallback(',
        '    [',
        '      http(`https://lb.drpc.live/' + c.slug + '/${process.env.DRPC_KEY}`),',
        `      http('${c.pub}'),`,
      ]
      if (bk && i === 0) l.push(`      http('${bk}'),`)
      l.push(
        '    ],',
        '    {',
        '      rank: {',
        '        interval: 10_000,',
        '        sampleCount: 5,',
        '        timeout: 500,',
        "        ping: ({ transport }) => transport.request({ method: 'eth_blockNumber' }),",
        '        weights: { latency: 0.4, stability: 0.6 },',
        '      },',
        '      retryCount: 3,',
        '    },',
        '  ),',
        '})',
      )
      return l.join('\n')
    })
    const head = ['// viem-transport.ts', "import { createPublicClient, fallback, http } from 'viem'"]
    if (imp) head.push(`import { ${imp} } from 'viem/chains'`)
    let out = head.join('\n') + '\n\n' + (blocks.length ? blocks.join('\n\n') : '// Select at least one EVM chain')
    return out + '\n'
  }, [sel, bk])

  const text = tab === 'yml' ? yml : tab === 'run' ? run : viem

  return (
    <div className="mx-auto grid max-w-page grid-cols-1 gap-8 px-5 py-6 sm:px-8 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-4">
        <div className="card space-y-6 p-5 lg:sticky lg:top-24">
          <fieldset>
            <legend className="text-[13px] font-medium text-gray-900">Chains</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHAINS.map((c) => (
                <button key={c.slug} type="button" className="toggle" aria-pressed={sel.includes(c.slug)} onClick={() => toggle(c.slug)}>
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="bk" className="text-[13px] font-medium text-gray-900">Backup RPC URL (optional)</label>
            <input id="bk" className="field mono mt-2" value={backup} onChange={(e) => setBackup(e.target.value)} placeholder="https://your-backup.example" autoComplete="off" spellCheck={false} />
            <p className="mt-2 text-[12px] text-gray-400">Added as a second upstream for the first chain you selected.</p>
          </div>
          <label className="flex items-start gap-3 text-[13px] text-gray-900">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-blue-500" checked={quorum} onChange={(e) => setQuorum(e.target.checked)} />
            <span>Include the quorum verification request</span>
          </label>
          <p className="text-[12px] leading-relaxed text-gray-400">
            RouteLab never sees your key. In nodecore.yml you replace YOUR_DRPC_KEY yourself, and the viem snippet reads it from
            process.env.DRPC_KEY.
          </p>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-8">
        <div className="flex items-center justify-between border-b border-black/10">
          <div className="flex gap-6 overflow-x-auto" role="tablist" aria-label="Generated files">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-[13px] ${tab === t.id ? 'border-blue-500 font-medium text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="pb-2 pl-4">
            <CopyButton text={text} />
          </div>
        </div>
        <pre className="card codeblock mt-4 max-h-[34rem] overflow-auto p-5" role="tabpanel">{text}</pre>
      </div>
    </div>
  )
}
