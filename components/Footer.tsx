import Link from 'next/link'
import DrpcMark from './DrpcMark'

const a = 'text-[13px] text-gray-500 transition-colors hover:text-gray-900'
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title}>
      <p className="text-[13px] font-medium text-gray-900">{title}</p>
      <ul className="mt-3 space-y-2">{children}</ul>
    </nav>
  )
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10">
      <div className="mx-auto grid max-w-page grid-cols-2 gap-10 px-5 py-12 sm:px-8 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <p className="text-[15px] font-medium text-gray-900">RouteLab</p>
          <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-gray-500">
            An independent community project. It is not made by, affiliated with, or endorsed by dRPC.
          </p>
          <p className="mt-4 flex items-center gap-2 text-[12px] text-gray-400">
            <DrpcMark size={20} />
            dRPC and its logo belong to dRPC.
          </p>
        </div>
        <div className="md:col-span-2">
          <Col title="Tools">
            <li><Link href="/benchmark" className={a}>Benchmark</Link></li>
            <li><Link href="/cost" className={a}>Cost</Link></li>
            <li><Link href="/configs" className={a}>Configs</Link></li>
            <li><Link href="/method" className={a}>Method</Link></li>
          </Col>
        </div>
        <div className="md:col-span-3">
          <Col title="Sources">
            <li><a href="https://drpc.org/pricing" {...ext} className={a}>dRPC pricing</a></li>
            <li><a href="https://drpc.org/docs" {...ext} className={a}>dRPC documentation</a></li>
            <li><a href="https://github.com/drpcorg/nodecore" {...ext} className={a}>NodeCore on GitHub</a></li>
            <li><a href="https://viem.sh/docs/clients/transports/fallback" {...ext} className={a}>viem fallback transport</a></li>
          </Col>
        </div>
        <div className="md:col-span-2">
          <Col title="Project">
            <li><Link href="/privacy" className={a}>Privacy</Link></li>
            <li><Link href="/terms" className={a}>Terms</Link></li>
            <li><a href="https://github.com/ohjay-official/drpc-routelab" {...ext} className={a}>Source code</a></li>
            <li><a href="https://x.com/Oh_Jay0" {...ext} className={a}>@Oh_Jay0</a></li>
          </Col>
        </div>
      </div>
      <div className="border-t border-black/10">
        <p className="mx-auto max-w-page px-5 py-5 text-[12px] text-gray-400 sm:px-8">
          Pricing figures are published list rates as reported for October 2026 and can change. Confirm them on each vendor page.
        </p>
      </div>
    </footer>
  )
}
