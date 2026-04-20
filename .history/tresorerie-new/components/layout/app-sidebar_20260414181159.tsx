'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { reconciliations } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'
import {
  LayoutDashboard,
  Settings,
  UserCheck,
  ClipboardList,
  Sliders,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { SecondarySidebar } from './secondary-sidebar'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badgeCount?: number
  badgeTone?: 'muted' | 'amber'
  hasSecondary?: boolean
}

interface IconProps {
  className?: string
}

function AlertsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 2L2 13H14L8 2Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5.5V8.5M8 10.5V11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function MultiDeviseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="5" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 5.5V10.5M11 5.5V10.5" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

function EbicsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <line x1="2" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1" />
      <circle cx="5" cy="9.5" r="1" fill="currentColor" />
      <circle cx="8" cy="9.5" r="1" fill="currentColor" />
      <circle cx="11" cy="9.5" r="1" fill="currentColor" />
    </svg>
  )
}

function SuiviComptesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="4" height="12" stroke="currentColor" strokeWidth="1.2" />
      <rect x="7" y="5" width="4" height="9" stroke="currentColor" strokeWidth="1.2" />
      <rect x="12" y="7" width="2" height="7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function FluxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 8H14M14 8L11 5M14 8L11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PrevisionIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <polyline points="2,11 5,7 8,9 14,2" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 2H14V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ReportingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 5H14M5 5V14M8 5V14M11 5V14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  )
}

function RapprochementIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M1.8 6H14.2M1.8 6L3.3 4.6M1.8 6L3.3 7.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2 10H1.8M14.2 10L12.7 8.6M14.2 10L12.7 11.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { validationQueue } = useApp()
  const [showSecondary, setShowSecondary] = useState(false)

  const isAdmin = user?.role === 'ADMIN_CLIENT' || user?.role === 'ADMIN_BANQUE'

  const rapprochementBadgeCount = reconciliations.filter(
    (reconciliation) =>
      reconciliation.status === 'SUGGESTION_EN_ATTENTE' ||
      reconciliation.status === 'ECART_DETECTE'
  ).length

  const pendingValidationCount = validationQueue.filter((item) => item.status === 'PENDING').length

  const isActive = (href: string) => {
    const path = href.split('?')[0]
    if (pathname === href) return true
    return pathname.startsWith(path) && path !== '/rapprochement-module'
  }

  // Menu pour les rôles Admin
  const adminNavItems: NavItem[] = [
    { label: 'Tableau de bord', href: '/rapprochement-module/admin', icon: LayoutDashboard },
    {
      label: 'File de validation',
      href: '/rapprochement-module/admin/validation',
      icon: ClipboardList,
      badgeCount: pendingValidationCount,
      badgeTone: 'amber',
    },
    { label: 'Configuration règles', href: '/rapprochement-module/admin/configuration', icon: Sliders },
    { label: 'Gestion utilisateurs', href: '/rapprochement-module/admin/utilisateurs', icon: UserCheck },
    { label: 'Paramètres', href: '/rapprochement-module/parametres', icon: Settings },
  ]

  // Menu pour TRESORIER - nouvelle structure sans Clients/Fournisseurs/Factures
  const tresorierNavItems: NavItem[] = [
    { label: 'Tableau de Bord', href: '/rapprochement-module/dashboard', icon: LayoutDashboard },
    { label: 'Suivi des Comptes', href: '/rapprochement-module/suivi-comptes', icon: SuiviComptesIcon },
    { label: 'Flux Déclarés', href: '/rapprochement-module/flux-declarés', icon: FluxIcon },
    { label: 'Prévision Trésorerie', href: '/rapprochement-module/prevision', icon: PrevisionIcon },
    {
      label: 'Rapprochement',
      href: '/rapprochement-module/rapprochement',
      icon: RapprochementIcon,
      badgeCount: rapprochementBadgeCount,
      badgeTone: 'amber',
      hasSecondary: true,
    },
    { label: 'Multi-devises', href: '/rapprochement-module/multi-devises', icon: MultiDeviseIcon },
    { label: 'Interface ERP/EBICS', href: '/rapprochement-module/erp-ebics', icon: EbicsIcon },
    { label: 'Alertes', href: '/rapprochement-module/alertes', icon: AlertsIcon },
    { label: 'Reporting', href: '/rapprochement-module/reporting', icon: ReportingIcon },
  ]

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <div
        key={item.href}
        onMouseEnter={() => item.hasSecondary && setShowSecondary(true)}
        onMouseLeave={() => item.hasSecondary && setShowSecondary(false)}
      >
        <Link
          href={item.href}
          className={cn(
            'group flex items-center justify-between border-l-[3px] px-4 py-2 text-sm transition-colors rounded-none',
            active
              ? 'border-l-[#3B6FD4] bg-[#1B2E5E] font-medium text-white'
              : 'border-l-transparent bg-transparent font-normal text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.9)]'
          )}
        >
          <span className="flex min-w-0 items-center gap-3">
            <Icon
              className={cn(
                'h-4 w-4 shrink-0 transition-opacity',
                active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
              )}
            />
            <span className="truncate">{item.label}</span>
          </span>

          <div className="flex items-center gap-2">
            {typeof item.badgeCount === 'number' && (
              <span
                className={cn(
                  'ml-2 min-w-5 rounded px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none',
                  item.badgeTone === 'amber'
                    ? 'bg-[#F59E0B]/20 text-[#FBBF24]'
                    : 'bg-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.78)]'
                )}
              >
                {item.badgeCount}
              </span>
            )}
            {item.hasSecondary && (
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  showSecondary ? 'rotate-0' : ''
                )}
              />
            )}
          </div>
        </Link>
      </div>
    )
  }

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-[#111E3F] text-white">
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#3B6FD4]">
              <span className="text-sm font-semibold">A</span>
            </div>
            <span className="text-sm font-semibold">Adria Treasury</span>
          </div>
        </div>

        <nav className="h-[calc(100vh-64px)] overflow-y-auto px-0 py-3">
          {isAdmin ? (
            adminNavItems.map((item, index) => (
              <div key={item.href}>
                {index > 0 && (
                  <div
                    className="mx-4 my-2 border-t"
                    style={{ borderTopWidth: '0.5px', borderColor: 'rgba(255,255,255,0.08)' }}
                  />
                )}
                {renderItem(item)}
              </div>
            ))
          ) : (
            tresorierNavItems.map((item, index) => (
              <div key={item.href}>
                {index > 0 && (
                  <div
                    className="mx-4 my-2 border-t"
                    style={{ borderTopWidth: '0.5px', borderColor: 'rgba(255,255,255,0.08)' }}
                  />
                )}
                {renderItem(item)}
              </div>
            ))
          )}
        </nav>
      </aside>

      {/* SecondarySidebar au survol de Rapprochement */}
      {showSecondary && <SecondarySidebar />}
    </>
  )
}
