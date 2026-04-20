'use client'

import { AlertTriangle, Eye, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatAmount } from '@/lib/format'
import { dashboardStats } from '@/lib/mock-data'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import Link from 'next/link'

const kpiCards = [
  {
    title: 'Factures en attente',
    value: dashboardStats.facturesEnAttente,
    trend: '+3 cette semaine',
  },
  {
    title: 'Rapprochées ce mois',
    value: dashboardStats.rapprocheesCeMois,
    trend: '+12 vs mois dernier',
  },
  {
    title: 'Écarts détectés',
    value: dashboardStats.ecartsDetectes,
    trend: '-2 vs semaine dernière',
  },
  {
    title: 'TVA nette estimée',
    value: formatAmount(dashboardStats.tvaNette),
    isAmount: true,
    trend: 'T1 2026',
  },
]

const alerts = [
  {
    type: 'warning' as const,
    message: '3 factures bloquées depuis plus de 30 jours sans action',
    count: 3,
    href: '/rapprochement-module/factures?status=bloquee',
    buttonText: 'Voir',
  },
  {
    type: 'error' as const,
    message: '2 écarts détectés sans justification depuis plus de 7 jours',
    count: 2,
    href: '/rapprochement-module/rapprochement?status=ecart',
    buttonText: 'Traiter',
  },
  {
    type: 'info' as const,
    message: '5 factures en attente de validation Admin',
    count: 5,
    href: '/rapprochement-module/factures?status=attente_validation',
    buttonText: 'Voir',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#1B2E5E]">Tableau de bord</h1>
          <p className="text-sm text-[#64748B]">Période : Mars 2026</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} className="border border-gray-200 bg-white shadow-none">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-[#64748B]">{kpi.title}</p>
                <p className="mt-2 text-3xl font-semibold text-[#1B2E5E]">{kpi.value}</p>
                <p className="mt-2 text-xs font-normal text-[#94A3B8]">{kpi.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <DashboardCharts />

        {/* Alerts Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1B2E5E]">Alertes</h2>

          {alerts.map((alert, index) => {
            const borderColor = alert.type === 'error' ? '#DC2626' : alert.type === 'warning' ? '#D97706' : '#3B6FD4'
            const bgColor = alert.type === 'error' ? 'bg-[#DC2626]/5' : alert.type === 'warning' ? 'bg-[#D97706]/5' : 'bg-[#3B6FD4]/5'
            const buttonBorder = alert.type === 'error' ? 'border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/10' : 
                                 alert.type === 'warning' ? 'border-[#D97706] text-[#D97706] hover:bg-[#D97706]/10' : 
                                 'border-[#3B6FD4] text-[#3B6FD4] hover:bg-[#3B6FD4]/10'

            return (
              <Card key={index} className={`border-l-4 ${bgColor} shadow-sm`} style={{ borderLeftColor: borderColor }}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-[#D97706]" />
                    ) : alert.type === 'error' ? (
                      <div className="h-3 w-3 rounded-full bg-[#DC2626]" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-[#3B6FD4]" />
                    )}
                    <p className="text-sm text-[#1B2E5E]">{alert.message}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={buttonBorder}
                    asChild
                  >
                    <Link href={alert.href}>
                      {alert.type === 'error' ? (
                        <ArrowRight className="mr-2 h-4 w-4" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      {alert.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
    </div>
  )
}
