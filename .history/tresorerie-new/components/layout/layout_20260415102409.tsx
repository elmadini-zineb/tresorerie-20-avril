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

  const showSecondarySidebar =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/clients') ||
    pathname.startsWith('/fournisseurs') ||
    pathname.startsWith('/factures') ||
    pathname.startsWith('/rapprochement-module')

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <AppSidebar />
      {showSecondarySidebar && <SecondarySidebar />}
      <AppHeader />
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${
          showSecondarySidebar ? 'ml-72' : 'ml-16'
        }`}
      >
        <div ref={contentRef} className="h-[calc(100vh-64px)] overflow-y-auto px-8 py-6">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
}
