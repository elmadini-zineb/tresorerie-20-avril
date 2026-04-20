'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

interface Config {
  autoReconciliationThreshold: number
  ecartDetectionThreshold: number
  montantTolerance: number
  dateTolerance: number
}

export default function ConfigurationPage() {
  const [config, setConfig] = useState<Config>({
    autoReconciliationThreshold: 85,
    ecartDetectionThreshold: 60,
    montantTolerance: 1,
    dateTolerance: 5,
  })

  const [originalConfig] = useState<Config>(config)
  const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig)

  const handleSave = () => {
    toast.success('Configuration enregistrée avec succès')
  }

  const handleReset = () => {
    setConfig(originalConfig)
  }

  return (
    <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1B2E5E]">Configuration des Règles</h1>
          <p className="text-sm text-[#64748B]">
            Paramétrez les seuils et tolérances pour le rapprochement automatique
          </p>
        </div>

        {/* Configuration Card */}
        <Card className="border-[#DDE3EF] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1B2E5E]">Seuils de Rapprochement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Auto-Reconciliation Threshold */}
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <Label className="text-[#1B2E5E]">
                  Seuil de Rapprochement Automatique (Score ≥)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={config.autoReconciliationThreshold}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        autoReconciliationThreshold: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-16 border-[#DDE3EF] text-right"
                  />
                  <span className="text-sm text-[#64748B]">/100</span>
                </div>
              </div>
              <Slider
                value={[config.autoReconciliationThreshold]}
                onValueChange={(value) =>
                  setConfig((prev) => ({
                    ...prev,
                    autoReconciliationThreshold: value[0],
                  }))
                }
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-[#64748B]">
                Les factures avec un score égal ou supérieur à ce seuil seront rapprochées
                automatiquement.
              </p>
            </div>

            {/* Écart Detection Threshold */}
            <div className="space-y-4 border-t border-[#DDE3EF] pt-6">
              <div className="flex items-end justify-between">
                <Label className="text-[#1B2E5E]">
                  Seuil d&apos;Écart Détecté (Score {`<`})
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={config.ecartDetectionThreshold}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        ecartDetectionThreshold: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-16 border-[#DDE3EF] text-right"
                  />
                  <span className="text-sm text-[#64748B]">/100</span>
                </div>
              </div>
              <Slider
                value={[config.ecartDetectionThreshold]}
                onValueChange={(value) =>
                  setConfig((prev) => ({
                    ...prev,
                    ecartDetectionThreshold: value[0],
                  }))
                }
                min={0}
                max={config.autoReconciliationThreshold - 1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-[#64748B]">
                Les factures avec un score inférieur à ce seuil seront marquées comme écart
                détecté et nécessiteront une justification.
              </p>
            </div>

            {/* Montant Tolerance */}
            <div className="space-y-4 border-t border-[#DDE3EF] pt-6">
              <div className="flex items-end justify-between">
                <Label className="text-[#1B2E5E]">Tolérance de Montant</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={config.montantTolerance}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        montantTolerance: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-20 border-[#DDE3EF] text-right"
                  />
                  <span className="text-sm text-[#64748B]">%</span>
                </div>
              </div>
              <Slider
                value={[config.montantTolerance]}
                onValueChange={(value) =>
                  setConfig((prev) => ({
                    ...prev,
                    montantTolerance: value[0],
                  }))
                }
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-[#64748B]">
                Écart toléré sur le montant pour un rapprochement valide (en pourcentage du
                montant).
              </p>
            </div>

            {/* Date Tolerance */}
            <div className="space-y-4 border-t border-[#DDE3EF] pt-6">
              <div className="flex items-end justify-between">
                <Label className="text-[#1B2E5E]">Tolérance de Date</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={config.dateTolerance}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        dateTolerance: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-16 border-[#DDE3EF] text-right"
                  />
                  <span className="text-sm text-[#64748B]">jours</span>
                </div>
              </div>
              <Slider
                value={[config.dateTolerance]}
                onValueChange={(value) =>
                  setConfig((prev) => ({
                    ...prev,
                    dateTolerance: value[0],
                  }))
                }
                min={0}
                max={30}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-[#64748B]">
                Écart toléré sur la date d&apos;une facture et son mouvement bancaire associé.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            className="border-[#DDE3EF] text-[#64748B]"
          >
            Réinitialiser
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>
  )
}
