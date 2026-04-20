'use client'

import { invoices } from '@/lib/mock-data'
import { formatAmount } from '@/lib/format'

export default function CpcPage() {
  const charges = invoices.filter((i) => i.type === 'RECUE').reduce((sum, i) => sum + i.montantHT, 0)
  const produits = invoices.filter((i) => i.type === 'EMISE').reduce((sum, i) => sum + i.montantHT, 0)
  const resultat = produits - charges

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2E5E]">Compte de Produits et Charges (CPC)</h1>
      <p className="text-sm text-[#64748B]">Periode : T1 2026</p>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Charges (HT)', value: formatAmount(charges), color: 'text-red-700' },
          { label: 'Total Produits (HT)', value: formatAmount(produits), color: 'text-green-700' },
          { label: 'Resultat net', value: formatAmount(resultat), color: resultat >= 0 ? 'text-green-700' : 'text-red-700' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#DDE3EF] bg-white p-6">
            <p className="text-sm text-[#64748B]">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#DDE3EF] bg-white shadow-sm">
          <div className="border-b border-[#DDE3EF] px-4 py-3 bg-[#F4F6FB]">
            <h2 className="text-sm font-semibold text-[#1B2E5E]">Charges</h2>
          </div>
          <table className="w-full">
            <tbody>
              {invoices.filter((i) => i.type === 'RECUE').map((inv) => (
                <tr key={inv.id} className="border-b border-[#DDE3EF] last:border-0 hover:bg-[#F4F6FB]">
                  <td className="px-4 py-3 text-sm text-[#1B2E5E]">{inv.tiersNom}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-red-700">{formatAmount(inv.montantHT)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-[#DDE3EF] bg-white shadow-sm">
          <div className="border-b border-[#DDE3EF] px-4 py-3 bg-[#F4F6FB]">
            <h2 className="text-sm font-semibold text-[#1B2E5E]">Produits</h2>
          </div>
          <table className="w-full">
            <tbody>
              {invoices.filter((i) => i.type === 'EMISE').map((inv) => (
                <tr key={inv.id} className="border-b border-[#DDE3EF] last:border-0 hover:bg-[#F4F6FB]">
                  <td className="px-4 py-3 text-sm text-[#1B2E5E]">{inv.tiersNom}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-green-700">{formatAmount(inv.montantHT)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
