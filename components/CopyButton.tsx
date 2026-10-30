'use client'
import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className="btn btn-ghost !px-3 !py-1.5 !text-xs"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          setTimeout(() => setDone(false), 1500)
        } catch {}
      }}
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  )
}
