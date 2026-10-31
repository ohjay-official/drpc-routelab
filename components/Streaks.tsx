/** Slow diagonal light lines in dRPC green, echoing its own banner. Decorative, kept to the empty upper area. */
const LINES = [
  { top: '12%', t: 19, s: 0, o: 0.5 },
  { top: '26%', t: 25, s: -11, o: 0.32 },
  { top: '39%', t: 21, s: -5, o: 0.4 },
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
