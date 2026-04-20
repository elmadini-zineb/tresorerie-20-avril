'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const pathLabels: Record<string, string> = {
  '': 'Tableau de bord',
  dashboard: 'Tableau de bord',
  fournisseurs: 'Fournisseurs',
  clients: 'Clients',
  factures: 'Factures',
  rapprochement: 'Rapprochement Bancaire',
  rapports: 'Rapports',
  cpc: 'CPC',
  tva: 'Déclaration TVA',
  'etat-rapprochement': 'État de Rapprochement',
  admin: 'Administration',
  configuration: 'Configuration des règles',
  validation: 'File de validation',
  utilisateurs: 'Gestion utilisateurs',
  nouveau: 'Nouveau',
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const { user } = useAuth()
  const segments = pathname.split('/').filter(Boolean)
  const isAdmin = user?.role === 'ADMIN_CLIENT' || user?.role === 'ADMIN_BANQUE'

  if (segments.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href={isAdmin ? '/admin' : '/dashboard'}
        className="flex items-center gap-1 text-[#64748B] transition-colors hover:text-[#1B2E5E]"
      >
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = pathLabels[segment] || segment

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-[#64748B]" />
            {isLast ? (
              <span className="font-medium text-[#1B2E5E]">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-[#64748B] transition-colors hover:text-[#1B2E5E]"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
