import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import CostSim from '@/components/CostSim'

export const metadata: Metadata = {
  title: 'Cost simulator',
  description: 'Estimate monthly cost on dRPC NodeCloud against Alchemy, QuickNode and Ankr for your request volume and workload.',
}

export default function CostPage() {
  return (
    <>
      <PageHead num="02" label="Cost" title="NodeCloud cost simulator">
        dRPC bills a flat 20 compute units per request on any method. Other providers weight cost by method, so the same traffic
        can price very differently. Pick a workload and a volume.
      </PageHead>
      <CostSim />
    </>
  )
}
