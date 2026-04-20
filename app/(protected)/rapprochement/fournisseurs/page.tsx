'use client'

import { useState } from 'react'
import { Plus, Search, Pencil, Archive } from 'lucide-react'
import { fournisseurs as initialFournisseurs } from '@/lib/mock-data'
import type { Fournisseur } from '@/lib/types'
import { getStatusColor } from '@/lib/format'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function FournisseurForm({ fournisseur, onSave, onCancel }: { fournisseur: Fournisseur | null; onSave: (f: Fournisseur) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<Fournisseur>>(fournisseur ?? { pays: 'Maroc', modePaiement: 'Virement', tauxTvaDefaut: 20, delaiPaiement: 30, statut: 'Actif' })
  const set = (key: keyof Fournisseur, value: unknown) => setForm((p) => ({ ...p, [key]: value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2E5E]">{fournisseur ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</h1>
        <button onClick={onCancel} className="rounded-lg border border-[#DDE3EF] px-4 py-2 text-sm text-[#64748B] hover:bg-[#F4F6FB]">Annuler</button>
      </div>
      <div className="rounded-xl border border-[#DDE3EF] bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Raison Sociale', key: 'raisonSociale' as const },
            { label: 'ICE', key: 'ice' as const },
            { label: 'Identifiant Fiscal', key: 'identifiantFiscal' as const },
            { label: 'RC', key: 'rc' as const },
            { label: 'Adresse', key: 'adresse' as const },
            { label: 'Ville', key: 'ville' as const },
            { label: 'RIB', key: 'rib' as const },
            { label: 'Email Facturation', key: 'emailFacturation' as const },
          ].map(({ label, key }) => (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-medium text-[#1B2E5E]">{label}</label>
              <input value={(form[key] as string) ?? ''} onChange={(e) => set(key, e.target.value)} className="w-full rounded-lg border border-[#DDE3EF] px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none" />
            </div>
          ))}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1B2E5E]">Mode de paiement</label>
            <select value={form.modePaiement} onChange={(e) => set('modePaiement', e.target.value)} className="w-full rounded-lg border border-[#DDE3EF] px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none">
              {['Virement', 'Cheque', 'Especes', 'Prelevement'].map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1B2E5E]">TVA Defaut (%)</label>
            <input type="number" value={form.tauxTvaDefaut ?? 20} onChange={(e) => set('tauxTvaDefaut', +e.target.value)} className="w-full rounded-lg border border-[#DDE3EF] px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-[#DDE3EF] px-4 py-2 text-sm">Annuler</button>
          <button onClick={() => onSave({ ...form, id: fournisseur?.id ?? '', createdAt: fournisseur?.createdAt ?? new Date(), updatedAt: new Date() } as Fournisseur)} className="rounded-lg bg-[#1B2E5E] px-4 py-2 text-sm font-medium text-white">Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>(initialFournisseurs)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<Fournisseur | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filtered = fournisseurs.filter((f) => f.raisonSociale.toLowerCase().includes(searchQuery.toLowerCase()) || f.ice.includes(searchQuery) || f.ville.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const handleSave = (f: Fournisseur) => {
    if (editingFournisseur) {
      setFournisseurs((prev) => prev.map((x) => x.id === f.id ? f : x))
      toast.success('Fournisseur modifie avec succes')
    } else {
      setFournisseurs((prev) => [...prev, { ...f, id: `f${Date.now()}` }])
      toast.success('Fournisseur cree avec succes')
    }
    setShowForm(false); setEditingFournisseur(null)
  }

  if (showForm) return <FournisseurForm fournisseur={editingFournisseur} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingFournisseur(null) }} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Fournisseurs</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-lg bg-[#1B2E5E] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B2E5E]/90">
          <Plus className="h-4 w-4" /> Nouveau Fournisseur
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
              {['Raison Sociale', 'ICE', 'Ville', 'Mode de paiement', 'TVA', 'Delai', 'Statut', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#1B2E5E]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0
              ? <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-[#64748B]">Aucun fournisseur.</td></tr>
              : paginated.map((f) => (
                <tr key={f.id} className="border-b border-[#DDE3EF] last:border-0 hover:bg-[#F4F6FB]">
                  <td className="px-4 py-3 font-medium text-[#1B2E5E]">{f.raisonSociale}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#64748B]">{f.ice}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{f.ville}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{f.modePaiement}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{f.tauxTvaDefaut}%</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{f.delaiPaiement}j</td>
                  <td className="px-4 py-3"><span className={cn('rounded-md px-2 py-1 text-xs font-medium', getStatusColor(f.statut))}>{f.statut}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingFournisseur(f); setShowForm(true) }} className="rounded p-1.5 text-[#64748B] hover:bg-[#F4F6FB] hover:text-[#1B2E5E]"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setArchiveTarget(f)} className="rounded p-1.5 text-[#64748B] hover:bg-[#F4F6FB] hover:text-[#DC2626]"><Archive className="h-4 w-4" /></button>
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
              <button onClick={() => { setFournisseurs((p) => p.map((f) => f.id === archiveTarget.id ? { ...f, statut: 'Inactif' } : f)); toast.success('Archive'); setArchiveTarget(null) }} className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-medium text-white">Archiver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
