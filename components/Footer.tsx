import Link from 'next/link'

const ext = 'underline-offset-4 hover:underline'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink">
      <div className="mx-auto grid max-w-page gap-10 px-5 py-12 sm:grid-cols-12 sm:px-8">
        <div className="sm:col-span-5">
          <p className="text-lg font-semibold tracking-tight">RouteLab</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
            An independent community project. It is not made by, affiliated with, or endorsed by dRPC.
          </p>
        </div>

        <nav className="sm:col-span-2" aria-label="Tools">
          <p className="label-mono">Tools</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/benchmark" className={ext}>Benchmark</Link></li>
            <li><Link href="/cost" className={ext}>Cost</Link></li>
            <li><Link href="/configs" className={ext}>Configs</Link></li>
            <li><Link href="/method" className={ext}>Method</Link></li>
          </ul>
        </nav>

        <nav className="sm:col-span-3" aria-label="Sources">
          <p className="label-mono">Sources</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="https://drpc.org/pricing" target="_blank" rel="noopener noreferrer" className={ext}>dRPC pricing</a></li>
            <li><a href="https://drpc.org/docs" target="_blank" rel="noopener noreferrer" className={ext}>dRPC documentation</a></li>
            <li><a href="https://github.com/drpcorg/nodecore" target="_blank" rel="noopener noreferrer" className={ext}>NodeCore on GitHub</a></li>
            <li><a href="https://viem.sh/docs/clients/transports/fallback" target="_blank" rel="noopener noreferrer" className={ext}>viem fallback transport</a></li>
          </ul>
        </nav>

        <nav className="sm:col-span-2" aria-label="Legal">
          <p className="label-mono">Project</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/privacy" className={ext}>Privacy</Link></li>
            <li><Link href="/terms" className={ext}>Terms</Link></li>
            <li><a href="https://github.com/ohjay-official/drpc-routelab" target="_blank" rel="noopener noreferrer" className={ext}>Source code</a></li>
            <li><a href="https://x.com/Oh_Jay0" target="_blank" rel="noopener noreferrer" className={ext}>@Oh_Jay0</a></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-rule">
        <p className="mx-auto max-w-page px-5 py-5 font-mono text-[11px] text-mute sm:px-8">
          Pricing figures are published list rates as reported for October 2026 and can change. Confirm them on each vendor page.
        </p>
      </div>
    </footer>
  )
}
