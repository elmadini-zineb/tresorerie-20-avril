'use client'

import { useMemo, useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { invoices, mouvementsBancaires } from '@/lib/mock-data'
import { formatAmount } from '@/lib/format'

type RowTone = 'normal' | 'section' | 'total' | 'result' | 'net'

type CpcRow = {
  key: string
  label: string
  current: number
  previous: number
  tone?: RowTone
  bullet?: boolean
  formula?: string
  editable?: boolean
}

const COMPANY_NAME = 'Adria Business and Technology'

const emptyPrevious = 0

function getAmountColor(amount: number) {
  if (amount > 0) return 'text-[#16A34A]'
  if (amount < 0) return 'text-[#DC2626]'
  return 'text-[#94A3B8]'
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function amountFromEmises(predicate: (compte: string) => boolean) {
  return invoices
    .filter((invoice) => invoice.type === 'EMISE' && ['RAPPROCHE', 'JUSTIFIE'].includes(invoice.status))
    .flatMap((invoice) => invoice.lignes)
    .filter((line) => /^7\d{5}$/.test(line.compte) && predicate(line.compte))
    .reduce((total, line) => total + line.montantHT, 0)
}

function amountFromRecues(predicate: (compte: string) => boolean) {
  return invoices
    .filter((invoice) => invoice.type === 'RECUE' && ['RAPPROCHE', 'JUSTIFIE'].includes(invoice.status))
    .flatMap((invoice) => invoice.lignes)
    .filter((line) => /^6\d{5}$/.test(line.compte) && predicate(line.compte))
    .reduce((total, line) => total + line.montantHT, 0)
}

export default function CPCReportPage() {
  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'custom'>('quarter')
  const [selectedMonth, setSelectedMonth] = useState('2026-03')
  const [selectedQuarter, setSelectedQuarter] = useState('T1 2026')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [isAmount, setIsAmount] = useState('0')
  const [hasGenerated, setHasGenerated] = useState(false)

  const selectedPeriodLabel = useMemo(() => {
    if (periodType === 'month') {
      return selectedMonth ? selectedMonth : 'Mois non défini'
    }
    if (periodType === 'custom') {
      return customStart && customEnd ? `${customStart} au ${customEnd}` : 'Période personnalisée non définie'
    }
    return selectedQuarter
  }, [periodType, selectedMonth, customStart, customEnd, selectedQuarter])

  const rows = useMemo(() => {
    const ventesMarchandises = amountFromEmises((compte) => compte.startsWith('711'))
    const ventesBiensServices = amountFromEmises((compte) => !compte.startsWith('711') && compte.startsWith('7'))
    const variationStocksProduits = amountFromEmises((compte) => compte.startsWith('713'))
    const immobilisationsProduites = 0
    const subventionExploitation = amountFromEmises((compte) => compte.startsWith('741'))
    const autresProduitsExploitation = amountFromEmises((compte) => compte.startsWith('718') || compte.startsWith('719'))
    const reprisesExploitation = amountFromEmises((compte) => compte.startsWith('781') || compte.startsWith('791'))

    const totalI = sum([
      ventesMarchandises,
      ventesBiensServices,
      variationStocksProduits,
      immobilisationsProduites,
      subventionExploitation,
      autresProduitsExploitation,
      reprisesExploitation,
    ])

    const achatsRev = amountFromRecues((compte) => compte.startsWith('611'))
    const achatsConsommes = amountFromRecues((compte) => compte.startsWith('612'))
    const autresChargesExternes = amountFromRecues(
      (compte) => compte.startsWith('613') || compte.startsWith('614') || compte.startsWith('615') || compte.startsWith('616')
    )
    const impotsTaxes = amountFromRecues((compte) => compte.startsWith('63'))
    const chargesPersonnel = amountFromRecues((compte) => compte.startsWith('64') || compte.startsWith('617'))
    const autresChargesExploitation = amountFromRecues((compte) => compte.startsWith('618') || compte.startsWith('619'))
    const dotationsExploitation = amountFromRecues((compte) => compte.startsWith('68'))

    const totalII = sum([
      achatsRev,
      achatsConsommes,
      autresChargesExternes,
      impotsTaxes,
      chargesPersonnel,
      autresChargesExploitation,
      dotationsExploitation,
    ])

    const resultIII = totalI - totalII

    const produitsTitresParticipation = 0
    const gainsChange = 0
    const interetsProduitsFinanciers = 0
    const reprisesFinancieres = 0
    const totalIV = sum([
      produitsTitresParticipation,
      gainsChange,
      interetsProduitsFinanciers,
      reprisesFinancieres,
    ])

    const chargesInterets = 0
    const perteChange = 0
    const fraisCommissions = mouvementsBancaires
      .filter((movement) => /frais|commission/i.test(movement.libelle))
      .reduce((total, movement) => total + Math.abs(movement.montant), 0)
    const autresChargesFinancieres = 0
    const dotationsFinancieres = 0

    const totalV = sum([
      chargesInterets,
      perteChange,
      fraisCommissions,
      autresChargesFinancieres,
      dotationsFinancieres,
    ])

    const resultVI = totalIV - totalV
    const resultVII = resultIII + resultVI

    const produitsCessionsImmobilisations = 0
    const subventionsEquilibre = 0
    const repriseSubventionsInvestissement = 0
    const autresProduitsNonCourants = 0
    const reprisesNonCourantes = 0

    const totalVIII = sum([
      produitsCessionsImmobilisations,
      subventionsEquilibre,
      repriseSubventionsInvestissement,
      autresProduitsNonCourants,
      reprisesNonCourantes,
    ])

    const valeursNettesImmobilisations = 0
    const subventionsAccordees = 0
    const autresChargesNonCourantes = 0
    const dotationsNonCourantes = 0

    const totalIX = sum([
      valeursNettesImmobilisations,
      subventionsAccordees,
      autresChargesNonCourantes,
      dotationsNonCourantes,
    ])

    const resultX = totalVIII - totalIX
    const resultXI = resultVII + resultX

    const isValue = Number.parseFloat(isAmount.replace(',', '.'))
    const impotSocietes = Number.isFinite(isValue) ? isValue : 0

    const resultXIII = resultXI - impotSocietes
    const totalXIV = totalI + totalIV + totalVIII
    const totalXV = totalII + totalV + totalIX + impotSocietes
    const resultXVI = totalXIV - totalXV

    const cpcRows: CpcRow[] = [
      { key: 'section-e', label: 'SECTION E : EXPLOITATION', current: 0, previous: 0, tone: 'section' },
      { key: 'i-title', label: "I. PRODUITS D'EXPLOITATION", current: 0, previous: 0, tone: 'section' },
      { key: 'i-1', label: 'Ventes de marchandises', current: ventesMarchandises, previous: emptyPrevious, bullet: true },
      {
        key: 'i-2',
        label: "Ventes de biens et services produits (Chiffre d'affaires)",
        current: ventesBiensServices,
        previous: emptyPrevious,
        bullet: true,
      },
      { key: 'i-3', label: 'Variation des stocks de produits (1)', current: variationStocksProduits, previous: emptyPrevious, bullet: true },
      { key: 'i-4', label: "Immobilisations produites par l'entreprise elle-même", current: immobilisationsProduites, previous: emptyPrevious, bullet: true },
      { key: 'i-5', label: "Subvention d'exploitation", current: subventionExploitation, previous: emptyPrevious, bullet: true },
      { key: 'i-6', label: "Autres produits d'exploitation", current: autresProduitsExploitation, previous: emptyPrevious, bullet: true },
      { key: 'i-7', label: "Reprises d'exploitation, transferts de charges", current: reprisesExploitation, previous: emptyPrevious, bullet: true },
      { key: 'i-total', label: "TOTAL PRODUITS D'EXPLOITATION (I)", current: totalI, previous: emptyPrevious, tone: 'total' },

      { key: 'ii-title', label: "II. CHARGES D'EXPLOITATION", current: 0, previous: 0, tone: 'section' },
      { key: 'ii-1', label: 'Achats revendus de marchandises (2)', current: achatsRev, previous: emptyPrevious, bullet: true },
      { key: 'ii-2', label: 'Achats consommés de matières et fournitures', current: achatsConsommes, previous: emptyPrevious, bullet: true },
      { key: 'ii-3', label: 'Autres charges externes', current: autresChargesExternes, previous: emptyPrevious, bullet: true },
      { key: 'ii-4', label: 'Impôts et taxes', current: impotsTaxes, previous: emptyPrevious, bullet: true },
      { key: 'ii-5', label: 'Charges de personnel', current: chargesPersonnel, previous: emptyPrevious, bullet: true },
      { key: 'ii-6', label: "Autres charges d'exploitation", current: autresChargesExploitation, previous: emptyPrevious, bullet: true },
      { key: 'ii-7', label: "Dotations d'exploitation", current: dotationsExploitation, previous: emptyPrevious, bullet: true },
      { key: 'ii-total', label: "TOTAL CHARGES D'EXPLOITATION (II)", current: totalII, previous: emptyPrevious, tone: 'total' },

      { key: 'iii', label: "III. RÉSULTAT D'EXPLOITATION", current: resultIII, previous: emptyPrevious, formula: 'III = I - II', tone: 'result' },

      { key: 'section-f', label: 'SECTION F : FINANCIER', current: 0, previous: 0, tone: 'section' },
      { key: 'iv-title', label: 'IV. PRODUITS FINANCIERS', current: 0, previous: 0, tone: 'section' },
      {
        key: 'iv-1',
        label: 'Produits des titres de participation et des autres titres immobilisés',
        current: produitsTitresParticipation,
        previous: emptyPrevious,
        bullet: true,
      },
      { key: 'iv-2', label: 'Gains de change', current: gainsChange, previous: emptyPrevious, bullet: true },
      { key: 'iv-3', label: 'Intérêts et autres produits financiers', current: interetsProduitsFinanciers, previous: emptyPrevious, bullet: true },
      { key: 'iv-4', label: 'Reprises financières, transferts de charges', current: reprisesFinancieres, previous: emptyPrevious, bullet: true },
      { key: 'iv-total', label: 'TOTAL PRODUITS FINANCIERS (IV)', current: totalIV, previous: emptyPrevious, tone: 'total' },

      { key: 'v-title', label: 'V. CHARGES FINANCIÈRES', current: 0, previous: 0, tone: 'section' },
      { key: 'v-1', label: "Charges d'intérêts", current: chargesInterets, previous: emptyPrevious, bullet: true },
      { key: 'v-2', label: 'Perte de change', current: perteChange, previous: emptyPrevious, bullet: true },
      { key: 'v-3', label: 'Frais et commissions bancaires', current: fraisCommissions, previous: emptyPrevious, bullet: true },
      { key: 'v-4', label: 'Autres charges financières', current: autresChargesFinancieres, previous: emptyPrevious, bullet: true },
      { key: 'v-5', label: 'Dotations financières', current: dotationsFinancieres, previous: emptyPrevious, bullet: true },
      { key: 'v-total', label: 'TOTAL CHARGES FINANCIÈRES (V)', current: totalV, previous: emptyPrevious, tone: 'total' },

      { key: 'vi', label: 'VI. RÉSULTAT FINANCIER', current: resultVI, previous: emptyPrevious, formula: 'VI = IV - V', tone: 'result' },
      { key: 'vii', label: 'VII. RÉSULTAT COURANT', current: resultVII, previous: emptyPrevious, formula: 'VII = III + VI', tone: 'result' },

      { key: 'section-nc', label: 'SECTION N.C. : NON COURANT', current: 0, previous: 0, tone: 'section' },
      { key: 'viii-title', label: 'VIII. PRODUITS NON COURANTS', current: 0, previous: 0, tone: 'section' },
      { key: 'viii-1', label: "Produits des cessions d'immobilisations", current: produitsCessionsImmobilisations, previous: emptyPrevious, bullet: true },
      { key: 'viii-2', label: "Subventions d'équilibre", current: subventionsEquilibre, previous: emptyPrevious, bullet: true },
      { key: 'viii-3', label: "Reprise des subventions d'investissement", current: repriseSubventionsInvestissement, previous: emptyPrevious, bullet: true },
      {
        key: 'viii-4',
        label: 'Autres produits non courants (remboursements assurance, pénalités reçues, etc.)',
        current: autresProduitsNonCourants,
        previous: emptyPrevious,
        bullet: true,
      },
      { key: 'viii-5', label: 'Reprises non courantes, transferts de charges', current: reprisesNonCourantes, previous: emptyPrevious, bullet: true },
      { key: 'viii-total', label: 'TOTAL PRODUITS NON COURANTS (VIII)', current: totalVIII, previous: emptyPrevious, tone: 'total' },

      { key: 'ix-title', label: 'IX. CHARGES NON COURANTES', current: 0, previous: 0, tone: 'section' },
      { key: 'ix-1', label: "Valeurs nettes d'amortissements des immobilisations cédées", current: valeursNettesImmobilisations, previous: emptyPrevious, bullet: true },
      { key: 'ix-2', label: 'Subventions accordées', current: subventionsAccordees, previous: emptyPrevious, bullet: true },
      { key: 'ix-3', label: 'Autres charges non courantes', current: autresChargesNonCourantes, previous: emptyPrevious, bullet: true },
      { key: 'ix-4', label: 'Dotations non courantes', current: dotationsNonCourantes, previous: emptyPrevious, bullet: true },
      { key: 'ix-total', label: 'TOTAL CHARGES NON COURANTS (IX)', current: totalIX, previous: emptyPrevious, tone: 'total' },

      { key: 'x', label: 'X. RÉSULTAT NON COURANT', current: resultX, previous: emptyPrevious, formula: 'X = VIII - IX', tone: 'result' },
      { key: 'xi', label: 'XI. RÉSULTAT AVANT IMPÔT', current: resultXI, previous: emptyPrevious, formula: 'XI = VII + X', tone: 'result' },
      { key: 'xii', label: 'XII. IMPÔT SUR LES RÉSULTATS', current: impotSocietes, previous: emptyPrevious, editable: true, tone: 'total' },
      { key: 'xiii', label: 'XIII. RÉSULTAT NET', current: resultXIII, previous: emptyPrevious, formula: 'XIII = XI - XII', tone: 'net' },
      { key: 'xiv', label: 'XIV. TOTAL DES PRODUITS', current: totalXIV, previous: emptyPrevious, formula: 'XIV = I + IV + VIII', tone: 'total' },
      { key: 'xv', label: 'XV. TOTAL DES CHARGES', current: totalXV, previous: emptyPrevious, formula: 'XV = II + V + IX + XII', tone: 'total' },
      { key: 'xvi', label: 'XVI. RÉSULTAT NET', current: resultXVI, previous: emptyPrevious, formula: 'XVI = XIV - XV', tone: 'result' },
    ]

    return cpcRows
  }, [isAmount])

  const toneClass = (tone: RowTone | undefined) => {
    if (tone === 'section') return 'bg-[#F8F9FA] font-semibold uppercase text-xs tracking-wide text-[#334155]'
    if (tone === 'total') return 'bg-[#F1F3F5] font-semibold'
    if (tone === 'result') return 'bg-[#E8ECF0] font-bold'
    if (tone === 'net') return 'bg-[#1B2E5E] text-white font-bold text-base'
    return 'bg-white font-normal'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1B2E5E]">COMPTE DE PRODUITS ET CHARGES</h1>
        <p className="text-sm text-[#64748B]">Norme marocaine (Plan Comptable Marocain)</p>
      </div>

      <Card className="border border-[#DDE3EF] bg-white shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#1B2E5E]">Période</p>
              <Select value={periodType} onValueChange={(value) => setPeriodType(value as 'month' | 'quarter' | 'custom')}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                  <SelectItem value="custom">Plage personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {periodType === 'month' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Mois</p>
                <Input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="w-44" />
              </div>
            )}

            {periodType === 'quarter' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Trimestre</p>
                <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T1 2026">T1 2026</SelectItem>
                    <SelectItem value="T2 2026">T2 2026</SelectItem>
                    <SelectItem value="T3 2026">T3 2026</SelectItem>
                    <SelectItem value="T4 2026">T4 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {periodType === 'custom' && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1B2E5E]">Date début</p>
                  <Input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="w-44" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1B2E5E]">Date fin</p>
                  <Input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="w-44" />
                </div>
              </>
            )}

            <Button className="ml-auto" onClick={() => setHasGenerated(true)}>
              <FileSpreadsheet className="h-4 w-4" />
              Générer le CPC
            </Button>
          </div>

          {hasGenerated && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4" />
                Exporter PDF
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Exporter Excel
              </Button>
            </div>
          )}

          {hasGenerated && (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-white">
                    <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-[#1B2E5E]">Nature</th>
                    <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold text-[#1B2E5E]">Exercice actuel (MAD)</th>
                    <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold text-[#1B2E5E]">Exercice précédent (MAD)</th>
                  </tr>
                  <tr className="bg-white text-xs text-[#64748B]">
                    <th className="border-b border-gray-200 px-4 py-2 text-left font-normal">
                      Période : {selectedPeriodLabel} &nbsp;&nbsp; Société : {COMPANY_NAME}
                    </th>
                    <th className="border-b border-gray-200 px-4 py-2" />
                    <th className="border-b border-gray-200 px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className={toneClass(row.tone)}>
                      <td className="border-b border-gray-200 px-4 py-2 align-top">
                        <div className="flex flex-col">
                          <span className={row.bullet ? 'pl-4' : ''}>{row.bullet ? `• ${row.label}` : row.label}</span>
                          {row.formula && <span className={row.tone === 'net' ? 'text-white/80 text-xs' : 'text-xs text-[#64748B]'}>{row.formula}</span>}
                        </div>
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-right align-middle">
                        {row.editable ? (
                          <Input
                            value={isAmount}
                            onChange={(event) => setIsAmount(event.target.value)}
                            placeholder="0,00"
                            className="ml-auto h-8 w-40 text-right"
                          />
                        ) : (
                          <span className={row.tone === 'net' ? 'font-bold text-white' : `font-medium ${getAmountColor(row.current)}`}>
                            {formatAmount(row.current)}
                          </span>
                        )}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-right align-middle">
                        <span className={row.tone === 'net' ? 'font-bold text-white' : 'font-medium text-[#94A3B8]'}>
                          {formatAmount(row.previous)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
