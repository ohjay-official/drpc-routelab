import Link from 'next/link'
import LiveStrip from '@/components/LiveStrip'
import Reveal from '@/components/Reveal'
import { delay } from '@/lib/ui'

const TOOLS = [
  {
    n: '01',
    name: 'Latency benchmark',
    href: '/benchmark',
    body: 'Six timed eth_blockNumber calls per endpoint (getSlot on Solana). You get p50, p95, chain head and failed calls, plus a failover verdict against a threshold you set, including how far your route lags dRPC’s public node.',
  },
  {
    n: '02',
    name: 'Cost simulator',
    href: '/cost',
    body: 'Monthly requests and peak RPS against the dRPC Free tier and Growth plan, next to per-request rates for Alchemy, QuickNode and Ankr. Switch the workload between standard reads, eth_getLogs and light calls.',
  },
  {
    n: '03',
    name: 'Config generator',
    href: '/configs',
    body: 'A nodecore.yml with the Docker run command and a quorum check, and a viem fallback transport with ranking, for the chains you pick. The API key is read from the environment, never written into a file.',
  },
]

const SAMPLE = `# nodecore.yml
upstream-config:
  upstreams:
    - id: drpc-ethereum
      chain: ethereum
      connectors:
        - type: json-rpc
          url: https://lb.drpc.live/ethereum/\${DRPC_KEY}
    - id: drpc-base
      chain: base
      connectors:
        - type: json-rpc
          url: https://lb.drpc.live/base/\${DRPC_KEY}`

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-page grid-cols-1 gap-12 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <p className="rise label-mono">Tools for dRPC NodeCloud and NodeCore</p>
            <h1
              className="rise mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.25rem]"
              style={delay('.08s')}
            >
              Benchmark dRPC endpoints from your own browser.
            </h1>
            <p className="rise mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg" style={delay('.18s')}>
              RouteLab sends real JSON-RPC calls to dRPC’s public nodes, prices your request volume against NodeCloud and other
              providers, and writes the NodeCore and viem configs for the setup you choose.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={delay('.28s')}>
              <Link href="/benchmark" className="btn btn-primary">
                Run the benchmark
              </Link>
              <Link href="/method" className="btn btn-ghost">
                Read the method
              </Link>
            </div>
          </div>

          <div className="rise min-w-0 lg:col-span-5" style={delay('.36s')}>
            <LiveStrip />
          </div>
        </div>
      </section>

      {/* Tools */}
      <section>
        <div className="mx-auto max-w-page px-5 pt-20 sm:px-8">
          <Reveal>
            <p className="label-mono">Tools</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Three tools, each on its own page.</h2>
          </Reveal>

          <div className="mt-12 border-b border-ink">
            {TOOLS.map((t, i) => (
              <Reveal key={t.n} d={i * 0.06}>
                <Link
                  href={t.href}
                  className="group grid gap-3 border-t border-ink py-8 transition-colors hover:bg-card sm:grid-cols-12 sm:gap-6 sm:px-3"
                >
                  <span className="font-mono text-xs text-mute sm:col-span-1 sm:pt-2">{t.n}</span>
                  <h3 className="text-2xl font-semibold tracking-tight sm:col-span-4 sm:text-3xl">{t.name}</h3>
                  <p className="max-w-xl leading-relaxed text-mute sm:col-span-6">{t.body}</p>
                  <span className="font-mono text-sm underline-offset-4 group-hover:underline sm:col-span-1 sm:text-right">Open</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sample output */}
      <section>
        <div className="mx-auto grid max-w-page grid-cols-1 gap-10 px-5 pt-24 sm:px-8 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-5">
            <p className="label-mono">Sample output</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What a generated config looks like.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-mute">
              The generator follows the format in dRPC’s NodeCore documentation. Keys are never written into the file. NodeCore
              reads DRPC_KEY from the environment when it starts.
            </p>
            <Link href="/configs" className="btn btn-ghost mt-7">
              Open the generator
            </Link>
          </Reveal>
          <Reveal className="min-w-0 lg:col-span-7" d={0.08}>
            <pre className="overflow-x-auto bg-ink p-5 font-mono text-xs leading-relaxed text-paper sm:p-6 sm:text-[13px]">{SAMPLE}</pre>
          </Reveal>
        </div>
      </section>

      {/* Limits */}
      <section>
        <div className="mx-auto max-w-page px-5 pt-24 sm:px-8">
          <Reveal>
            <div className="grid gap-6 border border-ink bg-card p-6 sm:grid-cols-12 sm:p-8">
              <div className="sm:col-span-4">
                <p className="label-mono">Before you rely on it</p>
              </div>
              <div className="space-y-4 leading-relaxed text-mute sm:col-span-8">
                <p>
                  Latency figures describe your own network path to each endpoint at the moment you run the test. They are not a
                  ranking of providers.
                </p>
                <p>
                  Prices are published list rates as reported for October 2026. Free allowances and subscription fees are not
                  modeled. Check each vendor’s pricing page before you decide anything.
                </p>
                <p>
                  <Link href="/method" className="text-ink underline underline-offset-4 hover:text-accent">
                    The method page
                  </Link>{' '}
                  lists exactly how each number is produced.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
