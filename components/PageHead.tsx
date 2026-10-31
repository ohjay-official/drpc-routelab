import { delay } from '@/lib/ui'

export default function PageHead({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mx-auto max-w-page px-5 pb-8 pt-28 sm:px-8 sm:pb-12 sm:pt-36">
        <h1 className="rise max-w-2xl text-[1.75rem] font-medium leading-[1.12] tracking-tight text-gray-900 sm:text-[2.5rem]">{title}</h1>
        <p className="rise mt-3 max-w-xl text-[14px] leading-relaxed text-gray-500 sm:text-[15px]" style={delay('.1s')}>
          {children}
        </p>
      </div>
    </section>
  )
}
