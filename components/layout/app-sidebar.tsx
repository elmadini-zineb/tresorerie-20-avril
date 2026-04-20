'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { reconciliations, invoices } from '@/lib/mock-data'
import {
  Building2,
  Users,
  FileText,
  UserCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from 'lucide-react'

function DashboardGridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

function RapprochementIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 4h5M2 8h5M2 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 4h5M9 8h5M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 6.5L8.5 8l-1 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const RAPROCHEMENT_KEY = 'tresorerie-rapprochement-sidebar-open'

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [rapOpen, setRapOpen] = useState(false)

  const ecartCount = reconciliations.filter((r) => r.status === 'ECART_DETECTE').length
  const pendingInvoices = invoices.filter((i) => i.status === 'EN_ATTENTE').length

  useEffect(() => {
    const saved = localStorage.getItem(RAPROCHEMENT_KEY)
    if (saved !== null) setRapOpen(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/rapprochement')) setRapOpen(true)
  }, [pathname])

  const toggleRap = (open: boolean) => {
    setRapOpen(open)
    localStorage.setItem(RAPROCHEMENT_KEY, JSON.stringify(open))
  }

  const isActive = (href: string) => {
    const path = href.split('?')[0]
    if (pathname === href) return true
    if (href.includes('?')) {
      const [key, value] = href.split('?')[1].split('=')
      return pathname === path && new URLSearchParams(window.location.search).get(key) === value
    }
    return pathname.startsWith(href) && href !== '/'
  }

  const isOnRap = pathname.startsWith('/rapprochement')

  // Sub-menu items by role
  const rapSubItems =
    user?.role === 'ADMIN_BANQUE'
      ? [
          { label: 'Vue d\'ensemble', href: '/rapprochement/dashboard' },
          { label: 'Rapprochement Bancaire', href: '/rapprochement/rapprochement' },
          { label: 'Fournisseurs', href: '/rapprochement/fournisseurs' },
          { label: 'Clients', href: '/rapprochement/clients' },
          { label: 'Factures Recues', href: '/rapprochement/factures?type=recues' },
          { label: 'Factures Emises', href: '/rapprochement/factures?type=emises' },
          { label: 'Etat de Rapprochement', href: '/rapprochement/rapports/etat-rapprochement' },
          { label: 'CPC', href: '/rapprochement/rapports/cpc' },
          { label: 'TVA', href: '/rapprochement/rapports/tva' },
          { label: 'Parametres', href: '/rapprochement/parametres' },
        ]
      : user?.role === 'ADMIN_CLIENT'
      ? [
          { label: 'Vue d\'ensemble', href: '/rapprochement/dashboard' },
          { label: 'Fournisseurs', href: '/rapprochement/fournisseurs' },
          { label: 'Clients', href: '/rapprochement/clients' },
          { label: 'Factures Recues', href: '/rapprochement/factures?type=recues' },
          { label: 'Factures Emises', href: '/rapprochement/factures?type=emises' },
        ]
      : []

  const adminItems =
    user?.role === 'ADMIN_BANQUE'
      ? [
          { label: 'Validation', href: '/rapprochement/admin/validation' },
          { label: 'Utilisateurs', href: '/rapprochement/admin/utilisateurs' },
          { label: 'Configuration', href: '/rapprochement/admin/configuration' },
        ]
      : user?.role === 'ADMIN_CLIENT'
      ? [{ label: 'Parametres', href: '/rapprochement/parametres' }]
      : []

  const renderSubLink = (item: { label: string; href: string }) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        'flex items-center border-l-[3px] py-2 pl-10 pr-4 text-[13px] transition-colors',
        isActive(item.href)
          ? 'border-l-[#3B6FD4] bg-[#1B2E5E] font-medium text-white'
          : 'border-l-transparent text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.85)]'
      )}
    >
      {item.label}
    </Link>
  )

  const renderLink = (href: string, label: string, Icon: React.ElementType, badge?: number, badgeTone?: 'amber' | 'muted') => {
    const active = isActive(href)
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          'group flex items-center justify-between border-l-[3px] px-4 py-2 text-sm transition-colors',
          active
            ? 'border-l-[#3B6FD4] bg-[#1B2E5E] font-medium text-white'
            : 'border-l-transparent text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.9)]'
        )}
      >
        <span className="flex items-center gap-3">
          <Icon className={cn('h-4 w-4 shrink-0', active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100')} />
          <span className="truncate">{label}</span>
        </span>
        {typeof badge === 'number' && badge > 0 && (
          <span className={cn('min-w-5 rounded px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none', badgeTone === 'amber' ? 'bg-[#F59E0B]/20 text-[#FBBF24]' : 'bg-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.78)]')}>
            {badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col bg-[#0F1E3C]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-[rgba(255,255,255,0.08)] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B6FD4]">
          <span className="text-sm font-bold text-white">A</span>
        </div>
        <span className="text-sm font-semibold text-white">Adria Treasury</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {renderLink('/dashboard', 'Tableau de bord', DashboardGridIcon)}

        <div className="mx-4 my-3 border-t border-[rgba(255,255,255,0.08)]" />

        {/* Rapprochement — hidden for TRESORIER */}
        {user?.role !== 'TRESORIER' && rapSubItems.length > 0 && (
          <>
            <button
              onClick={() => toggleRap(!rapOpen)}
              className={cn(
                'group w-full flex items-center justify-between border-l-[3px] px-4 py-2 text-sm transition-colors text-left',
                isOnRap
                  ? 'border-l-[#3B6FD4] bg-[#1B2E5E] font-medium text-white'
                  : 'border-l-transparent text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.9)]'
              )}
            >
              <span className="flex items-center gap-3">
                <RapprochementIcon className={cn('h-4 w-4 shrink-0', isOnRap ? 'opacity-100' : 'opacity-70 group-hover:opacity-100')} />
                <span className="truncate">Rapprochement</span>
              </span>
              <span className="flex items-center gap-1.5">
                {ecartCount > 0 && (
                  <span className="min-w-5 rounded bg-[#F59E0B]/20 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none text-[#FBBF24]">
                    {ecartCount}
                  </span>
                )}
                {rapOpen
                  ? <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  : <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                }
              </span>
            </button>

            {rapOpen && (
              <div className="py-1">
                {rapSubItems.map(renderSubLink)}
              </div>
            )}
          </>
        )}

        {/* TRESORIER basic items */}
        {user?.role === 'TRESORIER' && (
          <>
            <p className="px-4 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
              Referentiels
            </p>
            {renderLink('/rapprochement/fournisseurs', 'Fournisseurs', Building2)}
            {renderLink('/rapprochement/clients', 'Clients', Users)}
            <p className="px-4 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
              Factures
            </p>
            {renderLink('/rapprochement/factures?type=recues', 'Factures Recues', FileText, pendingInvoices, 'muted')}
            {renderLink('/rapprochement/factures?type=emises', 'Factures Emises', FileText)}
          </>
        )}

        {/* Admin section */}
        {adminItems.length > 0 && (
          <>
            <p className="px-4 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
              Administration
            </p>
            {adminItems.map((i) => renderLink(i.href, i.label, UserCheck))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-[rgba(255,255,255,0.08)] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B2E5E] text-xs font-semibold text-white">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{user?.name}</p>
            <p className="truncate text-[11px] text-[rgba(255,255,255,0.45)]">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Se deconnecter"
            className="shrink-0 rounded p-1 text-[rgba(255,255,255,0.4)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
