import type { CSSProperties } from 'react'

/** Sets the animation delay used by the .rise and .reveal classes. */
export const delay = (s: string) => ({ '--d': s }) as CSSProperties
