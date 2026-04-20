'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { redirect } from 'next/navigation'

export default function RapprochementDetailsPage() {
  const { user } = useAuth()

  // Redirect if not authorized
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'ADMIN_BANQUE') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Détails de Rapprochement</h1>
        <p className="text-sm text-[#64748B]">
          Analyse détaillée ligne par ligne des rapprochements bancaires
        </p>
      </div>

      {/* Content Area */}
      <Card className="border-[#DDE3EF]">
        <CardHeader>
          <CardTitle className="text-[#1B2E5E]">Détails Bancaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-[#DDE3EF] bg-[#F4F6FB] p-4">
              <p className="text-sm text-[#64748B]">
                Cette page affiche une vue détaillée des mouvements bancaires avec analyse ligne par ligne.
              </p>
            </div>

            {/* Placeholder for future detailed reconciliation table */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[#1B2E5E]">Mouvements rapprochés</h3>
              <div className="text-center py-8 text-[#64748B]">
                Aucun mouvement à afficher
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
