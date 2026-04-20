'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  ArrowLeftRight,
  BarChart3,
  Settings,
  UserCheck,
  ClipboardList,
  Sliders,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: { label: string; href: string }[]
}

const tresorierNavItems: NavItem[] = [
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Référentiels',
    href: '/referentiels',
    icon: Building2,
    children: [
      { label: 'Fournisseurs', href: '/fournisseurs' },
      { label: 'Clients', href: '/clients' },
    ],
  },
  {
    label: 'Factures',
    href: '/factures',
    icon: FileText,
    children: [
      { label: 'Factures Reçues', href: '/factures?type=recues' },
      { label: 'Factures Émises', href: '/factures?type=emises' },
    ],
  },
  { label: 'Rapprochement Bancaire', href: '/rapprochement', icon: ArrowLeftRight },
  {
    label: 'Rapports',
    href: '/rapports',
    icon: BarChart3,
    children: [
      { label: 'État de Rapprochement', href: '/rapports/etat-rapprochement' },
      { label: 'CPC', href: '/rapports/cpc' },
      { label: 'Déclaration TVA', href: '/rapports/tva' },
    ],
  },
]

const adminNavItems: NavItem[] = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { label: 'File de validation', href: '/admin/validation', icon: ClipboardList },
  { label: 'Configuration règles', href: '/admin/configuration', icon: Sliders },
  { label: 'Gestion utilisateurs', href: '/admin/utilisateurs', icon: UserCheck },
  { label: 'Paramètres', href: '/parametres', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const isAdmin = user?.role === 'ADMIN_CLIENT' || user?.role === 'ADMIN_BANQUE'
  const navItems = isAdmin ? adminNavItems : tresorierNavItems

  const isActive = (href: string, children?: { label: string; href: string }[]) => {
    const path = href.split('?')[0]
    if (pathname === href) return true
    if (href.includes('?')) {
      const query = href.split('?')[1]
      const [key, value] = query.split('=')
      return pathname === path && searchParams.get(key) === value
    }
    if (children) {
      return children.some((child) => isActive(child.href))
    }
    return pathname.startsWith(href) && href !== '/'
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] bg-[#111E3F] text-white">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#3B6FD4]">
              <span className="text-sm font-semibold">A</span>
            </div>
            <span className="text-sm font-semibold">Adria Treasury</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-64px)] overflow-y-auto px-0 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.children)
            const isSection = !!item.children

            if (item.children) {
              return (
                <div key={item.label} className="space-y-1">
                  <div className="px-4 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wide text-[#94A3B8] first:pt-0">
                    <span>{item.label}</span>
                  </div>
                  {item.children.map((child) => {
                    const childActive = isActive(child.href)
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block border-l-4 border-transparent px-4 py-2 text-sm font-normal transition-colors',
                          childActive
                            ? 'border-l-4 border-blue-400 bg-[#1B2E5E] text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )
            }

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'mx-2 flex items-center gap-3 border-l-4 border-transparent px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'border-l-4 border-blue-400 bg-[#1B2E5E] text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                  isSection && 'mt-2'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="bg-[#1B2E5E] text-white">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
