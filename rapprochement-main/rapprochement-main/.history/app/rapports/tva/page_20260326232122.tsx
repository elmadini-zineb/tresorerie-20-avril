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
import { formatAmount } from '@/lib/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock TVA data
const tvaCollecteeData = [
  { taux: 7, baseHT: 85000, montantTva: 5950, nbFactures: 2 },
  { taux: 10, baseHT: 45000, montantTva: 4500, nbFactures: 1 },
  { taux: 14, baseHT: 120000, montantTva: 16800, nbFactures: 3 },
  { taux: 20, baseHT: 961666.67, montantTva: 192333.33, nbFactures: 8 },
]

const tvaDeductibleData = [
  { taux: 7, baseHT: 25000, montantTva: 1750, nbFactures: 1 },
  { taux: 10, baseHT: 0, montantTva: 0, nbFactures: 0 },
  { taux: 14, baseHT: 85000, montantTva: 11900, nbFactures: 2 },
  { taux: 20, baseHT: 334583.34, montantTva: 66916.66, nbFactures: 5 },
]

const detailData = [
  { tiers: 'SOCIÉTÉ MINIÈRE PHOSBOUCRAA', ice: '002555666777888', type: 'Collectée', baseHT: 350000, taux: 20, montantTva: 70000, statut: 'RAPPROCHÉE' },
  { tiers: 'COOPÉRATIVE AGRICOLE SOUSS', ice: '002333444555666', type: 'Collectée', baseHT: 120000, taux: 20, montantTva: 24000, statut: 'JUSTIFIÉE' },
  { tiers: 'OCP GROUP', ice: '001234567890123', type: 'Collectée', baseHT: 741666.67, taux: 20, montantTva: 148333.33, statut: 'RAPPROCHÉE' },
  { tiers: 'ELECTROTECH MAROC', ice: '002345678901234', type: 'Déductible', baseHT: 50000, taux: 20, montantTva: 10000, statut: 'RAPPROCHÉE' },
  { tiers: 'FOURNITURES BUREAU PLUS', ice: '002987654321098', type: 'Déductible', baseHT: 15000, taux: 20, montantTva: 3000, statut: 'RAPPROCHÉE' },
  { tiers: 'ATLAS ÉQUIPEMENTS SA', ice: '002111222333444', type: 'Déductible', baseHT: 204166.67, taux: 20, montantTva: 40833.33, statut: 'RAPPROCHÉE' },
  { tiers: 'TRANSPORT EXPRESS MAGHREB', ice: '002111222333555', type: 'Déductible', baseHT: 85000, taux: 14, montantTva: 11900, statut: 'JUSTIFIÉE' },
]

export default function TVAReportPage() {
  const [period, setPeriod] = useState('trimestre')
  const [isGenerating, setIsGenerating] = useState(false)

  const totalCollectee = tvaCollecteeData.reduce((sum, row) => sum + row.montantTva, 0)
  const totalDeductible = tvaDeductibleData.reduce((sum, row) => sum + row.montantTva, 0)
  const tvaNette = totalCollectee - totalDeductible
  const isDue = tvaNette > 0

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast.success('Déclaration TVA générée avec succès')
    }, 1500)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Déclaration TVA</h1>
        <p className="text-sm text-[#64748B]">Période: Q1 2026</p>
      </div>

      {/* Info Banner */}
      <Card className="border-l-4 border-l-[#3B6FD4] bg-[#3B6FD4]/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 h-5 w-5 text-[#3B6FD4]" />
          <p className="text-sm text-[#1B2E5E]">
            La déclaration TVA est calculée uniquement sur les factures au statut{' '}
            <Badge className="bg-green-50 text-green-700 border border-green-200">RAPPROCHÉE</Badge> ou{' '}
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200">JUSTIFIÉE</Badge>.
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
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          {/* TVA Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* TVA Collectée */}
            <Card className="border-2 border-[#D97706] bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#D97706]">TVA COLLECTÉE</CardTitle>
                <p className="text-xs text-[#64748B]">
                  Source : Factures émises rapprochées (ventes clients)
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F4F6FB]">
                      <TableHead className="text-[#1B2E5E]">Taux</TableHead>
                      <TableHead className="text-right text-[#1B2E5E]">Base HT</TableHead>
                      <TableHead className="text-right text-[#1B2E5E]">Montant TVA</TableHead>
                      <TableHead className="text-right text-[#1B2E5E]">Nb factures</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tvaCollecteeData.map((row) => (
                      <TableRow key={row.taux} className="border-[#DDE3EF]">
                        <TableCell className="font-medium">{row.taux}%</TableCell>
                        <TableCell className="text-right font-mono">{formatAmount(row.baseHT)}</TableCell>
                        <TableCell className="text-right font-mono">{formatAmount(row.montantTva)}</TableCell>
                        <TableCell className="text-right">{row.nbFactures}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-[#D97706]/10 font-bold">
                      <TableCell className="text-[#D97706]">TOTAL TVA COLLECTÉE</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right font-mono text-lg text-[#D97706]">
                        {formatAmount(totalCollectee)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* TVA Déductible */}
            <Card className="border-2 border-[#16A34A] bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#16A34A]">TVA DÉDUCTIBLE</CardTitle>
                <p className="text-xs text-[#64748B]">
                  Source : Factures reçues rapprochées (achats fournisseurs)
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F4F6FB]">
                      <TableHead className="text-[#1B2E5E]">Taux</TableHead>
                      <TableHead className="text-right text-[#1B2E5E]">Base HT</TableHead>
                      <TableHead className="text-right text-[#1B2E5E]">Montant TVA</TableHead>
                      <TableHead className="text-right text-[#1B2E5E]">Nb factures</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tvaDeductibleData.map((row) => (
                      <TableRow key={row.taux} className="border-[#DDE3EF]">
                        <TableCell className="font-medium">{row.taux}%</TableCell>
                        <TableCell className="text-right font-mono">{formatAmount(row.baseHT)}</TableCell>
                        <TableCell className="text-right font-mono">{formatAmount(row.montantTva)}</TableCell>
                        <TableCell className="text-right">{row.nbFactures}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-[#16A34A]/10 font-bold">
                      <TableCell className="text-[#16A34A]">TOTAL TVA DÉDUCTIBLE</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right font-mono text-lg text-[#16A34A]">
                        {formatAmount(totalDeductible)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Summary Box */}
          <Card className="border-[#DDE3EF] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="mx-auto max-w-xl text-center">
                <div className="mb-4 flex items-center justify-center gap-8 text-lg">
                  <div>
                    <p className="text-sm text-[#64748B]">TVA Collectée</p>
                    <p className="font-mono font-bold text-[#D97706]">{formatAmount(totalCollectee)}</p>
                  </div>
                  <span className="text-2xl text-[#64748B]">−</span>
                  <div>
                    <p className="text-sm text-[#64748B]">TVA Déductible</p>
                    <p className="font-mono font-bold text-[#16A34A]">{formatAmount(totalDeductible)}</p>
                  </div>
                </div>

                <div className="border-t border-[#DDE3EF] pt-4">
                  <div
                    className={cn(
                      'inline-block rounded-lg px-8 py-4',
                      isDue ? 'bg-[#DC2626]/10' : 'bg-[#16A34A]/10'
                    )}
                  >
                    <p className="text-sm font-medium text-[#64748B]">
                      {isDue ? "TVA DUE À L'ÉTAT" : 'CRÉDIT DE TVA'}
                    </p>
                    <p
                      className={cn(
                        'text-3xl font-bold',
                        isDue ? 'text-[#DC2626]' : 'text-[#16A34A]'
                      )}
                    >
                      {formatAmount(Math.abs(tvaNette))}
                    </p>
                    <p className="mt-2 text-xs text-[#64748B]">
                      {isDue
                        ? "Vous devez reverser cette somme à l'administration fiscale marocaine."
                        : "L'État vous doit cette somme — vous pouvez en demander le remboursement."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detail Table */}
          <Card className="border-[#DDE3EF] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-[#1B2E5E]">Détail par facture</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F4F6FB]">
                    <TableHead className="text-[#1B2E5E]">Tiers</TableHead>
                    <TableHead className="text-[#1B2E5E]">ICE</TableHead>
                    <TableHead className="text-[#1B2E5E]">Type</TableHead>
                    <TableHead className="text-right text-[#1B2E5E]">Base HT</TableHead>
                    <TableHead className="text-right text-[#1B2E5E]">Taux</TableHead>
                    <TableHead className="text-right text-[#1B2E5E]">Montant TVA</TableHead>
                    <TableHead className="text-[#1B2E5E]">Statut facture</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailData.map((row, i) => (
                    <TableRow key={i} className="border-[#DDE3EF] hover:bg-[#F4F6FB]">
                      <TableCell className="font-medium text-[#1B2E5E]">{row.tiers}</TableCell>
                      <TableCell className="font-mono text-sm text-[#64748B]">{row.ice}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            row.type === 'Collectée'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }
                        >
                          {row.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatAmount(row.baseHT)}</TableCell>
                      <TableCell className="text-right">{row.taux}%</TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {formatAmount(row.montantTva)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            row.statut === 'RAPPROCHÉE'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }
                        >
                          {row.statut}
                        </Badge>
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
