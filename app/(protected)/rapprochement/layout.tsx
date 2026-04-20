'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RapprochementLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role === 'TRESORIER') {
      router.replace('/dashboard')
    }
  }, [user, router])

  if (!user || user.role === 'TRESORIER') return null

  return <>{children}</>
}
