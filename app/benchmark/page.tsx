import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import Benchmarker from '@/components/Benchmarker'

export const metadata: Metadata = {
  title: 'Latency benchmark',
  description: 'Time real JSON-RPC calls to dRPC public endpoints and your own routes, with a failover verdict and head lag check.',
}

export default function BenchmarkPage() {
  return (
    <>
      <PageHead num="01" label="Benchmark" title="Latency and failover check">
        Time real calls to dRPC&rsquo;s public nodes and to your own routes. Set a latency threshold and see whether your primary
        would hold or hand over to the backup.
      </PageHead>
      <Benchmarker />
    </>
  )
}
