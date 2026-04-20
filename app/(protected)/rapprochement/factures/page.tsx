'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Plus } from 'lucide-react'
import { invoices } from '@/lib/mock-data'
import { formatAmount, formatDate, getStatusColor, getStatusLabel, getSourceColor } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function FacturesPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') === 'emises' ? 'EMISE' : 'RECUE'
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = invoices
    .filter((i) => i.type === type)
    .filter((i) => !searchQuery || i.numero.toLowerCase().includes(searchQuery.toLowerCase()) || i.tiersNom.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((i) => statusFilter === 'all' || i.status === statusFilter)

  const title = type === 'RECUE' ? 'Factures Recues' : 'Factures Emises'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2E5E]">{title}</h1>
        <button className="flex items-center gap-2 rounded-lg bg-[#1B2E5E] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B2E5E]/90">
          <Plus className="h-4 w-4" /> Nouvelle Facture
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Numero, tiers..." className="w-full rounded-lg border border-[#DDE3EF] bg-white py-2 pl-10 pr-4 text-sm focus:border-[#3B6FD4] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#DDE3EF] bg-white px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none">
          <option value="all">Tous les statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="RAPPROCHE">Rapprochee</option>
          <option value="ECART_DETECTE">Ecart detecte</option>
          <option value="NON_RAPPROCHE">Non rapprochee</option>
          <option value="JUSTIFIE">Justifie</option>
        </select>
      </div>

      <div className="rounded-xl border border-[#DDE3EF] bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#DDE3EF] bg-[#F4F6FB]">
              {['Numero', 'Tiers', 'Date emission', 'Echeance', 'Montant TTC', 'Source', 'Statut'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#1B2E5E]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-[#64748B]">Aucune facture.</td></tr>
              : filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-[#DDE3EF] last:border-0 hover:bg-[#F4F6FB]">
                  <td className="px-4 py-3 font-mono text-sm font-medium text-[#1B2E5E]">{inv.numero}</td>
                  <td className="px-4 py-3 text-sm text-[#1B2E5E]">{inv.tiersNom}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{formatDate(inv.dateEmission)}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{formatDate(inv.dateEcheance)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#1B2E5E]">{formatAmount(inv.montantTTC)}</td>
                  <td className="px-4 py-3"><span className={cn('rounded-md px-2 py-1 text-xs font-medium', getSourceColor(inv.source))}>{inv.source}</span></td>
                  <td className="px-4 py-3"><span className={cn('rounded-md px-2 py-1 text-xs font-medium', getStatusColor(inv.status))}>{getStatusLabel(inv.status)}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-[#DDE3EF] px-4 py-3">
          <p className="text-sm text-[#64748B]">{filtered.length} facture(s)</p>
        </div>
      </div>
    </div>
  )
}
