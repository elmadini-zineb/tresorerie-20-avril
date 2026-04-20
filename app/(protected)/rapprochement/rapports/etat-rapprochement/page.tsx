'use client'

import { reconciliations } from '@/lib/mock-data'
import { formatAmount, formatDate, getScoreColor } from '@/lib/format'

export default function EtatRapprochementPage() {
  const rapprochees = reconciliations.filter((r) => r.status === 'RAPPROCHEE').length
  const ecarts = reconciliations.filter((r) => r.status === 'ECART_DETECTE').length
  const nonRapprochees = reconciliations.filter((r) => r.status === 'NON_RAPPROCHEE').length
  const total = reconciliations.length
  const tauxRapprochement = total > 0 ? Math.round((rapprochees / total) * 100) : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2E5E]">Etat de Rapprochement</h1>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: total, color: 'text-[#1B2E5E]' },
          { label: 'Rapprochees', value: rapprochees, color: 'text-green-700' },
          { label: 'Ecarts', value: ecarts, color: 'text-amber-700' },
          { label: 'Non rapprochees', value: nonRapprochees, color: 'text-red-700' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#DDE3EF] bg-white p-5">
            <p className="text-sm text-[#64748B]">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#DDE3EF] bg-white p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-[#1B2E5E]">Taux de rapprochement global</p>
          <span className="text-lg font-bold" style={{ color: getScoreColor(tauxRapprochement) }}>{tauxRapprochement}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100">
          <div className="h-3 rounded-full transition-all" style={{ width: `${tauxRapprochement}%`, backgroundColor: getScoreColor(tauxRapprochement) }} />
        </div>
      </div>

      <div className="rounded-xl border border-[#DDE3EF] bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#DDE3EF] bg-[#F4F6FB]">
              {['Facture', 'Tiers', 'Date', 'Montant TTC', 'Score', 'Statut'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#1B2E5E]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reconciliations.map((r) => (
              <tr key={r.id} className="border-b border-[#DDE3EF] last:border-0 hover:bg-[#F4F6FB]">
                <td className="px-4 py-3 font-mono text-sm text-[#1B2E5E]">{r.invoice.numero}</td>
                <td className="px-4 py-3 text-sm text-[#64748B]">{r.invoice.tiersNom}</td>
                <td className="px-4 py-3 text-sm text-[#64748B]">{formatDate(r.invoice.dateEmission)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-[#1B2E5E]">{formatAmount(r.invoice.montantTTC)}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold" style={{ color: getScoreColor(r.score.total) }}>{r.score.total}%</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${
                    r.status === 'RAPPROCHEE' ? 'bg-green-50 text-green-700' :
                    r.status === 'ECART_DETECTE' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {r.status === 'RAPPROCHEE' ? 'Rapprochee' : r.status === 'ECART_DETECTE' ? 'Ecart' : 'Non rapprochee'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
