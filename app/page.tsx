import Link from 'next/link'
import HeroVideo from '@/components/HeroVideo'
import LiveStrip from '@/components/LiveStrip'
import Reveal from '@/components/Reveal'

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
      <section className="relative min-h-screen overflow-hidden bg-[#f0f0ee]" style={{ minHeight: '100svh' }}>
        <HeroVideo />
        <div className="relative z-10 flex min-h-screen flex-col" style={{ minHeight: '100svh' }}>
          <div className="flex flex-1 items-end px-6 pb-10 pt-28 sm:px-12 sm:pb-16 md:px-20 lg:px-28 lg:pb-20">
            <div className="max-w-xs">
              <Link
                href="/method"
                className="group mb-3 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 transition-colors hover:text-blue-600"
              >
                Independent tool, not affiliated with dRPC
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
              </Link>
              <h1 className="mb-3 text-[1.5rem] font-medium leading-[1.15] tracking-tight text-gray-900 sm:text-[1.75rem]">
                Benchmark dRPC endpoints from your own browser.
              </h1>
              <p className="mb-3 text-[13px] font-normal text-gray-400">Nothing leaves your device.</p>
              <Link
                href="/benchmark"
                className="group inline-flex items-center gap-2 rounded-full border border-blue-400 px-5 py-2.5 text-[13px] font-medium text-blue-500 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
              >
                Run the benchmark
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live check */}
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-page grid-cols-1 gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className="label-mono">Live check</p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">Your connection to dRPC, right now.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-mute">
              These are real calls from this browser to dRPC&rsquo;s public nodes. Each figure includes connection setup. The
              benchmark page runs six timed calls per endpoint and adds p50, p95 and a failover verdict.
            </p>
            <Link href="/benchmark" className="btn btn-ghost mt-7">
              Open the benchmark
            </Link>
          </Reveal>
          <Reveal className="min-w-0 lg:col-span-6" d={0.08}>
            <LiveStrip />
          </Reveal>
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
