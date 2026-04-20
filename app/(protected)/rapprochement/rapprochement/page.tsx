'use client'

import { useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react'
import { reconciliations, additionalReconciliations } from '@/lib/mock-data'
import { formatAmount, formatDate, getScoreColor, getScoreBgClass } from '@/lib/format'
import type { Reconciliation } from '@/lib/types'
import { cn } from '@/lib/utils'

const allRecos = [...reconciliations, ...additionalReconciliations]

function StatusBadge({ status }: { status: Reconciliation['status'] }) {
  if (status === 'RAPPROCHEE') return <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700"><CheckCircle className="h-3 w-3" />Rapprochee</span>
  if (status === 'ECART_DETECTE') return <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700"><AlertTriangle className="h-3 w-3" />Ecart detecte</span>
  return <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700"><XCircle className="h-3 w-3" />Non rapprochee</span>
}

export default function RapprochementBancairePage() {
  const [recos, setRecos] = useState(allRecos)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [justifications, setJustifications] = useState<Record<string, string>>({})

  const filtered = recos
    .filter((r) => !searchQuery || r.invoice.numero.toLowerCase().includes(searchQuery.toLowerCase()) || r.invoice.tiersNom.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)

  const rapprochees = recos.filter((r) => r.status === 'RAPPROCHEE').length
  const ecarts = recos.filter((r) => r.status === 'ECART_DETECTE').length
  const nonRapprochees = recos.filter((r) => r.status === 'NON_RAPPROCHEE').length

  const handleJustify = (id: string) => {
    const text = justifications[id] ?? ''
    if (!text.trim()) return
    setRecos((prev) => prev.map((r) => r.id === id ? { ...r, justification: text, status: 'RAPPROCHEE' } : r))
    setJustifications((prev) => { const next = { ...prev }; delete next[id]; return next })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Rapprochement Bancaire</h1>
        <p className="text-sm text-[#64748B]">Analyse et rapprochement des factures avec les mouvements bancaires</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-[#DDE3EF] bg-white p-4">
          <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
          <div><p className="text-2xl font-bold text-[#1B2E5E]">{rapprochees}</p><p className="text-xs text-[#64748B]">Rapprochees</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#DDE3EF] bg-white p-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
          <div><p className="text-2xl font-bold text-[#1B2E5E]">{ecarts}</p><p className="text-xs text-[#64748B]">Ecarts</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#DDE3EF] bg-white p-4">
          <XCircle className="h-6 w-6 text-red-600 shrink-0" />
          <div><p className="text-2xl font-bold text-[#1B2E5E]">{nonRapprochees}</p><p className="text-xs text-[#64748B]">Non rapprochees</p></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Numero ou tiers..." className="w-full rounded-lg border border-[#DDE3EF] bg-white py-2 pl-10 pr-4 text-sm focus:border-[#3B6FD4] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#DDE3EF] bg-white px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none">
          <option value="all">Tous</option>
          <option value="RAPPROCHEE">Rapprochee</option>
          <option value="ECART_DETECTE">Ecart detecte</option>
          <option value="NON_RAPPROCHEE">Non rapprochee</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-xl border border-[#DDE3EF] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-medium text-[#1B2E5E]">{r.invoice.numero}</span>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-sm text-[#64748B]">{r.invoice.tiersNom}</p>
                <p className="text-xs text-[#94A3B8]">{formatDate(r.invoice.dateEmission)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-[#1B2E5E]">{formatAmount(r.invoice.montantTTC)}</p>
                {r.mouvement && (
                  <p className="text-xs text-[#64748B]">Mvt: {formatAmount(r.mouvement.montant)}</p>
                )}
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className={cn('h-2 w-16 rounded-full bg-gray-200 overflow-hidden')}>
                    <div className="h-full rounded-full" style={{ width: `${r.score.total}%`, backgroundColor: getScoreColor(r.score.total) }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: getScoreColor(r.score.total) }}>{r.score.total}%</span>
                </div>
              </div>
            </div>

            {r.status === 'ECART_DETECTE' && (
              <div className="mt-3 border-t border-[#F4F6FB] pt-3">
                <p className="mb-2 text-xs font-medium text-amber-700">Justification requise</p>
                <div className="flex gap-2">
                  <input
                    value={justifications[r.id] ?? ''}
                    onChange={(e) => setJustifications((p) => ({ ...p, [r.id]: e.target.value }))}
                    placeholder="Saisir la justification..."
                    className="flex-1 rounded-lg border border-[#DDE3EF] px-3 py-1.5 text-sm focus:border-[#3B6FD4] focus:outline-none"
                  />
                  <button onClick={() => handleJustify(r.id)} className="rounded-lg bg-[#1B2E5E] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1B2E5E]/90">
                    Justifier
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[#DDE3EF] bg-white p-12 text-center text-sm text-[#64748B]">
            Aucun rapprochement correspondant.
          </div>
        )}
      </div>
    </div>
  )
}
