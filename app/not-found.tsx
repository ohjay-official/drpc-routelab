import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-page px-5 pb-24 pt-36 sm:px-8 sm:pb-32 sm:pt-44">
      <h1 className="max-w-xl text-[1.75rem] font-medium leading-[1.12] tracking-tight text-gray-900 sm:text-[2.5rem]">This page does not exist.</h1>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-gray-500">The link may be old or mistyped. These pages do exist:</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Home</Link>
        <Link href="/benchmark" className="btn btn-ghost">Benchmark</Link>
        <Link href="/cost" className="btn btn-ghost">Cost</Link>
        <Link href="/configs" className="btn btn-ghost">Configs</Link>
      </div>
    </section>
  )
}
