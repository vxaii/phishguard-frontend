'use client'

import { useMemo, useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { ScanTable } from '@/components/scan-table'
import type { ScanRecord } from '@/lib/mock-data'
import { API_URL } from '@/lib/api'

export function UserHistoryView({ userId }: { userId?: number }) {
  const [query, setQuery] = useState('')
  const [userHistory, setUserHistory] = useState<ScanRecord[]>([])

  useEffect(() => {
    const queryStr = userId ? `?user_id=${userId}` : ''
    fetch(`${API_URL}/history${queryStr}`)
      .then(res => res.json())
      .then(data => {
        const mapped: ScanRecord[] = data.map((d: any) => ({
          id: d.id.toString(),
          url: d.url,
          prediction: d.prediction,
          probability: d.probability * 100,
          date: new Date(d.created_at).toLocaleDateString(),
          user: d.user_id ? d.user_id.toString() : 'Guest'
        }))
        setUserHistory(mapped)
      })
      .catch(err => console.error(err))
  }, [userId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return userHistory
    return userHistory.filter((r) => r.url.toLowerCase().includes(q))
  }, [query, userHistory])

  const phishingCount = userHistory.filter((r) => r.prediction === 'PHISHING').length

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Histori Saya</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {userHistory.length} total pemindaian &middot;{' '}
          <span className="text-danger">{phishingCount} phishing terdeteksi</span>
        </p>
      </header>

      <section className="glass rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari berdasarkan URL..."
              className="w-full rounded-xl border border-input bg-background/40 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>
        <ScanTable records={filtered} />
      </section>
    </div>
  )
}
