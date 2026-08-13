import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Prediction } from '@/lib/mock-data'

export function PredictionBadge({
  prediction,
  size = 'sm',
  className,
}: {
  prediction: Prediction
  size?: 'sm' | 'lg'
  className?: string
}) {
  const isPhishing = prediction === 'PHISHING'
  const Icon = isPhishing ? ShieldAlert : ShieldCheck

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm',
        isPhishing
          ? 'bg-danger/15 text-danger ring-1 ring-danger/40'
          : 'bg-safe/15 text-safe ring-1 ring-safe/40',
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'size-3.5' : 'size-4'} aria-hidden="true" />
      {prediction}
    </span>
  )
}
