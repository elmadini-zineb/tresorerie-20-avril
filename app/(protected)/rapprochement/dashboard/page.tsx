'use client'

import { AlertTriangle, Eye, ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react'
import { reconciliations, invoices, dashboardStats } from '@/lib/mock-data'
import { formatAmount } from '@/lib/format'
import Link from 'next/link'

const kpiCards = [
  { title: 'Factures en attente', value: dashboardStats.facturesEnAttente, trend: '+3 cette semaine' },
  { title: 'Rapprochees ce mois', value: dashboardStats.rapprocheesCeMois, trend: '+12 vs mois dernier' },
  { title: 'Ecarts detectes', value: dashboardStats.ecartsDetectes, trend: '-2 vs semaine derniere' },
  { title: 'TVA nette estimee', value: formatAmount(dashboardStats.tvaNette), isAmount: true, trend: 'T1 2026' },
]

const alerts = [
  { type: 'warning' as const, message: '3 factures bloquees depuis plus de 30 jours sans action', href: '/rapprochement/factures?type=recues', buttonText: 'Voir' },
  { type: 'error' as const, message: '2 ecarts detectes sans justification depuis plus de 7 jours', href: '/rapprochement/rapprochement', buttonText: 'Traiter' },
  { type: 'info' as const, message: '5 factures en attente de validation Admin', href: '/rapprochement/admin/validation', buttonText: 'Voir' },
]

export default function RapprochementDashboardPage() {
  const rapprochees = reconciliations.filter((r) => r.status === 'RAPPROCHEE').length
  const ecarts = reconciliations.filter((r) => r.status === 'ECART_DETECTE').length
  const nonRapprochees = reconciliations.filter((r) => r.status === 'NON_RAPPROCHEE').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1B2E5E]">Tableau de bord — Rapprochement</h1>
        <p className="text-sm text-[#64748B]">Periode : Mars 2026</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.title} className="rounded-xl border border-[#DDE3EF] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">{kpi.title}</p>
            <p className="mt-2 text-3xl font-semibold text-[#1B2E5E]">{kpi.value}</p>
            <p className="mt-2 text-xs text-[#94A3B8]">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-xl border border-[#DDE3EF] bg-white p-5">
          <CheckCircle className="h-8 w-8 text-green-600 shrink-0" />
          <div>
            <p className="text-2xl font-bold text-[#1B2E5E]">{rapprochees}</p>
            <p className="text-xs text-[#64748B]">Rapprochees</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-[#DDE3EF] bg-white p-5">
          <AlertTriangle className="h-8 w-8 text-amber-600 shrink-0" />
          <div>
            <p className="text-2xl font-bold text-[#1B2E5E]">{ecarts}</p>
            <p className="text-xs text-[#64748B]">Ecarts detectes</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-[#DDE3EF] bg-white p-5">
          <XCircle className="h-8 w-8 text-red-600 shrink-0" />
          <div>
            <p className="text-2xl font-bold text-[#1B2E5E]">{nonRapprochees}</p>
            <p className="text-xs text-[#64748B]">Non rapprochees</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1B2E5E]">Alertes</h2>
        {alerts.map((alert, index) => {
          const borderColor = alert.type === 'error' ? '#DC2626' : alert.type === 'warning' ? '#D97706' : '#3B6FD4'
          const bgColor = alert.type === 'error' ? 'bg-red-50' : alert.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
          const buttonStyle = alert.type === 'error' ? 'border-[#DC2626] text-[#DC2626] hover:bg-red-50' : alert.type === 'warning' ? 'border-[#D97706] text-[#D97706] hover:bg-amber-50' : 'border-[#3B6FD4] text-[#3B6FD4] hover:bg-blue-50'
          return (
            <div key={index} className={`flex items-center justify-between rounded-xl border-l-4 ${bgColor} p-4 shadow-sm`} style={{ borderLeftColor: borderColor }}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-4 w-4 shrink-0 ${alert.type === 'error' ? 'text-red-600' : alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} />
                <p className="text-sm text-[#1B2E5E]">{alert.message}</p>
              </div>
              <Link href={alert.href} className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${buttonStyle}`}>
                <ArrowRight className="h-3 w-3" />
                {alert.buttonText}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
