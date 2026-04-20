'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Upload, Plus, Trash2, Search, Check, ChevronRight, FileUp } from 'lucide-react'
import type { Invoice, InvoiceType, InvoiceLine } from '@/lib/rapprochement-types'
import { comptesCharges, comptesProduits, fournisseurs, clients } from '@/lib/rapprochement-mock-data'
import { formatAmount, formatDate } from '@/lib/rapprochement-format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface InvoiceFormProps {
  invoice?: Invoice | null
  invoiceType: InvoiceType
  onSave: (invoice: Invoice) => void
  onCancel: () => void
}

const tvaRates = [0, 7, 10, 14, 20]
const currencies = ['MAD', 'EUR', 'USD', 'GBP'] as const
const paymentStatuses = ['Non payée', 'Partielle', 'Payée'] as const
const paymentModes = ['Virement', 'Chèque', 'Espèces'] as const

export function InvoiceForm({ invoice, invoiceType, onSave, onCancel }: InvoiceFormProps) {
  const [isOcrProcessing, setIsOcrProcessing] = useState(false)
  const [ocrFields, setOcrFields] = useState<Set<string>>(new Set())
  const [showCompteModal, setShowCompteModal] = useState(false)
  const [compteSearch, setCompteSearch] = useState('')
  const [invoiceStatus, setInvoiceStatus] = useState<'brouillon' | 'envoye' | 'comptabilise'>('brouillon')

  const tiers = invoiceType === 'RECUE' ? fournisseurs : clients
  const comptes = invoiceType === 'RECUE' ? comptesCharges : comptesProduits

  const [formData, setFormData] = useState<Partial<Invoice>>({
    type: invoiceType,
    numero: invoice?.numero || '',
    referenceInterne: invoice?.referenceInterne || '',
    tiersId: invoice?.tiersId || '',
    tiersNom: invoice?.tiersNom || '',
    tiersIce: invoice?.tiersIce || '',
    dateEmission: invoice?.dateEmission || new Date(),
    dateEcheance: invoice?.dateEcheance || new Date(),
    source: invoice?.source || 'MANUELLE',
    lignes: invoice?.lignes || [],
    montantHT: invoice?.montantHT || 0,
    montantTva: invoice?.montantTva || 0,
    montantTTC: invoice?.montantTTC || 0,
    montantDu: invoice?.montantDu || 0,
    devise: invoice?.devise || 'MAD',
    statutPaiement: invoice?.statutPaiement || 'Non payée',
    modePaiementEffectif: invoice?.modePaiementEffectif,
    referencePaiement: invoice?.referencePaiement || '',
    description: invoice?.description || '',
    status: invoice?.status || 'EN_ATTENTE',
  })

  const [newLine, setNewLine] = useState<Partial<InvoiceLine>>({
    description: '',
    compte: '',
    compteLabel: '',
    quantite: 1,
    prixUnitaireHT: 0,
    tauxTva: 20,
  })

  const calculateLineTotals = useCallback((line: Partial<InvoiceLine>) => {
    const montantHT = (line.quantite || 0) * (line.prixUnitaireHT || 0)
    const montantTva = montantHT * ((line.tauxTva || 0) / 100)
    const montantTTC = montantHT + montantTva
    return { montantHT, montantTva, montantTTC }
  }, [])

  const recalculateTotals = useCallback((lignes: InvoiceLine[]) => {
    const montantHT = lignes.reduce((sum, l) => sum + l.montantHT, 0)
    const montantTva = lignes.reduce((sum, l) => sum + l.montantTva, 0)
    const montantTTC = lignes.reduce((sum, l) => sum + l.montantTTC, 0)
    return { montantHT, montantTva, montantTTC, montantDu: montantTTC }
  }, [])

  const handleTiersChange = (tiersId: string) => {
    const selectedTiers = tiers.find((t) => t.id === tiersId)
    if (selectedTiers) {
      const dateEmission = formData.dateEmission || new Date()
      const dateEcheance = new Date(dateEmission)
      dateEcheance.setDate(dateEcheance.getDate() + selectedTiers.delaiPaiement)

      setFormData((prev) => ({
        ...prev,
        tiersId,
        tiersNom: selectedTiers.raisonSociale,
        tiersIce: selectedTiers.ice,
        dateEcheance,
      }))
    }
  }

  const handleAddLine = () => {
    if (!newLine.description || !newLine.compte || !newLine.prixUnitaireHT) {
      toast.error('Veuillez remplir tous les champs obligatoires de la ligne')
      return
    }

    const totals = calculateLineTotals(newLine)
    const line: InvoiceLine = {
      id: `line${Date.now()}`,
      description: newLine.description || '',
      compte: newLine.compte || '',
      compteLabel: newLine.compteLabel || '',
      quantite: newLine.quantite || 1,
      prixUnitaireHT: newLine.prixUnitaireHT || 0,
      tauxTva: newLine.tauxTva || 20,
      ...totals,
    }

    const newLignes = [...(formData.lignes || []), line]
    const invoiceTotals = recalculateTotals(newLignes)

    setFormData((prev) => ({
      ...prev,
      lignes: newLignes,
      ...invoiceTotals,
    }))

    setNewLine({
      description: '',
      compte: '',
      compteLabel: '',
      quantite: 1,
      prixUnitaireHT: 0,
      tauxTva: 20,
    })
  }

  const handleRemoveLine = (index: number) => {
    const newLignes = formData.lignes?.filter((_, i) => i !== index) || []
    const invoiceTotals = recalculateTotals(newLignes)

    setFormData((prev) => ({
      ...prev,
      lignes: newLignes,
      ...invoiceTotals,
    }))
  }

  const handleSelectCompte = (compte: { code: string; label: string }) => {
    setNewLine((prev) => ({
      ...prev,
      compte: compte.code,
      compteLabel: compte.label,
    }))
    setShowCompteModal(false)
    setCompteSearch('')
  }

  const handleOcrUpload = () => {
    setIsOcrProcessing(true)

    // Simulate OCR processing
    setTimeout(() => {
      const mockOcrData = {
        numero: 'FA-2026-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        tiersId: tiers[0]?.id || '',
        tiersNom: tiers[0]?.raisonSociale || 'SOCIÉTÉ IMPORTÉE OCR',
        tiersIce: tiers[0]?.ice || '001234567890123',
        dateEmission: new Date(),
        lignes: [
          {
            id: 'line-ocr-1',
            description: 'Fournitures de bureau diverses',
            compte: comptes[0]?.code || '612270',
            compteLabel: comptes[0]?.label || 'Fournitures bureau',
            quantite: 1,
            prixUnitaireHT: 12500,
            tauxTva: 20,
            montantHT: 12500,
            montantTva: 2500,
            montantTTC: 15000,
          },
          {
            id: 'line-ocr-2',
            description: 'Matériel informatique',
            compte: comptes[1]?.code || '612500',
            compteLabel: comptes[1]?.label || 'Matériel informatique',
            quantite: 2,
            prixUnitaireHT: 8500,
            tauxTva: 20,
            montantHT: 17000,
            montantTva: 3400,
            montantTTC: 20400,
          },
        ],
      }

      const totals = recalculateTotals(mockOcrData.lignes)

      setFormData((prev) => ({
        ...prev,
        ...mockOcrData,
        ...totals,
        source: 'OCR',
      }))

      setOcrFields(new Set(['numero', 'tiersNom', 'tiersIce', 'dateEmission', 'lignes']))
      setIsOcrProcessing(false)
      toast.success('Extraction OCR terminée — veuillez vérifier les champs en surbrillance')
    }, 2000)
  }

  const handleConfirm = () => {
    if (invoiceType === 'EMISE') {
      setInvoiceStatus('envoye')
      toast.success('Facture marquée comme envoyée')
    } else {
      setInvoiceStatus('comptabilise')
      toast.success('Facture comptabilisée')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.numero || !formData.tiersId) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (!formData.lignes || formData.lignes.length === 0) {
      toast.error('Veuillez ajouter au moins une ligne de facture')
      return
    }

    onSave({
      ...formData,
      id: invoice?.id || '',
      createdAt: invoice?.createdAt || new Date(),
      updatedAt: new Date(),
    } as Invoice)

    toast.success(invoice ? 'Facture modifiée avec succès' : 'Facture créée avec succès')
  }

  const filteredComptes = comptes.filter(
    (c: { code: string; label: string }) =>
      c.code.includes(compteSearch) ||
      c.label.toLowerCase().includes(compteSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* OCR Processing Overlay */}
      {isOcrProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-80 p-6">
            <div className="flex flex-col items-center gap-4">
              <Spinner className="h-8 w-8" />
              <p className="text-center text-[#1B2E5E]">Traitement OCR en cours...</p>
            </div>
          </Card>
        </div>
      )}

      {/* Status Breadcrumb Pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
            invoiceStatus === 'brouillon' ? 'bg-[#1B2E5E] text-white' : 'bg-[#16A34A] text-white'
          )}>
            {invoiceStatus !== 'brouillon' && <Check className="h-4 w-4" />}
            Brouillon
          </div>
          <ChevronRight className="h-4 w-4 text-[#64748B]" />
          {invoiceType === 'EMISE' && (
            <>
              <div className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
                invoiceStatus === 'envoye' ? 'bg-[#1B2E5E] text-white' : 
                invoiceStatus === 'comptabilise' ? 'bg-[#16A34A] text-white' : 'bg-[#DDE3EF] text-[#64748B]'
              )}>
                {invoiceStatus === 'comptabilise' && <Check className="h-4 w-4" />}
                Envoyé
              </div>
              <ChevronRight className="h-4 w-4 text-[#64748B]" />
            </>
          )}
          <div className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
            invoiceStatus === 'comptabilise' ? 'bg-[#1B2E5E] text-white' : 'bg-[#DDE3EF] text-[#64748B]'
          )}>
            Comptabilisé
          </div>
        </div>
        
        {invoiceStatus === 'brouillon' && (
          <Button 
            onClick={handleConfirm}
            className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
          >
            <Check className="mr-2 h-4 w-4" />
            Confirmer
          </Button>
        )}
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2E5E]">
            {invoice ? 'Modifier la facture' : invoiceType === 'RECUE' ? 'Nouvelle Facture Reçue' : 'Nouvelle Facture Émise'}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              className={cn(
                'text-xs',
                invoiceType === 'RECUE'
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-[#16A34A] text-white'
              )}
            >
              {invoiceType === 'RECUE' ? 'REÇUE — DÉBIT' : 'ÉMISE — CRÉDIT'}
            </Badge>
            <Badge
              className={cn(
                'text-xs',
                formData.source === 'OCR' && 'bg-[#3B6FD4] text-white',
                formData.source === 'ERP' && 'bg-[#7C3AED] text-white',
                formData.source === 'MANUELLE' && 'bg-[#64748B] text-white'
              )}
            >
              {formData.source}
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-[#3B6FD4] text-[#3B6FD4] hover:bg-[#3B6FD4]/10"
          onClick={handleOcrUpload}
        >
          <FileUp className="mr-2 h-4 w-4" />
          Uploader une facture (OCR)
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-[#DDE3EF] bg-white shadow-sm">
          <CardContent className="p-6">
            {/* Header Fields - 2 columns */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Tiers */}
                <div className="space-y-2">
                  <Label className="text-[#1B2E5E]">
                    {invoiceType === 'RECUE' ? 'Fournisseur' : 'Client'}{' '}
                    <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Select value={formData.tiersId} onValueChange={handleTiersChange}>
                    <SelectTrigger
                      className={cn(
                        'border-[#DDE3EF]',
                        ocrFields.has('tiersNom') && 'bg-[#E8F4FD] border-[#3B6FD4]'
                      )}
                    >
                      <SelectValue placeholder="Rechercher..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.raisonSociale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Numéro */}
                <div className="space-y-2">
                  <Label className="text-[#1B2E5E]">
                    Numéro de facture <span className="text-[#DC2626]">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={formData.numero}
                      onChange={(e) => setFormData((p) => ({ ...p, numero: e.target.value }))}
                      className={cn(
                        'border-[#DDE3EF]',
                        ocrFields.has('numero') && 'bg-[#E8F4FD] border-[#3B6FD4]'
                      )}
                      placeholder="FA-2026-XXXX"
                    />
                    {ocrFields.has('numero') && (
                      <Badge className="absolute -top-2 right-2 bg-[#3B6FD4] text-xs">OCR</Badge>
                    )}
                  </div>
                </div>

                {/* Référence interne */}
                <div className="space-y-2">
                  <Label className="text-[#1B2E5E]">Référence de la facture</Label>
                  <Input
                    value={formData.referenceInterne || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, referenceInterne: e.target.value }))}
                    className="border-[#DDE3EF]"
                    placeholder="Référence interne (optionnel)"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Date Facturation */}
                <div className="space-y-2">
                  <Label className="text-[#1B2E5E]">
                    Date de facturation <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={
                      formData.dateEmission
                        ? new Date(formData.dateEmission).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, dateEmission: new Date(e.target.value) }))
                    }
                    className={cn(
                      'border-[#DDE3EF]',
                      ocrFields.has('dateEmission') && 'bg-[#E8F4FD] border-[#3B6FD4]'
                    )}
                  />
                </div>

                {/* Date Échéance */}
                <div className="space-y-2">
                  <Label className="text-[#1B2E5E]">{"Date d'échéance"}</Label>
                  <Input
                    type="date"
                    value={
                      formData.dateEcheance
                        ? new Date(formData.dateEcheance).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, dateEcheance: new Date(e.target.value) }))
                    }
                    className="border-[#DDE3EF] bg-[#F4F6FB]"
                  />
                  <p className="text-xs text-[#64748B]">Calculée automatiquement selon le délai de paiement du tiers</p>
                </div>

                {/* Devise */}
                <div className="space-y-2">
                  <Label className="text-[#1B2E5E]">Devise</Label>
                  <Select
                    value={formData.devise}
                    onValueChange={(v) => setFormData((p) => ({ ...p, devise: v as typeof currencies[number] }))}
                  >
                    <SelectTrigger className="border-[#DDE3EF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="lignes" className="mt-6">
              <TabsList className="bg-[#F4F6FB]">
                <TabsTrigger value="lignes">Lignes de facture</TabsTrigger>
                <TabsTrigger value="autres">Autres informations</TabsTrigger>
              </TabsList>

              <TabsContent value="lignes" className="mt-4">
                {/* Invoice Lines Table */}
                <Card className="border-[#DDE3EF]">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#F4F6FB]">
                          <TableHead className="text-[#1B2E5E]">Article/Description</TableHead>
                          <TableHead className="text-[#1B2E5E]">Compte</TableHead>
                          <TableHead className="text-[#1B2E5E] text-right w-20">Qté</TableHead>
                          <TableHead className="text-[#1B2E5E] text-right">Prix unit. HT</TableHead>
                          <TableHead className="text-[#1B2E5E] text-right w-20">TVA %</TableHead>
                          <TableHead className="text-[#1B2E5E] text-right">Montant HT</TableHead>
                          <TableHead className="text-[#1B2E5E] text-right">Montant TVA</TableHead>
                          <TableHead className="text-[#1B2E5E] text-right">Montant TTC</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.lignes?.map((line, index) => (
                          <TableRow key={line.id} className={ocrFields.has('lignes') ? 'bg-[#E8F4FD]' : ''}>
                            <TableCell className="text-[#1B2E5E]">{line.description}</TableCell>
                            <TableCell>
                              <span className="font-mono text-sm text-[#64748B]">{line.compte}</span>
                              <br />
                              <span className="text-xs text-[#94A3B8]">{line.compteLabel}</span>
                            </TableCell>
                            <TableCell className="text-right">{line.quantite}</TableCell>
                            <TableCell className="text-right font-mono">
                              {formatAmount(line.prixUnitaireHT)}
                            </TableCell>
                            <TableCell className="text-right">{line.tauxTva}%</TableCell>
                            <TableCell className="text-right font-mono">
                              {formatAmount(line.montantHT)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[#64748B]">
                              {formatAmount(line.montantTva)}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold">
                              {formatAmount(line.montantTTC)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#DC2626]"
                                onClick={() => handleRemoveLine(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* New Line Input Row */}
                        <TableRow className="bg-[#F4F6FB]/50">
                          <TableCell>
                            <Input
                              value={newLine.description}
                              onChange={(e) =>
                                setNewLine((p) => ({ ...p, description: e.target.value }))
                              }
                              placeholder="Description..."
                              className="border-[#DDE3EF]"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full border-[#DDE3EF] text-left font-mono text-sm"
                              onClick={() => setShowCompteModal(true)}
                            >
                              <Search className="mr-2 h-3 w-3" />
                              {newLine.compte || 'Rechercher...'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={newLine.quantite}
                              onChange={(e) =>
                                setNewLine((p) => ({ ...p, quantite: parseInt(e.target.value) || 1 }))
                              }
                              className="w-16 border-[#DDE3EF] text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              value={newLine.prixUnitaireHT}
                              onChange={(e) =>
                                setNewLine((p) => ({
                                  ...p,
                                  prixUnitaireHT: parseFloat(e.target.value) || 0,
                                }))
                              }
                              className="w-28 border-[#DDE3EF] text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={newLine.tauxTva?.toString()}
                              onValueChange={(v) =>
                                setNewLine((p) => ({ ...p, tauxTva: parseInt(v) }))
                              }
                            >
                              <SelectTrigger className="w-16 border-[#DDE3EF]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {tvaRates.map((rate) => (
                                  <SelectItem key={rate} value={rate.toString()}>
                                    {rate}%
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right font-mono text-[#64748B]">
                            {formatAmount(calculateLineTotals(newLine).montantHT)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-[#64748B]">
                            {formatAmount(calculateLineTotals(newLine).montantTva)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-[#64748B]">
                            {formatAmount(calculateLineTotals(newLine).montantTTC)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#3B6FD4]"
                              onClick={handleAddLine}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    {/* Add Line Button */}
                    <div className="border-t border-[#DDE3EF] p-3">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-[#3B6FD4]"
                        onClick={handleAddLine}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une ligne
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Totals Section - Odoo style bottom right */}
                <div className="mt-4 flex justify-end">
                  <div className="w-80 space-y-2 rounded-lg border border-[#DDE3EF] bg-white p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Montant hors taxes</span>
                      <span className="font-mono text-[#1B2E5E]">{formatAmount(formData.montantHT || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Total TVA</span>
                      <span className="font-mono text-[#1B2E5E]">{formatAmount(formData.montantTva || 0)}</span>
                    </div>
                    <div className="border-t border-[#DDE3EF] pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#1B2E5E]">Total TTC</span>
                        <span className="font-mono text-lg font-bold text-[#1B2E5E]">{formatAmount(formData.montantTTC || 0)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm border-t border-[#DDE3EF] pt-2">
                      <span className="text-[#64748B]">Montant dû</span>
                      <span className="font-mono font-semibold text-[#DC2626]">{formatAmount(formData.montantDu || 0)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="autres" className="mt-4 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#1B2E5E]">Informations de paiement</h3>
                    
                    <div className="space-y-2">
                      <Label className="text-[#1B2E5E]">Statut paiement</Label>
                      <Select
                        value={formData.statutPaiement}
                        onValueChange={(v) => setFormData((p) => ({ ...p, statutPaiement: v as typeof paymentStatuses[number] }))}
                      >
                        <SelectTrigger className="border-[#DDE3EF]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#1B2E5E]">Mode de paiement effectif</Label>
                      <Select
                        value={formData.modePaiementEffectif || 'none'}
                        onValueChange={(v) => setFormData((p) => ({ ...p, modePaiementEffectif: v === 'none' ? undefined : v as typeof paymentModes[number] }))}
                      >
                        <SelectTrigger className="border-[#DDE3EF]">
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Non défini</SelectItem>
                          {paymentModes.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {mode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#1B2E5E]">Référence paiement</Label>
                      <Input
                        value={formData.referencePaiement}
                        onChange={(e) => setFormData((p) => ({ ...p, referencePaiement: e.target.value }))}
                        className="border-[#DDE3EF]"
                        placeholder="N° virement, chèque..."
                      />
                    </div>
                  </div>

                  {/* Description & Attachment */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#1B2E5E]">Notes et pièces jointes</h3>
                    
                    <div className="space-y-2">
                      <Label className="text-[#1B2E5E]">Description générale</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                        className="min-h-[100px] border-[#DDE3EF]"
                        placeholder="Notes, commentaires..."
                        maxLength={500}
                      />
                      <p className="text-xs text-[#64748B]">{formData.description?.length || 0}/500 caractères</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#1B2E5E]">Pièce jointe</Label>
                      <div 
                        className="flex items-center justify-center rounded-lg border-2 border-dashed border-[#DDE3EF] p-6 hover:border-[#3B6FD4] transition-colors cursor-pointer"
                        onClick={handleOcrUpload}
                      >
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-[#64748B]" />
                          <p className="mt-2 text-sm text-[#64748B]">
                            Cliquez pour uploader (PDF, JPG, PNG - max 5MB)
                          </p>
                          <p className="mt-1 text-xs text-[#94A3B8]">
                            Le fichier sera analysé par OCR automatiquement
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end gap-3 border-t border-[#DDE3EF] pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-[#DDE3EF] text-[#64748B] hover:bg-[#F4F6FB]"
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90">
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Compte Selection Modal - Odoo style */}
      <Dialog open={showCompteModal} onOpenChange={setShowCompteModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1B2E5E]">Recherche: Compte</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <Input
                value={compteSearch}
                onChange={(e) => setCompteSearch(e.target.value)}
                placeholder="Rechercher par code ou libellé..."
                className="pl-10 border-[#DDE3EF]"
                autoFocus
              />
            </div>
            <div className="max-h-80 overflow-y-auto rounded-lg border border-[#DDE3EF]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F4F6FB]">
                    <TableHead className="text-[#1B2E5E]">Code</TableHead>
                    <TableHead className="text-[#1B2E5E]">Libellé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComptes.map((compte) => (
                    <TableRow
                      key={compte.code}
                      className="cursor-pointer hover:bg-[#F4F6FB]"
                      onClick={() => handleSelectCompte(compte)}
                    >
                      <TableCell className="font-mono text-[#3B6FD4]">{compte.code}</TableCell>
                      <TableCell className="text-[#1B2E5E]">{compte.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
