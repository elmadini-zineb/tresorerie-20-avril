'use client'

import { invoices } from '@/lib/mock-data'
import { formatAmount } from '@/lib/format'

export default function TvaPage() {
  const tvaCollectee = invoices.filter((i) => i.type === 'EMISE').reduce((sum, i) => sum + i.montantTva, 0)
  const tvaDeductible = invoices.filter((i) => i.type === 'RECUE').reduce((sum, i) => sum + i.montantTva, 0)
  const tvaNette = tvaCollectee - tvaDeductible

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2E5E]">Declaration TVA</h1>
      <p className="text-sm text-[#64748B]">Periode : T1 2026</p>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'TVA Collectee', value: formatAmount(tvaCollectee), color: 'text-green-700', sub: 'Factures emises' },
          { label: 'TVA Deductible', value: formatAmount(tvaDeductible), color: 'text-red-700', sub: 'Factures recues' },
          { label: 'TVA Nette a payer', value: formatAmount(tvaNette), color: tvaNette >= 0 ? 'text-[#1B2E5E]' : 'text-green-700', sub: tvaNette >= 0 ? 'A verser au Fisc' : 'Credit TVA' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#DDE3EF] bg-white p-6">
            <p className="text-sm text-[#64748B]">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs text-[#94A3B8]">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#DDE3EF] bg-white shadow-sm overflow-x-auto">
        <div className="border-b border-[#DDE3EF] px-4 py-3 bg-[#F4F6FB]">
          <h2 className="text-sm font-semibold text-[#1B2E5E]">Detail par taux</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#DDE3EF]">
              {['Taux TVA', 'Base HT (Charges)', 'TVA Deductible', 'Base HT (Produits)', 'TVA Collectee'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#1B2E5E]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[20, 14, 10, 7].map((taux) => {
              const charges = invoices.filter((i) => i.type === 'RECUE').flatMap((i) => i.lignes.filter((l) => l.tauxTva === taux))
              const produits = invoices.filter((i) => i.type === 'EMISE').flatMap((i) => i.lignes.filter((l) => l.tauxTva === taux))
              const chargesHT = charges.reduce((sum, l) => sum + l.montantHT, 0)
              const chargesTVA = charges.reduce((sum, l) => sum + l.montantTva, 0)
              const produitsHT = produits.reduce((sum, l) => sum + l.montantHT, 0)
              const produitsTVA = produits.reduce((sum, l) => sum + l.montantTva, 0)
              if (chargesHT === 0 && produitsHT === 0) return null
              return (
                <tr key={taux} className="border-b border-[#DDE3EF] last:border-0 hover:bg-[#F4F6FB]">
                  <td className="px-4 py-3 text-sm font-medium text-[#1B2E5E]">{taux}%</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{formatAmount(chargesHT)}</td>
                  <td className="px-4 py-3 text-sm text-red-700">{formatAmount(chargesTVA)}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{formatAmount(produitsHT)}</td>
                  <td className="px-4 py-3 text-sm text-green-700">{formatAmount(produitsTVA)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
