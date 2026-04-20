'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { AppBreadcrumb } from './app-breadcrumb'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if already on login page
    if (pathname === '/login') return
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Redirect Admin Client to admin pages if they try to access trésorier pages
    if (user?.role === 'ADMIN_CLIENT' && !pathname.startsWith('/admin') && pathname !== '/parametres') {
      router.push('/admin')
      return
    }
  }, [isAuthenticated, user, pathname, router])

  // Don't show layout on login page
  if (pathname === '/login') {
    return <>{children}</>
  }

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3B6FD4] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-[#F4F6FB]">
      <AppSidebar />
      <AppHeader />
      <main className="ml-[240px] min-h-screen pt-16">
        <div className="h-[calc(100vh-64px)] overflow-y-auto px-8 py-6">
          <div className="mb-4">
            <AppBreadcrumb />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
