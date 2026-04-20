'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'

const initialUsers = [
  { id: 'tr-001', name: 'Tresorier Adria', email: 'tresorier@adria.ma', role: 'TRESORIER', active: true },
  { id: 'ac-001', name: 'Admin Client Adria', email: 'admin@adria.ma', role: 'ADMIN_CLIENT', active: true },
  { id: 'ab-001', name: 'Admin Banque Adria', email: 'admin.banque@adria.ma', role: 'ADMIN_BANQUE', active: true },
]

export default function UtilisateursPage() {
  const [users, setUsers] = useState(initialUsers)

  const roleColors: Record<string, string> = {
    TRESORIER: 'bg-blue-50 text-blue-700',
    ADMIN_CLIENT: 'bg-violet-50 text-violet-700',
    ADMIN_BANQUE: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Utilisateurs</h1>
        <button className="flex items-center gap-2 rounded-lg bg-[#1B2E5E] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B2E5E]/90">
          <UserPlus className="h-4 w-4" /> Nouvel utilisateur
        </button>
      </div>

      <div className="rounded-xl border border-[#DDE3EF] bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#DDE3EF] bg-[#F4F6FB]">
              {['Nom', 'Email', 'Role', 'Statut', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#1B2E5E]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#DDE3EF] last:border-0 hover:bg-[#F4F6FB]">
                <td className="px-4 py-3 font-medium text-[#1B2E5E]">{u.name}</td>
                <td className="px-4 py-3 text-sm text-[#64748B]">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${roleColors[u.role] ?? 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${u.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, active: !x.active } : x)); toast.success(`Utilisateur ${u.active ? 'desactive' : 'active'}`) }}
                    className="text-xs text-[#3B6FD4] hover:underline"
                  >
                    {u.active ? 'Desactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
