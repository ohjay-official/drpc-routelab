'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/benchmark', label: 'Benchmark' },
  { href: '/cost', label: 'Cost' },
  { href: '/configs', label: 'Configs' },
  { href: '/method', label: 'Method' },
]

export default function Header() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [path])

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-page items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2" aria-label="RouteLab home">
          <span className="text-lg font-semibold tracking-tight">RouteLab</span>
          <span className="hidden font-mono text-[11px] text-mute sm:inline">for dRPC</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm sm:flex" aria-label="Main">
          {NAV.map((n) => {
            const active = path === n.href
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={`border-b py-1 transition-colors ${active ? 'border-ink text-ink' : 'border-transparent text-mute hover:text-ink'}`}
              >
                {n.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          className="border border-ink px-3 py-2 font-mono text-xs sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-rule bg-paper sm:hidden" aria-label="Main">
          <ul>
            {NAV.map((n) => (
              <li key={n.href} className="border-b border-rule last:border-b-0">
                <Link
                  href={n.href}
                  aria-current={path === n.href ? 'page' : undefined}
                  className={`block px-5 py-4 text-lg ${path === n.href ? 'font-semibold' : ''}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
