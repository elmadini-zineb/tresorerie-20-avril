'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  FolderOpen,
  FileText,
  BarChart3,
} from 'lucide-react'

interface SecondaryNavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface SecondaryNavSection {
  label: string
  items: SecondaryNavItem[]
}

const fournisseurIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M3.2 13C3.8 10.9 5.5 9.8 8 9.8C10.5 9.8 12.2 10.9 12.8 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const clientIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="11" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2.5 13C3 11.2 4.5 10.2 6.6 10.2C8.6 10.2 10.1 11.2 10.6 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9.2 13C9.5 11.9 10.5 11.2 12 11.2C13.5 11.2 14.4 11.9 14.7 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const factureRecueIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path d="M4 2.4H10.3L13 5.1V13.6H4V2.4Z" stroke="currentColor" strokeWidth="1.2" />
    <path d="M10 2.4V5.4H13" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6 7.1H10.8M6 9.2H9.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M1.8 11H6.2M1.8 11L3.2 9.6M1.8 11L3.2 12.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const factureEmiseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path d="M4 2.4H10.3L13 5.1V13.6H4V2.4Z" stroke="currentColor" strokeWidth="1.2" />
    <path d="M10 2.4V5.4H13" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6 7.1H10.8M6 9.2H9.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9.8 11H14.2M14.2 11L12.8 9.6M14.2 11L12.8 12.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const etatRapprochementIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <rect x="3" y="2.5" width="10" height="11" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5.2 5.2H10.8M5.2 7.6H10.8M5.2 10H8.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const cpcIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <rect x="2.5" y="2.5" width="11" height="11" stroke="currentColor" strokeWidth="1.2" />
    <rect x="4.5" y="9" width="1.8" height="3" fill="currentColor" />
    <rect x="7.1" y="7.2" width="1.8" height="4.8" fill="currentColor" />
    <rect x="9.7" y="5.6" width="1.8" height="6.4" fill="currentColor" />
  </svg>
)

const tvaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 8V5.6M8 8L10 9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5.6 2.7V4.2M10.4 2.7V4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const rapprochementIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path d="M1.8 6H14.2M1.8 6L3.3 4.6M1.8 6L3.3 7.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.2 10H1.8M14.2 10L12.7 8.6M14.2 10L12.7 11.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function SecondarySidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    const path = href.split('?')[0]
    return pathname === href || (pathname.startsWith(path) && path !== '/rapprochement-module')
  }

  const sections: SecondaryNavSection[] = [
    {
      label: 'TABLEAU DE BORD',
      items: [
        {
          label: 'Tableau de Bord',
          href: '/rapprochement-module/dashboard',
          icon: BarChart3,
        },
      ],
    },
    {
      label: 'RÉFÉRENTIELS',
      items: [
        {
          label: 'Fournisseurs',
          href: '/rapprochement-module/fournisseurs',
          icon: fournisseurIcon,
        },
        {
          label: 'Clients',
          href: '/rapprochement-module/clients',
          icon: clientIcon,
        },
      ],
    },
    {
      label: 'FACTURES',
      items: [
        {
          label: 'Factures Reçues',
          href: '/rapprochement-module/factures?type=recues',
          icon: factureRecueIcon,
        },
        {
          label: 'Factures Émises',
          href: '/rapprochement-module/factures?type=emises',
          icon: factureEmiseIcon,
        },
      ],
    },
    {
      label: '',
      items: [
        {
          label: 'Rapprochement',
          href: '/rapprochement-module/rapprochement',
          icon: rapprochementIcon,
        },
      ],
    },
    {
      label: 'RAPPORTS',
      items: [
        {
          label: 'État de Rapprochement',
          href: '/rapprochement-module/rapports/etat-rapprochement',
          icon: etatRapprochementIcon,
        },
        {
          label: 'CPC',
          href: '/rapprochement-module/rapports/cpc',
          icon: cpcIcon,
        },
        {
          label: 'Déclaration TVA',
          href: '/rapprochement-module/rapports/tva',
          icon: tvaIcon,
        },
      ],
    },
  ]

  const renderItem = (item: SecondaryNavItem) => {
    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-3 border-l-[3px] px-4 py-2 text-sm transition-colors rounded-none',
          active
            ? 'border-l-[#3B6FD4] bg-[#1B2E5E] font-medium text-white'
            : 'border-l-transparent bg-transparent font-normal text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.9)]'
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4 shrink-0 transition-opacity',
            active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
          )}
        />
        <span className="truncate">{item.label}</span>
      </Link>
    )
  }

  return (
    <aside className="fixed left-60 top-0 z-30 h-screen w-56 bg-[#111E3F] text-white overflow-y-auto border-r border-white/10">
      <nav className="h-full px-0 py-3 space-y-0">
        {sections.map((section, index) => (
          <div key={section.label || `section-${index}`}>
            {section.label && (
              <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
                {section.label}
              </div>
            )}
            <div className="space-y-0">
              {section.items.map((item) => (
                <div key={item.href} className="group">
                  {renderItem(item)}
                </div>
              ))}
            </div>
            {index < sections.length - 1 && (
              <div
                className="mx-4 my-2 border-t"
                style={{ borderTopWidth: '0.5px', borderColor: 'rgba(255,255,255,0.08)' }}
              />
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
