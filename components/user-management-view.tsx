'use client'

import { useMemo, useState, useEffect } from 'react'
import { Search, UserPlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ManagedUser {
  id: string
  name: string
  email: string
  role: string
  scans: number
  status: 'Active' | 'Inactive'
}

export function UserManagementView() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/admin/users')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data)
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
    if (!q) return users
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    )
  }, [query, users])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola akun terdaftar, peran, dan aktivitas pemindaian.
          </p>
        </div>
        <Button className="font-semibold cursor-not-allowed opacity-50" title="Penambahan akun manual dinonaktifkan">
          <UserPlus className="size-4" />
          Tambah Pengguna
        </Button>
      </header>

      <section className="glass rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pengguna..."
              className="w-full rounded-xl border border-input bg-background/40 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Pengguna</th>
                <th className="px-4 py-3 font-medium">Peran</th>
                <th className="px-4 py-3 font-medium">Jml Scan</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-6 animate-spin" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border/60 transition-colors duration-150 hover:bg-accent/50"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/25 text-xs font-semibold text-primary-foreground ring-1 ring-primary/40 uppercase">
                          {u.name.slice(0, 2)}
                        </span>
                        <div className="min-w-0 leading-tight">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                          u.role === 'Admin'
                            ? 'bg-primary/15 text-primary ring-primary/30'
                            : 'bg-muted text-muted-foreground ring-border',
                        )}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-muted-foreground">{u.scans}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                          u.status === 'Active'
                            ? 'bg-safe/15 text-safe ring-safe/30'
                            : 'bg-danger/15 text-danger ring-danger/30',
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            u.status === 'Active' ? 'bg-safe' : 'bg-danger',
                          )}
                          aria-hidden="true"
                        />
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}