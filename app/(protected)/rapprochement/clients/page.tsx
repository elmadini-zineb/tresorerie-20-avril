'use client'

import { useState } from 'react'
import { Plus, Search, Pencil, Archive } from 'lucide-react'
import { clients as initialClients } from '@/lib/mock-data'
import type { Client } from '@/lib/types'
import { getStatusColor } from '@/lib/format'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState('')
  const [archiveTarget, setArchiveTarget] = useState<Client | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filtered = clients.filter((c) => c.raisonSociale.toLowerCase().includes(searchQuery.toLowerCase()) || c.ice.includes(searchQuery) || c.ville.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Clients</h1>
        <button className="flex items-center gap-2 rounded-lg bg-[#1B2E5E] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B2E5E]/90">
          <Plus className="h-4 w-4" /> Nouveau Client
        </button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full rounded-lg border border-[#DDE3EF] bg-white py-2 pl-10 pr-4 text-sm focus:border-[#3B6FD4] focus:outline-none" />
      </div>
      <div className="rounded-xl border border-[#DDE3EF] bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#DDE3EF] bg-[#F4F6FB]">
              {['Raison Sociale', 'ICE', 'Segment', 'Ville', 'Mode de paiement', 'Delai', 'Statut', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#1B2E5E]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0
              ? <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-[#64748B]">Aucun client.</td></tr>
              : paginated.map((c) => (
                <tr key={c.id} className="border-b border-[#DDE3EF] last:border-0 hover:bg-[#F4F6FB]">
                  <td className="px-4 py-3 font-medium text-[#1B2E5E]">{c.raisonSociale}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#64748B]">{c.ice}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{c.segment ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{c.ville}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{c.modePaiement}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{c.delaiPaiement}j</td>
                  <td className="px-4 py-3"><span className={cn('rounded-md px-2 py-1 text-xs font-medium', getStatusColor(c.statut))}>{c.statut}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="rounded p-1.5 text-[#64748B] hover:bg-[#F4F6FB] hover:text-[#1B2E5E]"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setArchiveTarget(c)} className="rounded p-1.5 text-[#64748B] hover:bg-[#F4F6FB] hover:text-[#DC2626]"><Archive className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-[#DDE3EF] px-4 py-3">
          <p className="text-sm text-[#64748B]">{paginated.length} / {filtered.length}</p>
          <div className="flex gap-2">
            <button disabled={safePage <= 1} onClick={() => setCurrentPage((p) => p - 1)} className="rounded border border-[#DDE3EF] px-3 py-1.5 text-sm disabled:opacity-40">Precedent</button>
            <button disabled={safePage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="rounded border border-[#DDE3EF] px-3 py-1.5 text-sm disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </div>
      {archiveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-xl border border-[#DDE3EF] bg-white p-6 shadow-xl w-96">
            <h3 className="mb-2 font-semibold text-[#1B2E5E]">Archiver</h3>
            <p className="mb-6 text-sm text-[#64748B]">Archiver <strong>{archiveTarget.raisonSociale}</strong> ?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setArchiveTarget(null)} className="rounded-lg border border-[#DDE3EF] px-4 py-2 text-sm">Annuler</button>
              <button onClick={() => { setClients((p) => p.map((c) => c.id === archiveTarget.id ? { ...c, statut: 'Inactif' } : c)); toast.success('Archive'); setArchiveTarget(null) }} className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-medium text-white">Archiver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
