'use client'

import { useState } from 'react'
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
  const [userTab, setUserTab] = useState('detect')
  const [adminTab, setAdminTab] = useState('overview')

  if (!user) {
    return (
      <AuthView
        onAuth={(u) => {
          setUser(u)
          setUserTab('detect')
          setAdminTab('overview')
        }}
      />
    )
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
        onLogout={() => setUser(null)}
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
      onLogout={() => setUser(null)}
    >
      {userTab === 'detect' && <DetectView userId={user.id} />}
      {userTab === 'history' && <UserHistoryView userId={user.id} />}
      {userTab === 'model' && <ModelInfoView />}
    </DashboardShell>
  )
}
