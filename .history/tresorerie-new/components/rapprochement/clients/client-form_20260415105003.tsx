'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Client } from '@/lib/rapprochement-types'
import { cn } from '@/lib/utils'

interface ClientFormProps {
  client?: Client | null
  onSave: (client: Client) => void
  onCancel: () => void
}

interface FormErrors {
  raisonSociale?: string
  ice?: string
  identifiantFiscal?: string
  adresse?: string
  ville?: string
  pays?: string
  rib?: string
  emailFacturation?: string
  delaiPaiement?: string
}

const countries = [
  'Maroc',
  'France',
  'Espagne',
  'Allemagne',
  'Italie',
  'Belgique',
  'Pays-Bas',
  'Royaume-Uni',
  'États-Unis',
  'Canada',
]

const paymentModes = ['Virement', 'Chèque', 'Espèces', 'Prélèvement'] as const
const tvaRates = [0, 7, 10, 14, 20]
const segments = ['TPE', 'PME', 'GE', 'Public'] as const

export function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    raisonSociale: client?.raisonSociale || '',
    ice: client?.ice || '',
    identifiantFiscal: client?.identifiantFiscal || '',
    rc: client?.rc || '',
    adresse: client?.adresse || '',
    ville: client?.ville || '',
    pays: client?.pays || 'Maroc',
    rib: client?.rib || '',
    banqueDomiciliataire: client?.banqueDomiciliataire || '',
    emailFacturation: client?.emailFacturation || '',
    telephone: client?.telephone || '',
    delaiPaiement: client?.delaiPaiement || 30,
    modePaiement: client?.modePaiement || 'Virement',
    tauxTvaDefaut: client?.tauxTvaDefaut || 20,
    segment: client?.segment,
    statut: client?.statut || 'Actif',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.raisonSociale || formData.raisonSociale.length < 2) {
      newErrors.raisonSociale = 'La raison sociale doit contenir au moins 2 caractères'
    }

    if (!formData.ice || !/^\d{15}$/.test(formData.ice)) {
      newErrors.ice = "L'ICE doit contenir exactement 15 chiffres"
    }

    if (!formData.identifiantFiscal || !/^\d+$/.test(formData.identifiantFiscal)) {
      newErrors.identifiantFiscal = "L'identifiant fiscal doit être numérique"
    }

    if (!formData.adresse) {
      newErrors.adresse = "L'adresse est obligatoire"
    }

    if (!formData.ville) {
      newErrors.ville = 'La ville est obligatoire'
    }

    if (!formData.rib || !/^\d{24}$/.test(formData.rib)) {
      newErrors.rib = 'Le RIB doit contenir exactement 24 chiffres'
    }

    if (formData.emailFacturation && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailFacturation)) {
      newErrors.emailFacturation = 'Format email invalide'
    }

    if (formData.delaiPaiement === undefined || formData.delaiPaiement < 0 || formData.delaiPaiement > 180) {
      newErrors.delaiPaiement = 'Le délai doit être entre 0 et 180 jours'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        ...formData,
        id: client?.id || '',
        createdAt: client?.createdAt || new Date(),
        updatedAt: new Date(),
      } as Client)
    }
  }

  const handleChange = (field: keyof Client, value: string | number | boolean | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2E5E]">
          {client ? 'Modifier le client' : 'Nouveau Client'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-[#DDE3EF] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1B2E5E]">Informations du client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Raison Sociale */}
                <div className="space-y-2">
                  <Label htmlFor="raisonSociale" className="text-[#1B2E5E]">
                    Raison sociale <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="raisonSociale"
                    value={formData.raisonSociale}
                    onChange={(e) => handleChange('raisonSociale', e.target.value)}
                    className={cn('border-[#DDE3EF]', errors.raisonSociale && 'border-[#DC2626]')}
                    placeholder="Nom de l'entreprise"
                  />
                  {errors.raisonSociale && (
                    <p className="text-sm text-[#DC2626]">{errors.raisonSociale}</p>
                  )}
                </div>

                {/* ICE */}
                <div className="space-y-2">
                  <Label htmlFor="ice" className="text-[#1B2E5E]">
                    ICE <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="ice"
                    value={formData.ice}
                    onChange={(e) => handleChange('ice', e.target.value.replace(/\D/g, '').slice(0, 15))}
                    className={cn('border-[#DDE3EF] font-mono', errors.ice && 'border-[#DC2626]')}
                    placeholder="15 chiffres"
                    maxLength={15}
                  />
                  {errors.ice && <p className="text-sm text-[#DC2626]">{errors.ice}</p>}
                </div>

                {/* IF */}
                <div className="space-y-2">
                  <Label htmlFor="identifiantFiscal" className="text-[#1B2E5E]">
                    Identifiant Fiscal IF <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="identifiantFiscal"
                    value={formData.identifiantFiscal}
                    onChange={(e) => handleChange('identifiantFiscal', e.target.value.replace(/\D/g, ''))}
                    className={cn('border-[#DDE3EF]', errors.identifiantFiscal && 'border-[#DC2626]')}
                    placeholder="Numérique"
                  />
                  {errors.identifiantFiscal && (
                    <p className="text-sm text-[#DC2626]">{errors.identifiantFiscal}</p>
                  )}
                </div>

                {/* RC - Optional for clients */}
                <div className="space-y-2">
                  <Label htmlFor="rc" className="text-[#1B2E5E]">
                    RC — Registre de Commerce
                  </Label>
                  <Input
                    id="rc"
                    value={formData.rc}
                    onChange={(e) => handleChange('rc', e.target.value)}
                    className="border-[#DDE3EF]"
                    placeholder="Ex: RC-CASA-123456 (optionnel)"
                  />
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <Label htmlFor="adresse" className="text-[#1B2E5E]">
                    Adresse <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleChange('adresse', e.target.value)}
                    className={cn('border-[#DDE3EF]', errors.adresse && 'border-[#DC2626]')}
                    placeholder="Adresse complète"
                  />
                  {errors.adresse && <p className="text-sm text-[#DC2626]">{errors.adresse}</p>}
                </div>

                {/* Ville */}
                <div className="space-y-2">
                  <Label htmlFor="ville" className="text-[#1B2E5E]">
                    Ville <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleChange('ville', e.target.value)}
                    className={cn('border-[#DDE3EF]', errors.ville && 'border-[#DC2626]')}
                    placeholder="Ville"
                  />
                  {errors.ville && <p className="text-sm text-[#DC2626]">{errors.ville}</p>}
                </div>

                {/* Pays */}
                <div className="space-y-2">
                  <Label htmlFor="pays" className="text-[#1B2E5E]">
                    Pays <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Select
                    value={formData.pays}
                    onValueChange={(value) => handleChange('pays', value)}
                  >
                    <SelectTrigger className="border-[#DDE3EF]">
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* RIB */}
                <div className="space-y-2">
                  <Label htmlFor="rib" className="text-[#1B2E5E]">
                    RIB / IBAN <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="rib"
                    value={formData.rib}
                    onChange={(e) => handleChange('rib', e.target.value.replace(/\D/g, '').slice(0, 24))}
                    className={cn('border-[#DDE3EF] font-mono', errors.rib && 'border-[#DC2626]')}
                    placeholder="24 chiffres"
                    maxLength={24}
                  />
                  {errors.rib && <p className="text-sm text-[#DC2626]">{errors.rib}</p>}
                </div>

                {/* Banque */}
                <div className="space-y-2">
                  <Label htmlFor="banqueDomiciliataire" className="text-[#1B2E5E]">
                    Banque domiciliataire
                  </Label>
                  <Input
                    id="banqueDomiciliataire"
                    value={formData.banqueDomiciliataire}
                    onChange={(e) => handleChange('banqueDomiciliataire', e.target.value)}
                    className="border-[#DDE3EF]"
                    placeholder="Nom de la banque"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="emailFacturation" className="text-[#1B2E5E]">
                    Email facturation
                  </Label>
                  <Input
                    id="emailFacturation"
                    type="email"
                    value={formData.emailFacturation}
                    onChange={(e) => handleChange('emailFacturation', e.target.value)}
                    className={cn('border-[#DDE3EF]', errors.emailFacturation && 'border-[#DC2626]')}
                    placeholder="email@entreprise.ma"
                  />
                  {errors.emailFacturation && (
                    <p className="text-sm text-[#DC2626]">{errors.emailFacturation}</p>
                  )}
                </div>

                {/* Telephone */}
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-[#1B2E5E]">
                    Téléphone
                  </Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    className="border-[#DDE3EF]"
                    placeholder="+212 5XX XXX XXX"
                  />
                </div>

                {/* Segment */}
                <div className="space-y-2">
                  <Label htmlFor="segment" className="text-[#1B2E5E]">
                    Segment
                  </Label>
                  <Select
                    value={formData.segment || 'none'}
                    onValueChange={(value) => handleChange('segment', value === 'none' ? undefined : value)}
                  >
                    <SelectTrigger className="border-[#DDE3EF]">
                      <SelectValue placeholder="Sélectionner un segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Non défini</SelectItem>
                      {segments.map((segment) => (
                        <SelectItem key={segment} value={segment}>
                          {segment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Délai de paiement */}
                <div className="space-y-2">
                  <Label htmlFor="delaiPaiement" className="text-[#1B2E5E]">
                    Délai de paiement (jours) <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="delaiPaiement"
                    type="number"
                    min={0}
                    max={180}
                    value={formData.delaiPaiement}
                    onChange={(e) => handleChange('delaiPaiement', parseInt(e.target.value) || 0)}
                    className={cn('border-[#DDE3EF]', errors.delaiPaiement && 'border-[#DC2626]')}
                  />
                  <p className="text-xs text-[#64748B]">Délai de paiement depuis date de facture</p>
                  {errors.delaiPaiement && (
                    <p className="text-sm text-[#DC2626]">{errors.delaiPaiement}</p>
                  )}
                </div>

                {/* Mode de paiement */}
                <div className="space-y-2">
                  <Label htmlFor="modePaiement" className="text-[#1B2E5E]">
                    Mode de paiement <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Select
                    value={formData.modePaiement}
                    onValueChange={(value) => handleChange('modePaiement', value)}
                  >
                    <SelectTrigger className="border-[#DDE3EF]">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Taux TVA */}
                <div className="space-y-2">
                  <Label htmlFor="tauxTvaDefaut" className="text-[#1B2E5E]">
                    Taux TVA par défaut <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Select
                    value={formData.tauxTvaDefaut?.toString()}
                    onValueChange={(value) => handleChange('tauxTvaDefaut', parseInt(value))}
                  >
                    <SelectTrigger className="border-[#DDE3EF]">
                      <SelectValue placeholder="Sélectionner un taux" />
                    </SelectTrigger>
                    <SelectContent>
                      {tvaRates.map((rate) => (
                        <SelectItem key={rate} value={rate.toString()}>
                          {rate}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Statut */}
                <div className="flex items-center space-x-2 pt-4">
                  <Switch
                    id="statut"
                    checked={formData.statut === 'Actif'}
                    onCheckedChange={(checked) =>
                      handleChange('statut', checked ? 'Actif' : 'Inactif')
                    }
                  />
                  <Label htmlFor="statut" className="text-[#1B2E5E]">
                    Client Actif
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-[#DDE3EF]"
          >
            Annuler
          </Button>
          <Button type="submit" className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}
