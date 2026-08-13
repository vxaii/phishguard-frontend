import { cn } from '@/lib/utils'

/**
 * Circular confidence gauge rendered with SVG stroke-dasharray.
 */
export function ConfidenceGauge({
  value,
  tone,
  label = 'Confidence',
  size = 160,
}: {
  value: number // 0 - 100
  tone: 'danger' | 'safe'
  label?: string
  size?: number
}) {
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference - (clamped / 100) * circumference
  const color = tone === 'danger' ? 'var(--danger)' : 'var(--safe)'

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${clamped.toFixed(2)} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'text-2xl font-bold tabular-nums',
            tone === 'danger' ? 'text-danger' : 'text-safe',
          )}
        >
          {clamped.toFixed(2)}%
        </span>
        <span className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  )
}
