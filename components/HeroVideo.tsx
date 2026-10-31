'use client'
import { useEffect, useRef } from 'react'

const SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4'

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  // People who ask their device for reduced motion get a paused first frame instead of a looping video.
  useEffect(() => {
    const v = ref.current
    if (!v || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      if (mq.matches) v.pause()
      else v.play().catch(() => {})
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={SRC} type="video/mp4" />
    </video>
  )
}
