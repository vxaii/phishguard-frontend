'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/lib/api'

export interface User {
  id: number
  email: string
  role: 'user' | 'admin'
}

export function AuthView({ onAuth }: { onAuth: (user: User) => void }) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    if (mode === 'register' && password.length < 6) {
      setErrorMsg('Kata sandi minimal harus 6 karakter!')
      setLoading(false)
      return
    }

    const endpoint = mode === 'signin' ? '/login' : '/register'

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Autentikasi gagal')
      }

      const role = data.email.startsWith('admin') ? 'admin' : 'user'
      onAuth({ id: data.id, email: data.email, role })
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-bg flex min-h-dvh items-center justify-center p-4 sm:p-6">
      <div className="glass-strong grid w-full max-w-5xl overflow-hidden rounded-3xl lg:grid-cols-2">
        <section className="relative hidden min-h-[560px] flex-col justify-between overflow-hidden p-10 lg:flex">
          <Image
            src="/images/auth-cyber.png"
            alt="Ilustrasi keamanan siber abstrak AI dengan perisai digital bersinar dan jaringan saraf"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 0px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/20" />
          <div className="relative flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40 backdrop-blur">
              <ShieldCheck className="size-5 text-primary-foreground" />
            </span>
            <span className="text-lg font-semibold tracking-tight">PhishGuard</span>
          </div>
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-foreground/90 ring-1 ring-primary/30">
              <Sparkles className="size-3.5" />
              Deteksi Bertenaga CNN-LSTM
            </div>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight">
              Hentikan phishing sebelum mencapai pengguna Anda.
            </h2>
            <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Klasifikasi URL secara real-time. Analisis tautan apa pun dan dapatkan hasil deteksi instan yang akurat.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40">
              <ShieldCheck className="size-5 text-primary" />
            </span>
            <span className="text-lg font-semibold tracking-tight">PhishGuard</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            {mode === 'signin' ? 'Selamat Datang Kembali' : 'Buat Akun Anda'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === 'signin'
              ? 'Masuk untuk melanjutkan ke dashboard Anda.'
              : 'Mulai mengklasifikasi URL dalam hitungan detik.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger border border-danger/20">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anda@contoh.com"
                  className="w-full rounded-xl border border-input bg-background/40 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Kata Sandi
                </label>
                {mode === 'register' && (
                  <span className="text-xs text-muted-foreground">Minimal 6 karakter</span>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={mode === 'register' ? 6 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-background/40 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full text-sm font-semibold">
              {loading ? (
                <><Loader2 className="mr-2 size-4 animate-spin" /> Mohon tunggu...</>
              ) : mode === 'signin' ? 'Masuk' : 'Daftar Akun'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'signin' ? "Belum punya akun? " : 'Sudah mendaftar? '}
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === 'signin' ? 'register' : 'signin'))
                setErrorMsg('')
              }}
              className="font-semibold text-primary underline-offset-4 transition hover:underline"
            >
              {mode === 'signin' ? 'Buat Akun' : 'Masuk'}
            </button>
          </p>

        </section>
      </div>
    </main>
  )
}