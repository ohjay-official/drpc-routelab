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
      <PageHead title="NodeCloud cost simulator">
        dRPC prices by request, not by method. Alchemy weights cost by method, and QuickNode and Ankr price by plan or credit. Pick a workload, a monthly volume and a peak RPS.
      </PageHead>
      <CostSim />
    </>
  )
}
