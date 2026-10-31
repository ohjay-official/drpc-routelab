'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const NAV = [
  { href: '/benchmark', label: 'Benchmark' },
  { href: '/cost', label: 'Cost' },
  { href: '/configs', label: 'Configs' },
  { href: '/method', label: 'Method' },
]

export default function Header() {
  const path = usePathname()
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <nav className="flex items-center justify-center gap-2 px-4 pt-4 sm:gap-3 sm:px-8 sm:pt-6" aria-label="Main">
        <Link
          href="/"
          aria-label="RouteLab home"
          className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
          style={{ backgroundColor: '#EDEDED' }}
        >
          <Logo />
        </Link>
        <div
          className="pointer-events-auto flex items-center gap-4 rounded-xl px-4 py-2.5 sm:gap-10 sm:px-8 sm:py-3"
          style={{ backgroundColor: '#EDEDED' }}
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path === n.href ? 'page' : undefined}
              className={`text-[12px] font-medium transition-colors duration-200 hover:text-gray-900 sm:text-[14px] ${path === n.href ? 'text-gray-900' : 'text-gray-700'}`}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
