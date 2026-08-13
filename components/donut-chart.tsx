/**
 * Two-segment donut chart (phishing vs legitimate) rendered with SVG arcs.
 */
export function DonutChart({
  phishing,
  legitimate,
  size = 200,
}: {
  phishing: number
  legitimate: number
  size?: number
}) {
  const total = phishing + legitimate || 1
  const stroke = 22
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  const phishFraction = phishing / total
  const legitFraction = legitimate / total

  const phishDash = phishFraction * circumference
  const legitDash = legitFraction * circumference

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Legitimate segment (drawn first, full base) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--safe)"
            strokeWidth={stroke}
            strokeDasharray={`${legitDash} ${circumference - legitDash}`}
            strokeDashoffset={-phishDash}
          />
          {/* Phishing segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--danger)"
            strokeWidth={stroke}
            strokeDasharray={`${phishDash} ${circumference - phishDash}`}
            strokeDashoffset={0}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums">
            {(phishFraction * 100).toFixed(1)}%
          </span>
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Phishing
          </span>
        </div>
      </div>

      <ul className="w-full max-w-[180px] space-y-3 text-sm">
        <li className="flex items-center gap-2.5">
          <span className="size-3 rounded-full bg-danger" aria-hidden="true" />
          <span className="text-muted-foreground">Phishing</span>
          <span className="ml-auto font-semibold tabular-nums">
            {phishing.toLocaleString()}
          </span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="size-3 rounded-full bg-safe" aria-hidden="true" />
          <span className="text-muted-foreground">Legitimate</span>
          <span className="ml-auto font-semibold tabular-nums">
            {legitimate.toLocaleString()}
          </span>
        </li>
      </ul>
    </div>
  )
}
