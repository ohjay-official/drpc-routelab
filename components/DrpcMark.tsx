/** dRPC's logo, from the file supplied for this project. Used only where dRPC itself is the subject. */
export default function DrpcMark({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/drpc-mark.png"
      alt=""
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size, borderRadius: '22%' }}
      draggable={false}
    />
  )
}
