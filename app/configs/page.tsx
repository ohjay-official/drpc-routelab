import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import Generator from '@/components/Generator'

export const metadata: Metadata = {
  title: 'Config generator',
  description: 'Generate a NodeCore nodecore.yml, Docker commands, a quorum check and a viem fallback transport for dRPC.',
}

export default function ConfigsPage() {
  return (
    <>
      <PageHead num="03" label="Configs" title="NodeCore and viem configs">
        Choose the chains and an optional backup. The files below update as you change them and are ready to copy.
      </PageHead>
      <Generator />
    </>
  )
}
