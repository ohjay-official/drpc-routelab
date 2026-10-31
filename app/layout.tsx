import './globals.css'
import type { Metadata, Viewport } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'

export const metadata: Metadata = {
  title: { default: 'RouteLab for dRPC', template: '%s | RouteLab' },
  description:
    'Benchmark dRPC endpoints from your browser, estimate NodeCloud costs against other providers, and generate NodeCore and viem configs.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f0f0ee',
}

// Runs before first paint: skips the preloader on repeat visits in the same session,
// and releases entrance animations after 6 seconds no matter what.
const boot = `try{var d=document.documentElement;if(sessionStorage.getItem('rl-seen')==='1'){d.dataset.seen='1';d.dataset.ready='1'}setTimeout(function(){d.dataset.ready='1'},6000)}catch(e){document.documentElement.dataset.ready='1'}`

const noscript = '<style>.preloader{display:none}.rise,.reveal{opacity:1;transform:none}</style>'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <noscript dangerouslySetInnerHTML={{ __html: noscript }} />
      </head>
      <body className="bg-[#f0f0ee] font-sans text-gray-900 antialiased">
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-[13px] focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
