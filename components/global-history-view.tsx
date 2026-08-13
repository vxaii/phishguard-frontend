'use client'

import { useMemo, useState, useEffect } from 'react'
import { ListFilter, Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScanTable } from '@/components/scan-table'
import type { ScanRecord, Prediction } from '@/lib/mock-data'

type Filter = 'ALL' | Prediction

export function GlobalHistoryView() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('ALL')
  const [history, setHistory] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/admin/history')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return history.filter((r) => {
      const matchesQuery =
        !q || r.url.toLowerCase().includes(q) || (r.user ?? '').toLowerCase().includes(q)
      const matchesFilter = filter === 'ALL' || r.prediction === filter
      return matchesQuery && matchesFilter
    })
  }, [query, filter, history])

  const filters: Filter[] = ['ALL', 'PHISHING', 'LEGITIMATE']

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Histori Global</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Semua riwayat pemindaian URL dari seluruh pengguna.
        </p>
      </header>

      <section className="glass rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pengguna atau URL..."
              className="w-full rounded-xl border border-input bg-background/40 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-background/40 p-1">
            <ListFilter className="ml-1.5 size-4 text-muted-foreground" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (
          <ScanTable records={filtered} showUser />
        )}
      </section>
    </div>
  )
}