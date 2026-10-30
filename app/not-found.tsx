import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-page px-5 py-24 sm:px-8 sm:py-32">
      <p className="label-mono">404</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">This page does not exist.</h1>
      <p className="mt-5 max-w-md leading-relaxed text-mute">The link may be old or mistyped. These pages do exist:</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Home</Link>
        <Link href="/benchmark" className="btn btn-ghost">Benchmark</Link>
        <Link href="/cost" className="btn btn-ghost">Cost</Link>
        <Link href="/configs" className="btn btn-ghost">Configs</Link>
      </div>
    </section>
  )
}
