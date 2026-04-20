'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AppSidebar } from './app-sidebar'
import { SecondarySidebar } from './secondary-sidebar'
import { AppHeader } from './app-header'
import { Toaster } from '@/components/ui/sonner'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  if (pathname === '/login' || pathname === '/rapprochement-module/login') {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  // Le SecondarySidebar est désormais fixed et géré par le Sidebar principal

  return (
    <div className="flex h-screen bg-gray-50/90">
      <AppSidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto p-8 pt-20"
        >
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
