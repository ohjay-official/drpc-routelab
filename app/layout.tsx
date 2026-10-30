import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'dRPC RouteLab',
  description: 'Benchmark dRPC endpoints, simulate NodeCloud costs, and generate NodeCore + viem configs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
