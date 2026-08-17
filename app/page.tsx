'use client'

import { useState, useEffect } from 'react'
import {
  History,
  Info,
  LayoutDashboard,
  ScanSearch,
  Users,
} from 'lucide-react'
import { AuthView, type User } from '@/components/auth-view'
import { DashboardShell, type NavItem } from '@/components/dashboard-shell'
import { DetectView } from '@/components/detect-view'
import { UserHistoryView } from '@/components/user-history-view'
import { ModelInfoView } from '@/components/model-info-view'
import { AdminOverview } from '@/components/admin-overview'
import { GlobalHistoryView } from '@/components/global-history-view'
import { UserManagementView } from '@/components/user-management-view'

const userNav: NavItem[] = [
  { key: 'detect', label: 'Deteksi URL', icon: ScanSearch },
  { key: 'history', label: 'Histori Saya', icon: History },
  { key: 'model', label: 'Tentang Model', icon: Info },
]

const adminNav: NavItem[] = [
  { key: 'overview', label: 'Beranda Admin', icon: LayoutDashboard },
  { key: 'global', label: 'Histori Global', icon: History },
  { key: 'users', label: 'Manajemen Pengguna', icon: Users },
  { key: 'model', label: 'Informasi Model', icon: Info },
]

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [userTab, setUserTab] = useState('detect')
  const [adminTab, setAdminTab] = useState('overview')

  // Load session from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('phishguard_user')
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load user session', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const handleAuth = (u: User) => {
    setUser(u)
    try {
      localStorage.setItem('phishguard_user', JSON.stringify(u))
    } catch (e) {
      console.error('Failed to save user session', e)
    }
    setUserTab('detect')
    setAdminTab('overview')
  }

  const handleLogout = () => {
    setUser(null)
    try {
      localStorage.removeItem('phishguard_user')
    } catch (e) {
      console.error('Failed to remove user session', e)
    }
  }

  if (!isLoaded) {
    return (
      <main className="app-bg flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    )
  }

  if (!user) {
    return <AuthView onAuth={handleAuth} />
  }

  if (user.role === 'admin') {
    return (
      <DashboardShell
        brand="PhishGuard"
        portalLabel="Admin Portal"
        navItems={adminNav}
        activeKey={adminTab}
        onNavigate={setAdminTab}
        userName="Admin User"
        userEmail={user.email}
        userInitials={user.email.substring(0, 2).toUpperCase()}
        onLogout={handleLogout}
      >
        {adminTab === 'overview' && <AdminOverview />}
        {adminTab === 'global' && <GlobalHistoryView />}
        {adminTab === 'users' && <UserManagementView />}
        {adminTab === 'model' && <ModelInfoView />}
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      brand="PhishGuard"
      portalLabel="Dashboard Pengguna"
      navItems={userNav}
      activeKey={userTab}
      onNavigate={setUserTab}
      userName="Pengguna"
      userEmail={user.email}
      userInitials={user.email.substring(0, 2).toUpperCase()}
      onLogout={handleLogout}
    >
      {userTab === 'detect' && <DetectView userId={user.id} />}
      {userTab === 'history' && <UserHistoryView userId={user.id} />}
      {userTab === 'model' && <ModelInfoView />}
    </DashboardShell>
  )
}
