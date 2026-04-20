'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { invoices } from '@/lib/mock-data'
import {
  LayoutDashboard,
  Settings,
  UserCheck,
  ClipboardList,
  Sliders,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { InvoiceStatus } from '@/lib/types'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badgeCount?: number
  badgeTone?: 'muted' | 'amber'
  isExpandable?: boolean
}

interface NavSection {
  label: string
  items: NavItem[]
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
  const [rapprochementOpen, setRapprochementOpen] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('rapprochement-sidebar-open')
    if (savedState !== null) {
      setRapprochementOpen(JSON.parse(savedState))
    }
  }, [])

  // Auto-expand when navigating to rapprochement paths
  useEffect(() => {
    if (pathname.startsWith('/rapprochement')) {
      setRapprochementOpen(true)
    }
  }, [pathname])

  // Save sidebar state to localStorage
  const handleRapprochementOpenChange = (open: boolean) => {
    setRapprochementOpen(open)
    localStorage.setItem('rapprochement-sidebar-open', JSON.stringify(open))
  }

  const isAdmin = user?.role === 'ADMIN_CLIENT' || user?.role === 'ADMIN_BANQUE'

  const pendingRecuesCount = invoices.filter(
    (invoice) => invoice.type === 'RECUE' && invoice.status === 'EN_ATTENTE'
  ).length

  const ecartDetecteCount = invoices.filter(
    (invoice) => invoice.status === ('ECART_DETECTE' as InvoiceStatus)
  ).length

  const tresorierBlocks: Array<{ type: 'item'; item: NavItem } | { type: 'section'; section: NavSection }> = [
    {
      type: 'item',
      item: { label: 'Tableau de bord', href: '/dashboard', icon: DashboardGridIcon },
    },
    {
      type: 'section',
      section: {
        label: 'Référentiels',
        items: [
          { label: 'Fournisseurs', href: '/fournisseurs', icon: FournisseurIcon },
          { label: 'Clients', href: '/clients', icon: ClientsIcon },
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
            href: '/factures?type=recues',
            icon: FactureRecueIcon,
            badgeCount: pendingRecuesCount,
            badgeTone: 'muted',
          },
          {
            label: 'Factures Émises',
            href: '/factures?type=emises',
            icon: FactureEmiseIcon,
          },
        ],
      },
    },
    // Only ADMIN users can see Rapprochement
    ...(user?.role !== 'TRESORIER'
      ? [
          {
            type: 'item' as const,
            item: {
              label: 'Rapprochement',
              href: '/rapprochement',
              icon: RapprochementIcon,
              badgeCount: ecartDetecteCount,
              badgeTone: 'amber' as const,
              isExpandable: true,
            },
          },
        ]
      : []),
    {
      type: 'section',
      section: {
        label: 'Rapports',
        items: [
          {
            label: 'État de Rapprochement',
            href: '/rapports/etat-rapprochement',
            icon: EtatRapprochementIcon,
          },
          { label: 'CPC', href: '/rapports/cpc', icon: CpcIcon },
          { label: 'Déclaration TVA', href: '/rapports/tva', icon: TvaIcon },
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
    return pathname.startsWith(href) && href !== '/'
  }

  const renderRapprochementSubItems = () => {
    // Only ADMIN_BANQUE can see sub-items
    if (user?.role !== 'ADMIN_BANQUE') {
      return null
    }

    const subItems = [
      { label: 'Détails de Rapprochement', href: '/rapprochement/details' },
      { label: 'Historique', href: '/rapprochement/historique' },
    ]

    return subItems.map((item) => {
      const active = isActive(item.href)
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'ml-3 block border-l-[3px] px-4 py-2 text-sm transition-colors rounded-none',
            active
              ? 'border-l-[#3B6FD4] bg-[#1B2E5E] font-medium text-white'
              : 'border-l-transparent bg-transparent font-normal text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[rgba(255,255,255,0.8)]'
          )}
        >
          <span className="truncate">{item.label}</span>
        </Link>
      )
    })
  }

  const renderItem = (item: NavItem, compact = false) => {
    if (item.isExpandable) {
      return (
        <Collapsible key={item.href} open={rapprochementOpen} onOpenChange={handleRapprochementOpenChange}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'w-full group flex items-center justify-between border-l-[3px] px-4 py-2 text-sm transition-colors rounded-none text-left',
                rapprochementOpen
                  ? 'border-l-[#3B6FD4] bg-[#1B2E5E] font-medium text-white'
                  : 'border-l-transparent bg-transparent font-normal text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.9)]'
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <item.icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-opacity',
                    rapprochementOpen ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </span>

              <span className="flex items-center gap-2">
                {typeof item.badgeCount === 'number' && (
                  <span
                    className={cn(
                      'min-w-5 rounded px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none',
                      item.badgeTone === 'amber'
                        ? 'bg-[#F59E0B]/20 text-[#FBBF24]'
                        : 'bg-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.78)]'
                    )}
                  >
                    {item.badgeCount}
                  </span>
                )}
                {rapprochementOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
              </span>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 px-0 py-1">
            {renderRapprochementSubItems()}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'group flex items-center justify-between border-l-[3px] px-4 py-2 text-sm transition-colors rounded-none',
          compact ? 'mx-0' : 'mx-0',
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
      </Link>
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
