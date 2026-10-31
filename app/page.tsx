import Link from 'next/link'
import ConfigPreview from '@/components/ConfigPreview'
import CostPreview from '@/components/CostPreview'
import HeroVideo from '@/components/HeroVideo'
import LiveStrip from '@/components/LiveStrip'
import Reveal from '@/components/Reveal'
import Streaks from '@/components/Streaks'

function Arrow() {
  return <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
}

function Feature({
  title,
  body,
  href,
  cta,
  flip,
  children,
}: {
  title: string
  body: string
  href: string
  cta: string
  flip?: boolean
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mx-auto grid max-w-page grid-cols-1 items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-16">
        <Reveal className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
          <h2 className="text-[1.5rem] font-medium leading-[1.15] tracking-tight text-gray-900 sm:text-[1.75rem]">{title}</h2>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-gray-500">{body}</p>
          <Link href={href} className="group mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-ink transition-colors hover:text-brand-hover">
            {cta}
            <Arrow />
          </Link>
        </Reveal>
        <Reveal className={`min-w-0 lg:col-span-7 ${flip ? 'lg:order-1' : ''}`} d={0.08}>
          {children}
        </Reveal>
      </div>
    </section>
  )
}

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
                className="group mb-3 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-brand-ink transition-colors hover:text-brand-hover"
              >
                Independent tool, not affiliated with dRPC
                <Arrow />
              </Link>
              <h1 className="mb-3 text-[1.5rem] font-medium leading-[1.15] tracking-tight text-gray-900 sm:text-[1.75rem]">
                Benchmark dRPC endpoints from your own browser.
              </h1>
              <p className="mb-3 text-[13px] font-normal text-gray-400">Nothing leaves your device.</p>
              <Link
                href="/benchmark"
                className="group inline-flex items-center gap-2 rounded-full border border-brand-deep px-5 py-2.5 text-[13px] font-medium text-brand-ink transition-all duration-200 hover:border-brand hover:bg-brand hover:text-gray-900"
              >
                Run the benchmark
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden pt-8 sm:pt-12">
        <Streaks />
        <Feature
          title="Test your connection to dRPC."
          body="Real calls from this browser to dRPC's public nodes, with a full benchmark that adds p50, p95 and a failover verdict against your own routes."
          href="/benchmark"
          cta="Open the benchmark"
        >
          <LiveStrip />
        </Feature>

        <Feature
          flip
          title="Price your traffic before you move it."
          body="dRPC charges a flat 20 compute units per request. Other providers weight by method, so heavy log queries are where the gap shows."
          href="/cost"
          cta="Open the cost simulator"
        >
          <CostPreview />
        </Feature>

        <Feature
          title="Get a config you can paste."
          body="A NodeCore file, the Docker command, a quorum check and a viem fallback transport for the chains you pick."
          href="/configs"
          cta="Open the generator"
        >
          <ConfigPreview />
        </Feature>

        <section>
          <div className="mx-auto max-w-page px-5 pb-8 pt-8 sm:px-8">
            <Reveal>
              <p className="max-w-2xl text-[13px] leading-relaxed text-gray-500">
                Latency figures describe your own network path at the moment you run a test, and prices are published list rates as
                reported for October 2026. Neither is a ranking of providers.{' '}
                <Link href="/method" className="group inline-flex items-center gap-1 font-medium text-brand-ink hover:text-brand-hover">
                  How each number is produced
                  <Arrow />
                </Link>
              </p>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  )
}
