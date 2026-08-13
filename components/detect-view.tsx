'use client'

import { useState, useEffect } from 'react'
import { Link2, Loader2, ScanSearch, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfidenceGauge } from '@/components/confidence-gauge'
import { PredictionBadge } from '@/components/prediction-badge'
import { ScanTable } from '@/components/scan-table'
import type { Prediction, ScanRecord } from '@/lib/mock-data'

interface Result {
  url: string
  prediction: Prediction
  probability: number
}

export function DetectView({ userId }: { userId?: number }) {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([])

  const fetchRecent = () => {
    const queryStr = userId ? `?user_id=${userId}` : ''
    fetch(`http://localhost:8000/history${queryStr}`)
      .then(res => res.json())
      .then(data => {
        const mapped: ScanRecord[] = data.slice(0, 5).map((d: any) => ({
          id: d.id.toString(),
          url: d.url,
          prediction: d.prediction,
          probability: d.probability * 100,
          date: new Date(d.created_at).toLocaleDateString(),
          user: d.user_id ? d.user_id.toString() : 'Guest'
        }))
        setRecentScans(mapped)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchRecent()
  }, [userId])

  async function handleClassify(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim() || scanning) return
    setScanning(true)
    setResult(null)
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim(), user_id: userId }),
      })
      
      if (!response.ok) throw new Error('Network response was not ok')
      
      const data = await response.json()
      
      setResult({
        url: data.url,
        prediction: data.label.toUpperCase() as Prediction,
        probability: data.probability * 100
      })
      
      // Refresh table after new scan
      fetchRecent()
    } catch (error) {
      console.error('Error classifying URL:', error)
    } finally {
      setScanning(false)
    }
  }

  const isPhishing = result?.prediction === 'PHISHING'

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-foreground/90 ring-1 ring-primary/30">
          <ScanSearch className="size-3.5" />
          URL Threat Analysis
        </div>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Deteksi URL Phishing
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">
          Tempelkan sebuah tautan dan model CNN-LSTM kami akan mengklasifikasikannya
          secara instan.
        </p>
      </header>

      <form onSubmit={handleClassify} className="glass rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Masukkan alamat URL (contoh: https://mybca.bca.co.id...)"
              className="w-full rounded-xl border border-input bg-background/40 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={scanning || !url.trim()}
            className="h-[52px] px-8 text-sm font-semibold"
          >
            {scanning ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Menganalisis...
              </>
            ) : (
              'Klasifikasi'
            )}
          </Button>
        </div>
      </form>

      {result && (
        <section
          className={`glass-strong overflow-hidden rounded-2xl border-l-4 ${
            isPhishing ? 'border-l-danger' : 'border-l-safe'
          }`}
        >
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-4">
              <PredictionBadge prediction={result.prediction} size="lg" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Analyzed URL
                </p>
                <p className="mt-1 flex items-center gap-2 break-all font-mono text-sm text-foreground/90">
                  <Link2 className="size-4 shrink-0 text-muted-foreground" />
                  {result.url}
                </p>
              </div>
              <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                {isPhishing
                  ? 'Tautan ini menunjukkan karakteristik phishing yang kuat. Jangan memasukkan kredensial atau informasi pribadi apa pun.'
                  : 'Tautan ini tampak aman berdasarkan analisis model. Tetap berhati-hati saat membagikan data sensitif.'}
              </p>
            </div>
            <div className="flex items-center justify-center md:pl-6">
              <ConfidenceGauge
                value={result.probability}
                tone={isPhishing ? 'danger' : 'safe'}
              />
            </div>
          </div>
        </section>
      )}

      {recentScans.length > 0 && (
        <section className="glass rounded-2xl p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Riwayat Terbaru</h2>
              <p className="text-xs text-muted-foreground">Pemindaian terakhir Anda</p>
            </div>
          </div>
          <ScanTable records={recentScans} />
        </section>
      )}
    </div>
  )
}
