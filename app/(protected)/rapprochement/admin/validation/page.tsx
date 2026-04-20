'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { reconciliations } from '@/lib/mock-data'
import { formatAmount, formatDate } from '@/lib/format'
import type { Reconciliation } from '@/lib/types'
import { toast } from 'sonner'

export default function ValidationPage() {
  const [recos, setRecos] = useState<Reconciliation[]>(reconciliations)

  const pending = recos.filter((r) => r.status === 'ECART_DETECTE' && r.justification)
  const validated = recos.filter((r) => r.validatedBy)

  const handleValidate = (id: string) => {
    setRecos((prev) => prev.map((r) => r.id === id ? { ...r, validatedBy: 'Admin', validationDate: new Date(), status: 'RAPPROCHEE' } : r))
    toast.success('Rapprochement valide')
  }

  const handleReject = (id: string) => {
    setRecos((prev) => prev.map((r) => r.id === id ? { ...r, rejectionComment: 'Justification insuffisante', status: 'ECART_DETECTE', justification: '' } : r))
    toast.error('Rapprochement rejete')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2E5E]">Validation des rapprochements</h1>

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-[#1B2E5E]">En attente de validation ({pending.length})</h2>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-[#DDE3EF] bg-white p-10 text-center text-sm text-[#64748B]">
            Aucun rapprochement en attente de validation.
          </div>
        ) : (
          pending.map((r) => (
            <div key={r.id} className="rounded-xl border border-[#DDE3EF] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-medium text-[#1B2E5E]">{r.invoice.numero}</p>
                  <p className="text-sm text-[#64748B]">{r.invoice.tiersNom}</p>
                  <p className="mt-2 text-sm text-[#1B2E5E]"><span className="font-medium">Justification : </span>{r.justification}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-[#1B2E5E]">{formatAmount(r.invoice.montantTTC)}</p>
                  <p className="text-xs text-[#64748B]">{formatDate(r.invoice.dateEmission)}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2 border-t border-[#F4F6FB] pt-3">
                <button onClick={() => handleReject(r.id)} className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  <XCircle className="h-3.5 w-3.5" /> Rejeter
                </button>
                <button onClick={() => handleValidate(r.id)} className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                  <CheckCircle className="h-3.5 w-3.5" /> Valider
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {validated.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[#1B2E5E]">Recemment valides ({validated.length})</h2>
          {validated.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-[#DDE3EF] bg-white p-4">
              <p className="font-mono text-sm text-[#1B2E5E]">{r.invoice.numero}</p>
              <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Valide</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
