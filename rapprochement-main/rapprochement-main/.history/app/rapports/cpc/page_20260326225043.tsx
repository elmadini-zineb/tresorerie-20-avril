'use client'

import { useState } from 'react'
import { FileSpreadsheet, Download, FileText, Info, TrendingUp, TrendingDown } from 'lucide-react'
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

// Mock CPC data
const produitsData = [
  { client: 'SOCIÉTÉ MINIÈRE PHOSBOUCRAA', categorie: 'Travaux facturés', compte: '714000', montantHT: 350000, tva: 70000, montantTTC: 420000 },
  { client: 'COOPÉRATIVE AGRICOLE SOUSS', categorie: 'Produits activités annexes', compte: '716000', montantHT: 120000, tva: 24000, montantTTC: 144000 },
  { client: 'OCP GROUP', categorie: 'Travaux facturés', compte: '714000', montantHT: 741666.67, tva: 148333.33, montantTTC: 890000 },
]

const chargesData = [
  { fournisseur: 'ELECTROTECH MAROC', categorie: 'Achats fournitures de bureau', compte: '612270', montantHT: 50000, tva: 10000, montantTTC: 60000 },
  { fournisseur: 'FOURNITURES BUREAU PLUS', categorie: 'Achats fournitures de bureau', compte: '612270', montantHT: 15000, tva: 3000, montantTTC: 18000 },
  { fournisseur: 'ATLAS ÉQUIPEMENTS SA', categorie: 'Achats matières premières', compte: '612110', montantHT: 204166.67, tva: 40833.33, montantTTC: 245000 },
  { fournisseur: 'TECH SOLUTIONS RABAT', categorie: 'Autres charges externes', compte: '618000', montantHT: 65416.67, tva: 13083.33, montantTTC: 78500 },
]

export default function CPCReportPage() {
  const [period, setPeriod] = useState('trimestre')
  const [isGenerating, setIsGenerating] = useState(false)

  const totalProduits = {
    montantHT: produitsData.reduce((sum, p) => sum + p.montantHT, 0),
    tva: produitsData.reduce((sum, p) => sum + p.tva, 0),
    montantTTC: produitsData.reduce((sum, p) => sum + p.montantTTC, 0),
  }

  const totalCharges = {
    montantHT: chargesData.reduce((sum, c) => sum + c.montantHT, 0),
    tva: chargesData.reduce((sum, c) => sum + c.tva, 0),
    montantTTC: chargesData.reduce((sum, c) => sum + c.montantTTC, 0),
  }

  const resultat = totalProduits.montantHT - totalCharges.montantHT
  const isProfit = resultat >= 0

  const tvaNette = totalProduits.tva - totalCharges.tva

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast.success('Rapport CPC généré avec succès')
    }, 1500)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Compte de Produits et Charges (CPC)</h1>
        <p className="text-sm text-[#64748B]">Rapport financier Q1 2026</p>
      </div>

      {/* Info Banner */}
      <Card className="border-l-4 border-l-[#3B6FD4] bg-[#3B6FD4]/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 h-5 w-5 text-[#3B6FD4]" />
          <p className="text-sm text-[#1B2E5E]">
            Le CPC est généré uniquement à partir des factures au statut{' '}
            <Badge className="bg-[#16A34A] text-white">RAPPROCHÉE</Badge> ou{' '}
            <Badge className="bg-[#3B6FD4] text-white">JUSTIFIÉE</Badge>.
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
            {isGenerating ? 'Génération...' : 'Générer le Rapport'}
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
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <>
          {/* Produits Section */}
          <Card className="border-[#DDE3EF] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#16A34A] px-4 py-3">
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <TrendingUp className="h-5 w-5" />
                {"PRODUITS D'EXPLOITATION"}
              </h2>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F4F6FB]">
                    <TableHead className="font-semibold text-[#1B2E5E]">Client</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E]">Catégorie</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E]">Compte</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant HT</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E] text-right">TVA</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant TTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produitsData.map((row, i) => (
                    <TableRow key={i} className="border-[#DDE3EF] hover:bg-[#F4F6FB]">
                      <TableCell className="font-medium text-[#1B2E5E]">{row.client}</TableCell>
                      <TableCell className="text-[#64748B]">{row.categorie}</TableCell>
                      <TableCell className="font-mono text-sm text-[#64748B]">{row.compte}</TableCell>
                      <TableCell className="text-right font-mono">{formatAmount(row.montantHT)}</TableCell>
                      <TableCell className="text-right font-mono text-[#64748B]">{formatAmount(row.tva)}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{formatAmount(row.montantTTC)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-[#16A34A]/10 font-bold">
                    <TableCell colSpan={3} className="text-[#16A34A]">TOTAL PRODUITS</TableCell>
                    <TableCell className="text-right font-mono text-[#16A34A]">{formatAmount(totalProduits.montantHT)}</TableCell>
                    <TableCell className="text-right font-mono text-[#16A34A]">{formatAmount(totalProduits.tva)}</TableCell>
                    <TableCell className="text-right font-mono text-lg text-[#16A34A]">{formatAmount(totalProduits.montantTTC)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Charges Section */}
          <Card className="border-[#DDE3EF] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#D97706] px-4 py-3">
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <TrendingDown className="h-5 w-5" />
                {"CHARGES D'EXPLOITATION"}
              </h2>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F4F6FB]">
                    <TableHead className="font-semibold text-[#1B2E5E]">Fournisseur</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E]">Catégorie</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E]">Compte</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant HT</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E] text-right">TVA</TableHead>
                    <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant TTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chargesData.map((row, i) => (
                    <TableRow key={i} className="border-[#DDE3EF] hover:bg-[#F4F6FB]">
                      <TableCell className="font-medium text-[#1B2E5E]">{row.fournisseur}</TableCell>
                      <TableCell className="text-[#64748B]">{row.categorie}</TableCell>
                      <TableCell className="font-mono text-sm text-[#64748B]">{row.compte}</TableCell>
                      <TableCell className="text-right font-mono">{formatAmount(row.montantHT)}</TableCell>
                      <TableCell className="text-right font-mono text-[#64748B]">{formatAmount(row.tva)}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{formatAmount(row.montantTTC)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-[#D97706]/10 font-bold">
                    <TableCell colSpan={3} className="text-[#D97706]">TOTAL CHARGES</TableCell>
                    <TableCell className="text-right font-mono text-[#D97706]">{formatAmount(totalCharges.montantHT)}</TableCell>
                    <TableCell className="text-right font-mono text-[#D97706]">{formatAmount(totalCharges.tva)}</TableCell>
                    <TableCell className="text-right font-mono text-lg text-[#D97706]">{formatAmount(totalCharges.montantTTC)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="border-[#DDE3EF] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-semibold text-[#1B2E5E]">
                  {"Résultat d'Exploitation = Produits − Charges"}
                </h3>
                <div
                  className={cn(
                    'inline-block rounded-lg px-8 py-4',
                    isProfit ? 'bg-[#16A34A]/10' : 'bg-[#DC2626]/10'
                  )}
                >
                  <p
                    className={cn(
                      'text-4xl font-bold',
                      isProfit ? 'text-[#16A34A]' : 'text-[#DC2626]'
                    )}
                  >
                    {isProfit ? '+' : '−'} {formatAmount(Math.abs(resultat))}
                  </p>
                  <p className={cn('text-sm font-medium', isProfit ? 'text-[#16A34A]' : 'text-[#DC2626]')}>
                    {isProfit ? '+ Bénéfice' : '− Perte'}
                  </p>
                </div>
              </div>

              {/* TVA Nette */}
              <div className="mt-6 border-t border-[#DDE3EF] pt-6">
                <div className="mx-auto max-w-md rounded-lg bg-[#F4F6FB] p-4 text-center">
                  <h4 className="mb-2 text-sm font-semibold text-[#1B2E5E]">TVA NETTE</h4>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div>
                      <p className="text-[#64748B]">TVA Collectée</p>
                      <p className="font-mono font-semibold text-[#16A34A]">
                        {formatAmount(totalProduits.tva)}
                      </p>
                    </div>
                    <span className="text-[#64748B]">−</span>
                    <div>
                      <p className="text-[#64748B]">TVA Déductible</p>
                      <p className="font-mono font-semibold text-[#D97706]">
                        {formatAmount(totalCharges.tva)}
                      </p>
                    </div>
                    <span className="text-[#64748B]">=</span>
                    <div>
                      <p className="text-[#64748B]">TVA Nette</p>
                      <p
                        className={cn(
                          'font-mono text-lg font-bold',
                          tvaNette >= 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                        )}
                      >
                        {formatAmount(Math.abs(tvaNette))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
