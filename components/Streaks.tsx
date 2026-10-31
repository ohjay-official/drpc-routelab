/** Slow diagonal light lines in the brand green, echoing dRPC's own banner. Decorative only. */
const LINES = [
  { top: '18%', t: 17, s: 0, o: 0.55 },
  { top: '46%', t: 23, s: -9, o: 0.35 },
  { top: '72%', t: 19, s: -4, o: 0.45 },
]
export default function Streaks() {
  return (
    <div className="streaks" aria-hidden="true">
      {LINES.map((l, i) => (
        <span key={i} className="streak" style={{ top: l.top, ['--t' as string]: `${l.t}s`, ['--s' as string]: `${l.s}s`, ['--o' as string]: l.o }} />
      ))}
    </div>
  )
}
