'use client'

import { useState } from 'react'
import { FileSpreadsheet, Download, FileText, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { formatAmount, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock reconciliation data
const bankStatementData = [
  { date: '2026-01-05', description: 'Versement client OCP', montant: 350000, type: 'Crédit', compte: 'BMCE 001' },
  { date: '2026-01-07', description: 'Paiement fournisseur ELECTROTECH', montant: -50000, type: 'Débit', compte: 'BMCE 001' },
  { date: '2026-01-10', description: 'Versement client SOUSS', montant: 120000, type: 'Crédit', compte: 'BMCE 001' },
  { date: '2026-01-12', description: 'Paiement fournisseur ATLAS', montant: -204166.67, type: 'Débit', compte: 'BMCE 001' },
  { date: '2026-01-15', description: 'Versement client MINIÈRE', montant: 250000, type: 'Crédit', compte: 'BMCE 001' },
  { date: '2026-01-18', description: 'Paiement fournisseur TRANSPORT', montant: -85000, type: 'Débit', compte: 'BMCE 001' },
  { date: '2026-01-20', description: 'Versement client MINES', montant: 141666.67, type: 'Crédit', compte: 'BMCE 001' },
  { date: '2026-01-22', description: 'Frais bancaires', montant: -2500, type: 'Débit', compte: 'BMCE 001' },
]

const invoiceMatchData = [
  {
    reference: 'FAC-2026-001',
    tiers: 'OCP GROUP',
    type: 'Émise',
    montantFacture: 350000,
    dateFacture: '2025-12-28',
    datePaiement: '2026-01-05',
    statut: 'RAPPROCHÉE',
    ecart: 0,
  },
  {
    reference: 'ACH-2026-001',
    tiers: 'ELECTROTECH MAROC',
    type: 'Reçue',
    montantFacture: 50000,
    dateFacture: '2025-12-22',
    datePaiement: '2026-01-07',
    statut: 'RAPPROCHÉE',
    ecart: 0,
  },
  {
    reference: 'FAC-2026-002',
    tiers: 'COOPÉRATIVE AGRICOLE SOUSS',
    type: 'Émise',
    montantFacture: 120000,
    dateFacture: '2026-01-08',
    datePaiement: '2026-01-10',
    statut: 'RAPPROCHÉE',
    ecart: 0,
  },
  {
    reference: 'ACH-2026-002',
    tiers: 'ATLAS ÉQUIPEMENTS SA',
    type: 'Reçue',
    montantFacture: 204166.67,
    dateFacture: '2025-12-30',
    datePaiement: '2026-01-12',
    statut: 'RAPPROCHÉE',
    ecart: 0,
  },
  {
    reference: 'FAC-2026-003',
    tiers: 'SOCIÉTÉ MINIÈRE PHOSBOUCRAA',
    type: 'Émise',
    montantFacture: 250000,
    dateFacture: '2026-01-10',
    datePaiement: '2026-01-15',
    statut: 'RAPPROCHÉE',
    ecart: 0,
  },
  {
    reference: 'ACH-2026-003',
    tiers: 'TRANSPORT EXPRESS MAGHREB',
    type: 'Reçue',
    montantFacture: 85000,
    dateFacture: '2026-01-05',
    datePaiement: '2026-01-18',
    statut: 'RAPPROCHÉE',
    ecart: 0,
  },
  {
    reference: 'FAC-2026-004',
    tiers: 'SOCIÉTÉ MINIÈRE PHOSBOUCRAA',
    type: 'Émise',
    montantFacture: 141666.67,
    dateFacture: '2026-01-15',
    datePaiement: '2026-01-20',
    statut: 'RAPPROCHÉE',
    ecart: 0,
  },
  {
    reference: 'FAC-2026-005',
    tiers: 'COOPÉRATIVE AGRICOLE SOUSS',
    type: 'Émise',
    montantFacture: 90000,
    dateFacture: '2026-01-18',
    datePaiement: null,
    statut: 'NON PAYÉE',
    ecart: 0,
  },
]

const ecartData = [
  {
    type: 'Écart de montant',
    description: 'Différence entre le montant facturé et le montant payé',
    nombre: 0,
    montantTotal: 0,
  },
  {
    type: 'Écart de date',
    description: 'Paiement reçu avant la date prévue ou après',
    nombre: 1,
    montantTotal: 0,
  },
  {
    type: 'Écart sans rapprochement',
    description: 'Montant en banque non rapproché à une facture',
    nombre: 0,
    montantTotal: 2500,
  },
]

const summaryData = {
  totalBanque: 539499.33,
  totalFactures: 1290833.34,
  totalRapproches: 1290833.34,
  totalNonRapproches: 90000,
  soldeEcart: 2500,
}

export default function EtatRapprochementPage() {
  const [period, setPeriod] = useState('trimestre')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast.success("État de rapprochement généré avec succès")
    }, 1500)
  }

  return (
    <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1B2E5E]">État de Rapprochement</h1>
          <p className="text-sm text-[#64748B]">Période: Q1 2026</p>
        </div>

        {/* Info Banner */}
        <Card className="border-l-4 border-l-[#3B6FD4] bg-[#3B6FD4]/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Info className="mt-0.5 h-5 w-5 text-[#3B6FD4]" />
            <p className="text-sm text-[#1B2E5E]">
              L&apos;état de rapprochement permet de vérifier la correspondance entre les mouvements bancaires et les factures émises/reçues. Les écarts identifiés doivent être enquêtés.
            </p>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48 border-[#DDE3EF]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mois">Mois</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="personnalise">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {isGenerating ? 'Génération...' : 'Générer'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-[#DDE3EF]">
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" className="border-[#DDE3EF]">
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        {isGenerating ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <Card className="border-[#DDE3EF] bg-white shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-[#64748B]">Solde Bancaire</p>
                  <p className="mt-2 font-mono text-2xl font-bold text-[#1B2E5E]">
                    {formatAmount(summaryData.totalBanque)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[#DDE3EF] bg-white shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-[#64748B]">Total Factures</p>
                  <p className="mt-2 font-mono text-2xl font-bold text-[#1B2E5E]">
                    {formatAmount(summaryData.totalFactures)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[#DDE3EF] bg-white shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-[#64748B]">Rapprochées</p>
                  <p className="mt-2 font-mono text-2xl font-bold text-[#16A34A]">
                    {formatAmount(summaryData.totalRapproches)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[#DDE3EF] bg-white shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-[#64748B]">Écart de Solde</p>
                  <p className="mt-2 font-mono text-2xl font-bold text-[#DC2626]">
                    {formatAmount(summaryData.soldeEcart)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bank Statement Table */}
            <Card className="border-[#DDE3EF] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#1B2E5E]">Relevé Bancaire</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-0 bg-[#F4F6FB]">
                      <TableHead className="font-semibold text-[#1B2E5E]">Date</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Description</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Compte</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankStatementData.map((item, index) => (
                      <TableRow key={index} className="border-t border-[#DDE3EF]">
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.compte}</TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-mono',
                            item.montant > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                          )}
                        >
                          {formatAmount(item.montant)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Invoice Matches Table */}
            <Card className="border-[#DDE3EF] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#1B2E5E]">Factures Rapprochées</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-0 bg-[#F4F6FB]">
                      <TableHead className="font-semibold text-[#1B2E5E]">Référence</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Tiers</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Date Facture</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Date Paiement</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceMatchData.map((item, index) => (
                      <TableRow key={index} className="border-t border-[#DDE3EF]">
                        <TableCell>{item.reference}</TableCell>
                        <TableCell>{item.tiers}</TableCell>
                        <TableCell>{formatDate(item.dateFacture)}</TableCell>
                        <TableCell>{item.datePaiement ? formatDate(item.datePaiement) : '-'}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatAmount(item.montantFacture)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              item.statut === 'RAPPROCHÉE' && 'bg-[#16A34A]/10 text-[#16A34A]',
                              item.statut === 'NON PAYÉE' && 'bg-[#FBBF24]/10 text-[#FBBF24]'
                            )}
                          >
                            {item.statut}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Ecarts Table */}
            <Card className="border-[#DDE3EF] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#1B2E5E]">Analyse des Écarts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-0 bg-[#F4F6FB]">
                      <TableHead className="font-semibold text-[#1B2E5E]">Type d&apos;Écart</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Description</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Nombre</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ecartData.map((item, index) => (
                      <TableRow key={index} className="border-t border-[#DDE3EF]">
                        <TableCell className="font-medium">{item.type}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatAmount(item.montantTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
    </div>
  )
}
