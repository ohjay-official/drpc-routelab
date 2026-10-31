// dRPC's logo, drawn as vector from the logo file supplied for this project.
// Used only where dRPC itself is the subject. Pieces: left bar, top bar, bottom bar.
const BRIGHT = '#4dff88'
const LIGHT = '#41e278'
const DARK = '#35b05d'

const PIECES: { pts: string; fill: string }[] = [
  { pts: '191,333 298,271 298,641 191,703', fill: LIGHT },
  { pts: '298,271 405,333 405,703 298,641', fill: DARK },
  { pts: '191,703 298,641 405,703 298,765', fill: BRIGHT },
  { pts: '405,209 512,147 512,270 405,332', fill: BRIGHT },
  { pts: '512,147 833,333 833,456 512,270', fill: LIGHT },
  { pts: '405,332 512,270 833,456 726,518', fill: DARK },
  { pts: '405,703 726,518 726,641 405,826', fill: LIGHT },
  { pts: '405,826 726,641 833,703 512,888', fill: DARK },
  { pts: '726,518 833,580 833,703 726,641', fill: BRIGHT },
]

type Props = {
  size?: number
  /** Dark rounded tile behind the mark, like dRPC's own avatar. */
  tile?: boolean
  /** Builds the mark piece by piece. Skipped for people who prefer reduced motion. */
  build?: boolean
  className?: string
}

export default function DrpcMark({ size = 20, tile = false, build = false, className = '' }: Props) {
  const glyph = (
    <g>
      {PIECES.map((p, i) => (
        <polygon
          key={i}
          points={p.pts}
          fill={p.fill}
          stroke={p.fill}
          strokeWidth={1.5}
          strokeLinejoin="round"
          className={build ? 'mark-piece' : undefined}
          style={build ? ({ '--i': i } as React.CSSProperties) : undefined}
        />
      ))}
    </g>
  )
  if (tile) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
        <rect width="100" height="100" rx="22" fill="#161616" />
        <svg x="20" y="18" width="60" height="64" viewBox="185 141 654 753">{glyph}</svg>
      </svg>
    )
  }
  return (
    <svg width={size} height={Math.round((size * 753) / 654)} viewBox="185 141 654 753" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      {glyph}
    </svg>
  )
}
