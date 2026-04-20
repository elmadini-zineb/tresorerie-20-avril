'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { reconciliations, invoices as allInvoices } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'
import {
  LayoutDashboard,
  Settings,
  UserCheck,
  ClipboardList,
  Sliders,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badgeCount?: number
  badgeTone?: 'muted' | 'amber'
}

interface NavItemWithSubmenu extends NavItem {
  submenu?: NavItem[]
  submenuOpen?: boolean
}

interface NavSection {
  label: string
  items: NavItemWithSubmenu[]
}

interface IconProps {
  className?: string
}

function DashboardGridIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="10" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10" y="10" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function FournisseurIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.2 13C3.8 10.9 5.5 9.8 8 9.8C10.5 9.8 12.2 10.9 12.8 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ClientsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 13C3 11.2 4.5 10.2 6.6 10.2C8.6 10.2 10.1 11.2 10.6 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9.2 13C9.5 11.9 10.5 11.2 12 11.2C13.5 11.2 14.4 11.9 14.7 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function FactureRecueIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M4 2.4H10.3L13 5.1V13.6H4V2.4Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 2.4V5.4H13" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 7.1H10.8M6 9.2H9.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M1.8 11H6.2M1.8 11L3.2 9.6M1.8 11L3.2 12.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FactureEmiseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M4 2.4H10.3L13 5.1V13.6H4V2.4Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 2.4V5.4H13" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 7.1H10.8M6 9.2H9.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9.8 11H14.2M14.2 11L12.8 9.6M14.2 11L12.8 12.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

function EtatRapprochementIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="2.5" width="10" height="11" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.2 5.2H10.8M5.2 7.6H10.8M5.2 10H8.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function CpcIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="2.5" y="2.5" width="11" height="11" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4.5" y="9" width="1.8" height="3" fill="currentColor" />
      <rect x="7.1" y="7.2" width="1.8" height="4.8" fill="currentColor" />
      <rect x="9.7" y="5.6" width="1.8" height="6.4" fill="currentColor" />
    </svg>
  )
}

function TvaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 8V5.6M8 8L10 9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.6 2.7V4.2M10.4 2.7V4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { invoices, validationQueue } = useApp()
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null)

  const isAdmin = user?.role === 'ADMIN_CLIENT' || user?.role === 'ADMIN_BANQUE'

  const pendingRecuesCount = invoices.filter(
    (invoice) => invoice.type === 'RECUE' && invoice.status === 'EN_ATTENTE'
  ).length

  // Calcul du badge Rapprochement: SUGGESTION_EN_ATTENTE + ECART_DETECTE
  const rapprochementBadgeCount = reconciliations.filter(
    (reconciliation) => 
      reconciliation.status === 'SUGGESTION_EN_ATTENTE' || 
      reconciliation.status === 'ECART_DETECTE'
  ).length

  const pendingValidationCount = validationQueue.filter((item) => item.status === 'PENDING').length

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

  const tresorierBlocks: Array<{ type: 'item'; item: NavItem } | { type: 'section'; section: NavSection }> = [
    {
      type: 'item',
      item: { label: 'Tableau de bord', href: '/rapprochement-module/dashboard', icon: DashboardGridIcon },
    },
    {
      type: 'section',
      section: {
        label: 'Référentiels',
        items: [
          { label: 'Fournisseurs', href: '/rapprochement-module/fournisseurs', icon: FournisseurIcon },
          { label: 'Clients', href: '/rapprochement-module/clients', icon: ClientsIcon },
        ],
      },
    },
    {
      type: 'section',
      section: {
        label: 'Factures',
        items: [
          {
            label: 'Factures Reçues',
            href: '/rapprochement-module/factures?type=recues',
            icon: FactureRecueIcon,
            badgeCount: pendingRecuesCount,
            badgeTone: 'muted',
          },
          {
            label: 'Factures Émises',
            href: '/rapprochement-module/factures?type=emises',
            icon: FactureEmiseIcon,
          },
        ],
      },
    },
    {
      type: 'item',
      item: {
        label: 'Rapprochement',
        href: '/rapprochement-module/rapprochement',
        icon: RapprochementIcon,
        badgeCount: rapprochementBadgeCount,
        badgeTone: 'amber',
        submenu: [
          {
            label: 'Tableau de rapprochement',
            href: '/rapprochement-module/rapprochement',
            icon: RapprochementIcon,
          },
          {
            label: 'État de Rapprochement',
            href: '/rapprochement-module/rapports/etat-rapprochement',
            icon: EtatRapprochementIcon,
          },
        ],
      },
    },
    {
      type: 'section',
      section: {
        label: 'Rapports',
        items: [
          {
            label: 'État de Rapprochement',
            href: '/rapprochement-module/rapports/etat-rapprochement',
            icon: EtatRapprochementIcon,
          },
          { label: 'CPC', href: '/rapprochement-module/rapports/cpc', icon: CpcIcon },
          { label: 'Déclaration TVA', href: '/rapprochement-module/rapports/tva', icon: TvaIcon },
        ],
      },
    },
  ]

  const isActive = (href: string) => {
    const path = href.split('?')[0]
    if (pathname === href) return true
    if (href.includes('?')) {
      const query = href.split('?')[1]
      const [key, value] = query.split('=')
      return pathname === path && searchParams.get(key) === value
    }
    return pathname.startsWith(path) && path !== '/rapprochement-module'
  }

  const renderItem = (item: NavItemWithSubmenu, compact = false) => {
    const active = isActive(item.href)
    const Icon = item.icon
    const isSubmenuOpen = submenuOpen === item.label

    return (
      <div key={item.href}>
        <div
          className={cn(
            'group flex items-center justify-between border-l-[3px] px-4 py-2 text-sm transition-colors rounded-none',
            item.submenu ? 'cursor-pointer' : '',
            compact ? 'mx-0' : 'mx-0',
            active
              ? 'border-l-[#3B6FD4] bg-[#1B2E5E] font-medium text-white'
              : 'border-l-transparent bg-transparent font-normal text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.9)]'
          )}
          onClick={() => item.submenu && setSubmenuOpen(isSubmenuOpen ? null : item.label)}
          onMouseEnter={() => item.submenu && setSubmenuOpen(item.label)}
          onMouseLeave={() => item.submenu && setSubmenuOpen(null)}
        >
          {item.submenu ? (
            <>
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
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isSubmenuOpen ? 'rotate-180' : ''
                  )}
                />
              </div>
            </>
          ) : (
            <>
              <span className="flex min-w-0 items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-opacity',
                    active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </span>

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
            </>
          )}
        </div>

        {/* Submenu */}
        {item.submenu && isSubmenuOpen && (
          <div className="bg-[rgba(255,255,255,0.02)]">
            {item.submenu.map((subitem) => {
              const subitemActive = isActive(subitem.href)
              const SubIcon = subitem.icon

              return (
                <Link
                  key={subitem.href}
                  href={subitem.href}
                  className={cn(
                    'group flex items-center justify-between border-l-[3px] px-4 py-2 pl-12 text-sm transition-colors rounded-none',
                    subitemActive
                      ? 'border-l-[#3B6FD4] bg-[rgba(59, 111, 212, 0.1)] font-medium text-white'
                      : 'border-l-transparent bg-transparent font-normal text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[rgba(255,255,255,0.8)]'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <SubIcon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-opacity',
                        subitemActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
                      )}
                    />
                    <span className="truncate text-xs">{subitem.label}</span>
                  </span>

                  {typeof subitem.badgeCount === 'number' && (
                    <span
                      className={cn(
                        'ml-2 min-w-5 rounded px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none',
                        subitem.badgeTone === 'amber'
                          ? 'bg-[#F59E0B]/20 text-[#FBBF24]'
                          : 'bg-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.78)]'
                      )}
                    >
                      {subitem.badgeCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
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
          tresorierBlocks.map((block, index) => (
            <div key={block.type === 'item' ? block.item.href : block.section.label}>
              {index > 0 && (
                <div
                  className="mx-4 my-2 border-t"
                  style={{ borderTopWidth: '0.5px', borderColor: 'rgba(255,255,255,0.08)' }}
                />
              )}

              {block.type === 'item' ? (
                renderItem(block.item)
              ) : (
                <div>
                  <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
                    {block.section.label}
                  </div>
                  {block.section.items.map((item) => renderItem(item, true))}
                </div>
              )}
            </div>
          ))
        )}
      </nav>
    </aside>
  )
}
