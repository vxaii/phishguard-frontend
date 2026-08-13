import { PredictionBadge } from '@/components/prediction-badge'
import type { ScanRecord } from '@/lib/mock-data'

export function ScanTable({
  records,
  showUser = false,
}: {
  records: ScanRecord[]
  showUser?: boolean
}) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
        No scans match your search.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            {showUser && <th className="px-4 py-3 font-medium">User</th>}
            <th className="px-4 py-3 font-medium">URL</th>
            <th className="px-4 py-3 font-medium">Prediction</th>
            <th className="px-4 py-3 font-medium">Probability</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr
              key={r.id}
              className="border-b border-border/60 transition-colors duration-150 hover:bg-accent/50"
            >
              {showUser && (
                <td className="whitespace-nowrap px-4 py-3.5 font-medium">{r.user}</td>
              )}
              <td className="max-w-[280px] truncate px-4 py-3.5 font-mono text-xs text-foreground/90">
                {r.url}
              </td>
              <td className="px-4 py-3.5">
                <PredictionBadge prediction={r.prediction} />
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className={
                        r.prediction === 'PHISHING'
                          ? 'h-full rounded-full bg-danger'
                          : 'h-full rounded-full bg-safe'
                      }
                      style={{ width: `${r.probability}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-muted-foreground">
                    {r.probability.toFixed(2)}%
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                {r.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
