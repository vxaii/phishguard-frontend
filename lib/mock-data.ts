export type Prediction = 'PHISHING' | 'LEGITIMATE'

export interface ScanRecord {
  id: string
  url: string
  prediction: Prediction
  probability: number // 0 - 100
  date: string
  user?: string
}

export interface ManagedUser {
  id: string
  name: string
  email: string
  role: 'User' | 'Admin'
  scans: number
  status: 'Active' | 'Suspended'
  joined: string
}

export const userHistory: ScanRecord[] = [
  {
    id: 'u1',
    url: 'https://secure-paypa1-login.com/verify',
    prediction: 'PHISHING',
    probability: 99.68,
    date: '2026-07-19 14:02',
  },
  {
    id: 'u2',
    url: 'https://github.com/vercel/next.js',
    prediction: 'LEGITIMATE',
    probability: 98.12,
    date: '2026-07-19 11:47',
  },
  {
    id: 'u3',
    url: 'http://bca-klikbca-update.net/login',
    prediction: 'PHISHING',
    probability: 97.35,
    date: '2026-07-18 20:15',
  },
  {
    id: 'u4',
    url: 'https://www.tokopedia.com/promo',
    prediction: 'LEGITIMATE',
    probability: 96.4,
    date: '2026-07-18 09:31',
  },
  {
    id: 'u5',
    url: 'https://appleid-support-verify.info',
    prediction: 'PHISHING',
    probability: 94.88,
    date: '2026-07-17 16:58',
  },
]

export const globalHistory: ScanRecord[] = [
  {
    id: 'g1',
    user: 'viki@mail.com',
    url: 'https://secure-paypa1-login.com/verify',
    prediction: 'PHISHING',
    probability: 99.68,
    date: '2026-07-19 14:02',
  },
  {
    id: 'g2',
    user: 'dewi@mail.com',
    url: 'https://mybca.bca.co.id/authentication',
    prediction: 'LEGITIMATE',
    probability: 98.9,
    date: '2026-07-19 13:44',
  },
  {
    id: 'g3',
    user: 'arif@mail.com',
    url: 'http://free-steam-wallet-code.ru/gift',
    prediction: 'PHISHING',
    probability: 99.21,
    date: '2026-07-19 12:20',
  },
  {
    id: 'g4',
    user: 'sarah@mail.com',
    url: 'https://www.netflix.com/browse',
    prediction: 'LEGITIMATE',
    probability: 97.75,
    date: '2026-07-19 10:05',
  },
  {
    id: 'g5',
    user: 'budi@mail.com',
    url: 'http://account-google-verify.xyz/reset',
    prediction: 'PHISHING',
    probability: 96.53,
    date: '2026-07-19 08:51',
  },
  {
    id: 'g6',
    user: 'rina@mail.com',
    url: 'https://dashboard.stripe.com/payments',
    prediction: 'LEGITIMATE',
    probability: 99.02,
    date: '2026-07-18 22:37',
  },
  {
    id: 'g7',
    user: 'joko@mail.com',
    url: 'http://shopee-flashsale-login.top/win',
    prediction: 'PHISHING',
    probability: 98.44,
    date: '2026-07-18 19:12',
  },
]

export const managedUsers: ManagedUser[] = [
  {
    id: 'm1',
    name: 'Viki Ananda',
    email: 'viki@mail.com',
    role: 'User',
    scans: 128,
    status: 'Active',
    joined: '2026-01-14',
  },
  {
    id: 'm2',
    name: 'Dewi Lestari',
    email: 'dewi@mail.com',
    role: 'User',
    scans: 87,
    status: 'Active',
    joined: '2026-02-03',
  },
  {
    id: 'm3',
    name: 'Arif Rahman',
    email: 'arif@mail.com',
    role: 'User',
    scans: 54,
    status: 'Suspended',
    joined: '2026-02-19',
  },
  {
    id: 'm4',
    name: 'Sarah Wijaya',
    email: 'sarah@mail.com',
    role: 'Admin',
    scans: 342,
    status: 'Active',
    joined: '2025-11-28',
  },
  {
    id: 'm5',
    name: 'Budi Santoso',
    email: 'budi@mail.com',
    role: 'User',
    scans: 19,
    status: 'Active',
    joined: '2026-03-11',
  },
]

export const adminStats = {
  totalUsers: 1284,
  totalScanned: 48210,
  threatsBlocked: 9137,
}

export const monthlyRatio = {
  phishing: 9137,
  legitimate: 39073,
}

export const modelMetrics = {
  accuracy: 95.16,
  f1: 95.18,
  recall: 95.38,
}

/**
 * Deterministic mock classifier so the demo feels responsive without a backend.
 */
export function mockClassify(url: string): { prediction: Prediction; probability: number } {
  const suspicious = [
    'login',
    'verify',
    'secure',
    'update',
    'account',
    'gift',
    'free',
    'win',
    'bonus',
    'reset',
    '-',
    'xyz',
    'top',
    'info',
    'ru',
  ]
  const lower = url.toLowerCase()
  let score = 0
  for (const term of suspicious) {
    if (lower.includes(term)) score += 1
  }
  if (!lower.startsWith('https')) score += 2
  if (lower.length > 45) score += 1

  const isPhishing = score >= 3
  // Confidence scales with how strong the signal is.
  const base = isPhishing ? 88 + Math.min(score * 1.6, 11.5) : 92 + Math.min((6 - score) * 1.1, 7)
  const probability = Math.min(99.9, Number(base.toFixed(2)))

  return { prediction: isPhishing ? 'PHISHING' : 'LEGITIMATE', probability }
}
