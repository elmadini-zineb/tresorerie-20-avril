'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export default function RapprochementHistoriquePage() {
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
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Historique des Rapprochements</h1>
        <p className="text-sm text-[#64748B]">
          Historique complet de tous les rapprochements effectués
        </p>
      </div>

      {/* Content Area */}
      <Card className="border-[#DDE3EF]">
        <CardHeader>
          <CardTitle className="text-[#1B2E5E]">Rapprochements Antérieurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Info Message */}
            <div className="rounded-lg border border-[#DDE3EF] bg-[#F4F6FB] p-4">
              <p className="text-sm text-[#64748B]">
                Consultez l&apos;historique complet des rapprochements bancaires réalisés. Chaque entrée affiche
                l&apos;état, la date et les statistiques du rapprochement.
              </p>
            </div>

            {/* Placeholder for history list */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[#1B2E5E]">Rapprochements Effectués</h3>
              <div className="space-y-2">
                {/* Example history item structure */}
                <div className="flex items-center justify-between rounded-lg border border-[#DDE3EF] p-4 hover:bg-[#F4F6FB]/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-[#1B2E5E]">Rapprochement Mars 2026</p>
                    <p className="text-sm text-[#64748B]">Réalisé le 15 Mars 2026</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#16A34A]/10 text-[#16A34A]">Complété</Badge>
                  </div>
                </div>
              </div>

              {/* Empty state */}
              <div className="text-center py-8 text-[#64748B]">
                Aucun historique disponible pour le moment
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
