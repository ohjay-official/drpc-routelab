import PageHead from './PageHead'

export function LegalPage({
  num,
  label,
  title,
  intro,
  children,
}: {
  num: string
  label: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <>
      <PageHead num={num} label={label} title={title}>
        {intro}
      </PageHead>
      <div className="mx-auto max-w-page px-5 py-12 sm:px-8">
        <div className="max-w-2xl space-y-10 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:mt-3 [&_p]:text-mute [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-accent [&_li]:mt-2 [&_li]:text-mute [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </>
  )
}
