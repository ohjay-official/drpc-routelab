import PageHead from './PageHead'

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <>
      <PageHead title={title}>{intro}</PageHead>
      <div className="mx-auto max-w-page px-5 pb-8 pt-4 sm:px-8">
        <div className="max-w-2xl space-y-10 [&_a]:text-blue-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-600 [&_h2]:text-[1.125rem] [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-gray-900 [&_li]:mt-2 [&_p]:mt-3 [&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:text-gray-500 [&_li]:text-[14px] [&_li]:leading-relaxed [&_li]:text-gray-500 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </>
  )
}
