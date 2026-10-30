import { delay } from '@/lib/ui'

export default function PageHead({
  num,
  label,
  title,
  children,
}: {
  num: string
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-page px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-20">
        <p className="rise label-mono">
          {num} / {label}
        </p>
        <h1 className="rise mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl" style={delay('.08s')}>
          {title}
        </h1>
        <p className="rise mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg" style={delay('.16s')}>
          {children}
        </p>
      </div>
    </section>
  )
}
