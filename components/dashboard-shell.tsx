'use client'

import { useState, type ComponentType } from 'react'
import { LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavItem {
  key: string
  label: string
  icon: ComponentType<{ className?: string }>
}

export function DashboardShell({
  brand,
  portalLabel,
  navItems,
  activeKey,
  onNavigate,
  userName,
  userEmail,
  userInitials,
  onLogout,
  children,
}: {
  brand: string
  portalLabel: string
  navItems: NavItem[]
  activeKey: string
  onNavigate: (key: string) => void
  userName: string
  userEmail: string
  userInitials: string
  onLogout: () => void
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleNav(key: string) {
    onNavigate(key)
    setMobileOpen(false)
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2.5 px-2 py-4">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40">
          <ShieldCheck className="size-5 text-primary" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">{brand}</p>
          <p className="text-[11px] text-muted-foreground">{portalLabel}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.key === activeKey
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="size-4.5 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-2 pb-2">
        <div className="glass flex items-center gap-3 rounded-xl p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/25 text-xs font-semibold text-primary-foreground ring-1 ring-primary/40">
            {userInitials}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-[11px] text-muted-foreground">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="app-bg min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-[1500px]">
        {/* Desktop sidebar */}
        <aside className="glass sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r lg:flex">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <aside className="glass-strong absolute left-0 top-0 h-full w-72 border-r p-1">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 text-muted-foreground transition hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Navbar */}
          <header className="glass-strong sticky top-0 z-40 flex items-center gap-3 border-b px-4 py-3 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">
                Halo, {userName.split(' ')[0]}
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">{portalLabel}</p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full bg-safe/15 px-3 py-1 text-xs font-medium text-safe ring-1 ring-safe/30 sm:inline-flex">
                <span className="size-1.5 rounded-full bg-safe" />
                Model Online
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/25 text-xs font-semibold text-primary-foreground ring-1 ring-primary/40">
                {userInitials}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
