'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Settings,
  ShieldCheck,
  Sliders,
  UserCheck,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const mainNav = [
  {
    name: 'Trésorerie',
    href: '/dashboard',
    icon: LayoutDashboard,
    role: ['TRESORIER', 'ADMIN_CLIENT'],
  },
  {
    name: 'Rapprochement',
    href: '/rapprochement-module/dashboard',
    icon: ArrowLeftRight,
    role: ['TRESORIER', 'ADMIN_CLIENT'],
  },
]

const adminNav = [
  {
    name: 'Validation',
    href: '/rapprochement-module/admin/validation',
    icon: ShieldCheck,
    role: ['ADMIN_CLIENT'],
  },
  {
    name: 'Configuration',
    href: '/rapprochement-module/admin/configuration',
    icon: Sliders,
    role: ['ADMIN_CLIENT'],
  },
  {
    name: 'Utilisateurs',
    href: '/rapprochement-module/admin/utilisateurs',
    icon: UserCheck,
    role: ['ADMIN_CLIENT'],
  },
]

const settingsNav = [
  {
    name: 'Paramètres',
    href: '/parametres',
    icon: Settings,
    role: ['TRESORIER', 'ADMIN_CLIENT'],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const getFilteredNav = (nav: any[]) =>
    nav.filter((item) => user && item.role.includes(user.role))

  const isModuleActive = (href: string) => {
    if (href === '/dashboard') {
      // Treasury module is active for /dashboard, /clients, /fournisseurs, /factures
      return ['/dashboard', '/clients', '/fournisseurs', '/factures'].some(p => pathname.startsWith(p)) && !pathname.startsWith('/rapprochement-module');
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center border-r border-gray-200 bg-white py-4">
      <div className="mb-6">
        <Link href="/dashboard">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            A
          </div>
        </Link>
      </div>
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-1 flex-col items-center gap-2">
          {getFilteredNav(mainNav).map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    isModuleActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-2">
          {getFilteredNav(adminNav).map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    pathname.startsWith(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {getFilteredNav(settingsNav).map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    pathname.startsWith(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </aside>
  )
}
