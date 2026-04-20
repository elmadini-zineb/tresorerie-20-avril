'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

export default function ConfigurationPage() {
  const [config, setConfig] = useState({
    companyName: 'Adria Treasury',
    ice: '001234567890123',
    rc: 'RC-CASA-001234',
    exercice: '2026',
    devise: 'MAD',
    emailNotifications: true,
    rappelEcheances: true,
    joursAvantEcheance: 7,
  })

  const set = (key: keyof typeof config, value: unknown) => setConfig((p) => ({ ...p, [key]: value }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2E5E]">Configuration</h1>

      <div className="rounded-xl border border-[#DDE3EF] bg-white p-6 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-[#1B2E5E]">Informations de la societe</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Raison sociale', key: 'companyName' as const },
            { label: 'ICE', key: 'ice' as const },
            { label: 'RC', key: 'rc' as const },
            { label: 'Exercice', key: 'exercice' as const },
          ].map(({ label, key }) => (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-medium text-[#1B2E5E]">{label}</label>
              <input value={String(config[key])} onChange={(e) => set(key, e.target.value)} className="w-full rounded-lg border border-[#DDE3EF] px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#DDE3EF] bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[#1B2E5E]">Notifications</h2>
        {[
          { label: 'Alertes par email', key: 'emailNotifications' as const },
          { label: 'Rappel avant echeance', key: 'rappelEcheances' as const },
        ].map(({ label, key }) => (
          <div key={key} className="flex items-center justify-between">
            <p className="text-sm text-[#1B2E5E]">{label}</p>
            <button
              onClick={() => set(key, !config[key])}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config[key] ? 'bg-[#3B6FD4]' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${config[key] ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#1B2E5E]">Jours avant echeance</label>
          <input type="number" min={1} value={config.joursAvantEcheance} onChange={(e) => set('joursAvantEcheance', +e.target.value)} className="w-32 rounded-lg border border-[#DDE3EF] px-3 py-2 text-sm focus:border-[#3B6FD4] focus:outline-none" />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => toast.success('Configuration enregistree')} className="flex items-center gap-2 rounded-lg bg-[#1B2E5E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B2E5E]/90">
          <Save className="h-4 w-4" /> Enregistrer
        </button>
      </div>
    </div>
  )
}
