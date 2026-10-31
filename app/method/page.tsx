import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Method',
  description: 'How RouteLab measures latency, prices traffic and builds configs, and what it does not do.',
}

const ext = 'text-blue-500 underline underline-offset-4 hover:text-blue-600'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="grid gap-3 border-t border-black/10 py-10 sm:grid-cols-12 sm:gap-8">
        <h2 className="text-[1.125rem] font-medium tracking-tight text-gray-900 sm:col-span-4">{title}</h2>
        <div className="space-y-4 text-[14px] leading-relaxed text-gray-500 sm:col-span-8 [&_strong]:font-medium [&_strong]:text-gray-900">{children}</div>
      </section>
    </Reveal>
  )
}

export default function MethodPage() {
  return (
    <>
      <PageHead title="How the numbers are produced">
        Everything here is computed in your browser from a few documented rules. This page lists them, along with what the tools do
        not tell you.
      </PageHead>

      <div className="mx-auto max-w-page px-5 pb-4 pt-4 sm:px-8">
        <Block title="Latency">
          <p>
            For each endpoint the page sends one <strong>warm-up call</strong> that is not counted, so DNS and TLS setup do not skew
            the result. It then sends <strong>six timed calls in sequence</strong>. The call is <span className="code">eth_blockNumber</span>.
          </p>
          <p>
            p50 and p95 use the nearest-rank method on those six samples. With six samples, p95 is effectively the slowest call. Treat
            it as a worst case from a small run, not a stable percentile.
          </p>
          <p>
            A call fails after <strong>4 seconds</strong>. Failures are labelled by cause: timeout, rate-limited (HTTP 429), rpc-error
            (a JSON-RPC error object), bad-response, an HTTP status, or network/cors when the browser blocks or loses the request.
            Two failures in a row end that endpoint&rsquo;s run early.
          </p>
          <p>
            The preloader and the home page strip use a single call per public endpoint with no warm-up, which is why those figures
            are higher than the benchmark. If an endpoint answers with a rate limit, they retry once after a short wait. The benchmark
            never retries, so rate limits stay visible there.
          </p>
        </Block>

        <Block title="Failover verdict">
          <p>
            The primary passes when its p50 is at or under your threshold <strong>and</strong> its chain head is not stale. If it fails,
            the verdict says whether your backup would take over, and whether the backup itself passes the head check.
          </p>
          <p>
            Head lag is measured at the end of the run by asking your route and dRPC&rsquo;s public node for the same chain at the same
            moment. Stale means more than a per-chain tolerance, set to roughly six seconds of chain time: 2 blocks on Ethereum, 3 on
            Base, Optimism and Polygon, 12 on BSC and 24 on Arbitrum. These tolerances are approximations, not
            protocol values.
          </p>
          <p>
            This is a verdict on one test, not a simulation of a production router. Real failover logic, such as NodeCore&rsquo;s upstream
            scoring, also weighs error rates over time.
          </p>
        </Block>

        <Block title="Pricing model">
          <p>
            <strong>dRPC:</strong> 20 compute units per request on Free, Pay as You Go and overage. Inside the Pro and Scale pools a request costs about 16 and 14 CU, which is why they include roughly 10M and 47M requests. The plans are modeled as listed on its pricing page.
            Free: 210M CU, about 10.5M requests, 100 RPS, public nodes only. Pay as You Go: $6 per 1M requests, 100 RPS, no commitment.
            Pro: $49 a month with 10M requests included and 300 RPS. Scale: $199 a month with 47M requests included and 600 RPS.
            Enterprise starts at $990 a month with unlimited RPS and needs a quote.
          </p>
          <p>
            Once a Pro or Scale pool is used, overage is charged from the account balance at $6 per 1M multi-chain requests. If the
            balance is empty and there is no overdraft, requests stop until funds are added, and a paid plan does not fall back to Free.
            The simulator picks the cheapest listed plan that fits your volume and peak RPS. The 100 RPS limit on Pay as You Go applies
            to new accounts, and existing customers keep their current terms. Pricing is for EVM chains. Solana is billed separately by dRPC
            and is not modeled.
          </p>
          <p>
            <strong>Alchemy:</strong> $0.525 per 1M compute units, weighted by method. This tool uses 10 CU for eth_blockNumber, 26 CU for
            eth_call and 60 CU for eth_getLogs, which gives $5.25, $13.65 and $31.50 per 1M requests. The eth_getLogs weight and the
            per-unit rate are the figures most worth confirming on Alchemy&rsquo;s own pricing page.
          </p>
          <p>
            <strong>QuickNode:</strong> the cheapest plan that fits your volume and peak RPS, at 20 API credits per call. Build is $49 for 80M credits at 50 RPS with $0.62 overage per 1M credits. Accelerate is $249 for 450M at 125 RPS with $0.56. Scale is $499 for 950M at 250 RPS with $0.53. Business is $999 for 2B at 500 RPS with $0.50.
          </p>
          <p>
            <strong>Ankr:</strong> 200 API credits per EVM request at $0.10 per 1M credits, or $20 per 1M requests.
          </p>
          <p>
            These are published rates as reported for October 2026. Vendors change prices, so confirm each one on its own page:{' '}
            <a className={ext} href="https://drpc.org/pricing" target="_blank" rel="noopener noreferrer">dRPC</a>. Competitor free
            allowances are not modeled, so their figures are a ceiling for comparison, not a quote. Competitor RPS limits are not
            modeled either.
          </p>
        </Block>

        <Block title="Generated files">
          <p>
            The nodecore.yml follows the structure in the NodeCore README: <span className="code">upstream-config</span>, a list of
            upstreams, and a <span className="code">json-rpc</span> connector per upstream. The Docker image, the mount at{' '}
            <span className="code">/nodecore.yml</span>, port 9090 and the <span className="code">/queries/chain</span> request path
            come from the same README. The key is a placeholder you replace yourself, because RouteLab never sees it. The quorum
            request follows the NodeCore quorum guide: <span className="code">quorum=N</span> asks for up to N signed responses and{' '}
            <span className="code">quorum_required=M</span> needs at least M to verify. Quorum works only against dRPC upstreams over
            HTTP, and it skips the cache. See the{' '}
            <a className={ext} href="https://drpc.org/docs/gettingstarted/verification" target="_blank" rel="noopener noreferrer">verification guide</a> and the{' '}
            <a className={ext} href="https://github.com/drpcorg/nodecore" target="_blank" rel="noopener noreferrer">NodeCore repository</a>.
          </p>
          <p>
            The viem snippet uses the <a className={ext} href="https://viem.sh/docs/clients/transports/fallback" target="_blank" rel="noopener noreferrer">fallback transport</a> with
            ranking. Ranking pings each transport with eth_blockNumber instead of the default net_listening, because many public
            endpoints do not answer net_listening well.
          </p>
          <p>Generated files are starting points. Run them against a test key before they go near production.</p>
        </Block>

        <Block title="What this does not do">
          <p>
            It does not rank providers. A browser test measures your own network path at one moment, to one region of each service.
            For provider comparisons across regions over time, use a continuous monitoring dashboard.
          </p>
          <p>
            It covers six EVM chains. dRPC&rsquo;s public Solana endpoint answers &ldquo;chain is not available on free plan&rdquo;, so
            there is nothing public to test, and Solana is left out. The Free plan covers public nodes only.
          </p>
          <p>
            It does not store your RPC URLs, send them to a server, or keep results. Closing the tab clears everything. See the privacy
            page for the details.
          </p>
          <p>
            It is an independent project and has no connection to dRPC beyond using its public documentation and public endpoints.
          </p>
        </Block>
      </div>
    </>
  )
}
