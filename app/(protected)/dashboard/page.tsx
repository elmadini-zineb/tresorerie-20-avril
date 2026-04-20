'use client'

import { useAuth } from '@/lib/auth-context'
import { reconciliations, invoices, fournisseurs, clients, dashboardStats } from '@/lib/mock-data'
import { formatAmount } from '@/lib/format'
import { CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp, FileText } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const rapprochees = reconciliations.filter((r) => r.status === 'RAPPROCHEE').length
  const ecarts = reconciliations.filter((r) => r.status === 'ECART_DETECTE').length
  const nonRapprochees = reconciliations.filter((r) => r.status === 'NON_RAPPROCHEE').length
  const enAttente = invoices.filter((i) => i.status === 'EN_ATTENTE').length

  const cards = [
    { label: 'Factures en attente', value: enAttente, icon: Clock, color: 'text-[#64748B]', bg: 'bg-gray-100' },
    { label: 'Rapprochees ce mois', value: rapprochees, icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Ecarts detectes', value: ecarts, icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Non rapprochees', value: nonRapprochees, icon: XCircle, color: 'text-red-700', bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Tableau de bord</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Bienvenue, {user?.name} &mdash; {user?.role}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#DDE3EF] bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm text-[#64748B]">{card.label}</p>
              <span className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-[#1B2E5E]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Rapprochement access for admins */}
      {user?.role !== 'TRESORIER' && (
        <div className="rounded-xl border border-[#DDE3EF] bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-[#1B2E5E]">
            Derniers rapprochements
          </h2>
          <div className="divide-y divide-[#F4F6FB]">
            {reconciliations.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#1B2E5E]">{r.invoice.numero}</p>
                  <p className="text-xs text-[#64748B]">{r.invoice.tiersNom}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#1B2E5E]">
                    {formatAmount(r.invoice.montantTTC)}
                  </span>
                  <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                    r.status === 'RAPPROCHEE' ? 'bg-green-50 text-green-700' :
                    r.status === 'ECART_DETECTE' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {r.status === 'RAPPROCHEE' ? 'Rapprochee' : r.status === 'ECART_DETECTE' ? 'Ecart' : 'Non rapprochee'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#DDE3EF] bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-[#3B6FD4]" />
            <h2 className="text-sm font-semibold text-[#1B2E5E]">Fournisseurs actifs</h2>
          </div>
          <p className="text-3xl font-bold text-[#1B2E5E]">{fournisseurs.filter(f => f.statut === 'Actif').length}</p>
        </div>
        <div className="rounded-xl border border-[#DDE3EF] bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-[#3B6FD4]" />
            <h2 className="text-sm font-semibold text-[#1B2E5E]">Clients actifs</h2>
          </div>
          <p className="text-3xl font-bold text-[#1B2E5E]">{clients.filter(c => c.statut === 'Actif').length}</p>
        </div>
      </div>
    </div>
  )
}
