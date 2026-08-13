'use client'

import { useEffect, useState } from 'react'
import { ShieldBan, ScanLine, Users, type LucideIcon } from 'lucide-react'
import { DonutChart } from '@/components/donut-chart'
import { ScanTable } from '@/components/scan-table'
import type { ScanRecord } from '@/lib/mock-data'
import { API_URL } from '@/lib/api'

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: string
  hint: string
  tone: 'primary' | 'safe' | 'danger'
}) {
  const toneClasses = {
    primary: 'bg-primary/15 text-primary ring-primary/30',
    safe: 'bg-safe/15 text-safe ring-safe/30',
    danger: 'bg-danger/15 text-danger ring-danger/30',
  }[tone]

  return (
    <div className="glass group rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span
          className={`flex size-11 items-center justify-center rounded-xl ring-1 ${toneClasses}`}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

export function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScanned: 0,
    threatsBlocked: 0,
    monthlyRatio: { phishing: 0, legitimate: 0 },
    globalHistory: [] as ScanRecord[]
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/admin/stats`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => {
        if (data && data.totalUsers !== undefined) {
          setStats(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const threatRatio = stats.totalScanned > 0 
    ? ((stats.threatsBlocked / stats.totalScanned) * 100).toFixed(1) 
    : "0.0"

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Beranda Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Metrik deteksi dan aktivitas sistem secara keseluruhan.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Pengguna"
          value={loading ? "..." : stats.totalUsers.toLocaleString()}
          hint="Terdaftar di database"
          tone="primary"
        />
        <StatCard
          icon={ScanLine}
          label="Total URL Ter-scan"
          value={loading ? "..." : stats.totalScanned.toLocaleString()}
          hint="Aktivitas global"
          tone="safe"
        />
        <StatCard
          icon={ShieldBan}
          label="Ancaman Diblokir"
          value={loading ? "..." : stats.threatsBlocked.toLocaleString()}
          hint={`${threatRatio}% dari semua scan`}
          tone="danger"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass rounded-2xl p-6 lg:col-span-1">
          <h2 className="text-base font-semibold">Rasio Deteksi</h2>
          <p className="mb-6 text-xs text-muted-foreground">Phishing vs Legitimate bulan ini</p>
          <div className="flex justify-center">
            <DonutChart
              phishing={stats.monthlyRatio.phishing}
              legitimate={stats.monthlyRatio.legitimate}
              size={140}
            />
          </div>
        </section>

        <section className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold">Aktivitas Global Terbaru</h2>
          <p className="mb-4 text-xs text-muted-foreground">Scan terakhir dari semua pengguna</p>
          <ScanTable records={stats.globalHistory} showUser />
        </section>
      </div>
    </div>
  )
}