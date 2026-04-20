'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'

// Odoo-style simplified data - only 3 bars: Dû, Cette semaine, À venir
const clientsChartData = [
  { name: 'Dû', value: 190000 },
  { name: 'Cette semaine', value: 155000 },
  { name: 'À venir', value: 425000 },
]

const fournisseursChartData = [
  { name: 'Dû', value: 172000 },
  { name: 'Cette semaine', value: 130000 },
  { name: 'À venir', value: 345000 },
]

// Odoo-style compact stats
const clientsStats = [
  { label: 'À valider', count: 11, amount: 435543.65, href: '/factures?type=emises&status=a_valider' },
  { label: 'Non payé', count: 183, amount: 2450000, href: '/factures?type=emises&status=non_paye' },
  { label: 'En retard', count: 105, amount: 890000, href: '/factures?type=emises&status=en_retard', isAlert: true },
]

const fournisseursStats = [
  { label: 'À valider', count: 8, amount: 312450.00, href: '/factures?type=recues&status=a_valider' },
  { label: 'Non payé', count: 156, amount: 1980000, href: '/factures?type=recues&status=non_paye' },
  { label: 'En retard', count: 42, amount: 567000, href: '/factures?type=recues&status=en_retard', isAlert: true },
]

const barColors = ['#3B6FD4', '#16A34A', '#94A3B8']

const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toString()
}

const formatAmount = (value: number) => {
  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' MAD'
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#DDE3EF] bg-white p-3 shadow-lg">
        <p className="mb-1 font-medium text-[#1B2E5E]">{label}</p>
        <p className="text-sm text-[#64748B]">{formatAmount(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

interface StatItemProps {
  label: string
  count: number
  amount: number
  href: string
  isAlert?: boolean
}

function StatItem({ label, count, amount, href, isAlert }: StatItemProps) {
  return (
    <Link 
      href={href}
      className="block rounded-md p-2 transition-colors hover:bg-[#F4F6FB]"
    >
      <div className="flex items-baseline gap-2">
        <span className={cn(
          "text-lg font-bold",
          isAlert ? "text-[#DC2626]" : "text-[#1B2E5E]"
        )}>
          {count}
        </span>
        <span className="text-sm text-[#64748B]">{label}</span>
      </div>
      <div className={cn(
        "text-sm font-medium",
        isAlert ? "text-[#DC2626]" : "text-[#1B2E5E]"
      )}>
        {formatAmount(amount)}
      </div>
    </Link>
  )
}

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Factures Clients */}
      <Card className="border-[#DDE3EF] bg-white shadow-sm">
        <CardHeader className="border-b border-[#DDE3EF] pb-3">
          <CardTitle className="text-base font-semibold text-[#1B2E5E]">
            Factures Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-6">
            {/* Stats column */}
            <div className="w-48 space-y-1 border-r border-[#DDE3EF] pr-4">
              {clientsStats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>
            
            {/* Chart */}
            <div className="flex-1">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={clientsChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#DDE3EF" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      axisLine={{ stroke: '#DDE3EF' }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatYAxis}
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      {clientsChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-2 flex justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: barColors[0] }} />
                  <span className="text-xs text-[#64748B]">Dû</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: barColors[1] }} />
                  <span className="text-xs text-[#64748B]">Cette semaine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: barColors[2] }} />
                  <span className="text-xs text-[#64748B]">À venir</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factures Fournisseurs */}
      <Card className="border-[#DDE3EF] bg-white shadow-sm">
        <CardHeader className="border-b border-[#DDE3EF] pb-3">
          <CardTitle className="text-base font-semibold text-[#1B2E5E]">
            Factures Fournisseurs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-6">
            {/* Stats column */}
            <div className="w-48 space-y-1 border-r border-[#DDE3EF] pr-4">
              {fournisseursStats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>
            
            {/* Chart */}
            <div className="flex-1">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fournisseursChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#DDE3EF" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      axisLine={{ stroke: '#DDE3EF' }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatYAxis}
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      {fournisseursChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-2 flex justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: barColors[0] }} />
                  <span className="text-xs text-[#64748B]">Dû</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: barColors[1] }} />
                  <span className="text-xs text-[#64748B]">Cette semaine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: barColors[2] }} />
                  <span className="text-xs text-[#64748B]">À venir</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
