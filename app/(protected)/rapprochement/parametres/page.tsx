'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

export default function ParametresPage() {
  const [seuilRapprochement, setSeuilRapprochement] = useState(85)
  const [delaiAlerte, setDelaiAlerte] = useState(7)
  const [banque, setBanque] = useState('Attijariwafa Bank')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2E5E]">Parametres</h1>

      <div className="rounded-xl border border-[#DDE3EF] bg-white p-6 shadow-sm space-y-6">
        <h2 className="text-base font-semibold text-[#1B2E5E]">Rapprochement</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1B2E5E]">Seuil de rapprochement (%)</label>
            <input type="number" min={0} max={100} value={seuilRapprochement} onChange={(e) => setSeuilRapprochement(+e.target.value)} className="w-full rounded-lg border border-[#DDE3EF] px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none" />
            <p className="text-xs text-[#64748B]">Score minimum pour un rapprochement automatique</p>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1B2E5E]">Delai alerte (jours)</label>
            <input type="number" min={1} value={delaiAlerte} onChange={(e) => setDelaiAlerte(+e.target.value)} className="w-full rounded-lg border border-[#DDE3EF] px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none" />
            <p className="text-xs text-[#64748B]">Jours sans action avant alerte</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#DDE3EF] bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[#1B2E5E]">Banque principale</h2>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#1B2E5E]">Banque domiciliataire</label>
          <select value={banque} onChange={(e) => setBanque(e.target.value)} className="w-full max-w-sm rounded-lg border border-[#DDE3EF] px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none">
            {['Attijariwafa Bank', 'BMCE Bank', 'Banque Populaire', 'CIH Bank', 'Credit Agricole'].map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => toast.success('Parametres enregistres')} className="flex items-center gap-2 rounded-lg bg-[#1B2E5E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B2E5E]/90">
          <Save className="h-4 w-4" /> Enregistrer
        </button>
      </div>
    </div>
  )
}
