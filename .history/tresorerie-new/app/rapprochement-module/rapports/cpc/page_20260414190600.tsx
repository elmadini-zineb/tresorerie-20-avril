'use client'

import { useMemo, useState, Fragment } from 'react'
import { Download, FileText, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'
import { exportReportPdf, exportReportExcel } from '@/lib/report-export'
import { formatAmount } from '@/lib/rapprochement-format'

type SectionCode = 'E' | 'F' | 'NC'
type PeriodMode = 'mois' | 'trimestre' | 'semestre' | 'personnalise'
type PeriodKey = 'T1-2026' | 'T2-2026'

type Section = {
  sectionLabel: string
  produitsTitle: string
  chargesTitle: string
  produits: Array<{ label: string; amount: number }>
  charges: Array<{ label: string; amount: number }>
}

const CPC_SECTIONS: Record<PeriodKey, Record<SectionCode, Section>> = {
  'T1-2026': {
    E: { sectionLabel: 'Exploitation', produits: [], charges: [], produitsTitle: 'Produits', chargesTitle: 'Charges' },
    F: { sectionLabel: 'Financier', produits: [], charges: [], produitsTitle: 'Produits financiers', chargesTitle: 'Charges financières' },
    NC: { sectionLabel: 'Non courant', produits: [], charges: [], produitsTitle: 'Produits non courants', chargesTitle: 'Charges non courantes' },
  },
  'T2-2026': {
    E: { sectionLabel: 'Exploitation', produits: [], charges: [], produitsTitle: 'Produits', chargesTitle: 'Charges' },
    F: { sectionLabel: 'Financier', produits: [], charges: [], produitsTitle: 'Produits financiers', chargesTitle: 'Charges financières' },
    NC: { sectionLabel: 'Non courant', produits: [], charges: [], produitsTitle: 'Produits non courants', chargesTitle: 'Charges non courantes' },
  },
}

function total(lines: Array<{ amount: number }>) {
  return lines.reduce((acc, line) => acc + line.amount, 0)
}

export default function CPCReportPage() {
  const [periodMode, setPeriodMode] = useState<PeriodMode>('trimestre')
  const [month, setMonth] = useState('Mars')
  const [quarter, setQuarter] = useState('T1')
  const [semester, setSemester] = useState('S1')
  const [year, setYear] = useState('2026')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [selectedKey, setSelectedKey] = useState<PeriodKey>('T1-2026')
  const [isAmount, setIsAmount] = useState('0')
  const [expanded, setExpanded] = useState<Record<SectionCode, boolean>>({ E: false, F: false, NC: false })

  const periodLabel = useMemo(() => {
    if (periodMode === 'mois') return `${month} ${year}`
    if (periodMode === 'trimestre') return `${quarter} ${year}`
    if (periodMode === 'semestre') return `${semester} ${year}`
    return dateStart && dateEnd ? `${dateStart} au ${dateEnd}` : 'Période personnalisée'
  }, [periodMode, month, quarter, semester, year, dateStart, dateEnd])

  const sections = CPC_SECTIONS[selectedKey]

  const summary = useMemo(() => {
    const eProducts = total(sections.E.produits)
    const eCharges = total(sections.E.charges)
    const eResult = eProducts - eCharges

    const fProducts = total(sections.F.produits)
    const fCharges = total(sections.F.charges)
    const fResult = fProducts - fCharges

    const ncProducts = total(sections.NC.produits)
    const ncCharges = total(sections.NC.charges)
    const ncResult = ncProducts - ncCharges

    const brutAvantIS = eResult + fResult + ncResult
    const isValue = Number.isFinite(Number.parseFloat(isAmount.replace(',', '.')))
      ? Number.parseFloat(isAmount.replace(',', '.'))
      : 0
    const net = brutAvantIS - isValue

    return {
      eProducts,
      eCharges,
      eResult,
      fProducts,
      fCharges,
      fResult,
      ncProducts,
      ncCharges,
      ncResult,
      brutAvantIS,
      isValue,
      net,
    }
  }, [sections, isAmount])

  const detailedPdfSections = useMemo(() => {
    const toRows = (code: SectionCode) => {
      const section = sections[code]
      const products = total(section.produits)
      const charges = total(section.charges)
      const result = products - charges
      const resultLabel = code === 'E' ? "Résultat d'exploitation" : code === 'F' ? 'Résultat financier' : 'Résultat non courant'

      return {
        title: section.sectionLabel,
        rows: [
          { label: section.produitsTitle, value: formatAmount(products) },
          ...section.produits.map((row) => ({ label: `• ${row.label}`, value: formatAmount(row.amount) })),
          { label: section.chargesTitle, value: formatAmount(charges) },
          ...section.charges.map((row) => ({ label: `• ${row.label}`, value: formatAmount(row.amount) })),
          { label: resultLabel, value: formatAmount(result) },
        ],
      }
    }

    return [
      toRows('E'),
      toRows('F'),
      {
        ...toRows('NC'),
        rows: [
          ...toRows('NC').rows,
          { label: 'Résultat brut avant IS', value: formatAmount(summary.brutAvantIS) },
          { label: 'IS', value: formatAmount(summary.isValue) },
          { label: 'Résultat net', value: formatAmount(summary.net) },
        ],
      },
    ]
  }, [sections, summary])

  const detailedExcelRows = useMemo(() => {
    const rows: Array<Record<string, string | number>> = []

    ;(['E', 'F', 'NC'] as SectionCode[]).forEach((code) => {
      const section = sections[code]
      const products = total(section.produits)
      const charges = total(section.charges)
      const result = products - charges
      const resultLabel = code === 'E' ? "Résultat d'exploitation" : code === 'F' ? 'Résultat financier' : 'Résultat non courant'

      rows.push({ Rubrique: section.sectionLabel, Montant: '' })
      rows.push({ Rubrique: section.produitsTitle, Montant: products })
      section.produits.forEach((row) => rows.push({ Rubrique: `• ${row.label}`, Montant: row.amount }))
      rows.push({ Rubrique: section.chargesTitle, Montant: charges })
      section.charges.forEach((row) => rows.push({ Rubrique: `• ${row.label}`, Montant: row.amount }))
      rows.push({ Rubrique: resultLabel, Montant: result })
    })

    rows.push({ Rubrique: 'Résultat brut avant IS', Montant: summary.brutAvantIS })
    rows.push({ Rubrique: 'IS', Montant: summary.isValue })
    rows.push({ Rubrique: 'Résultat net', Montant: summary.net })

    return rows
  }, [sections, summary])

  const handleGenerate = () => {
    // RG-CPC-7: Validate that IS (Impôt sur les Sociétés) is not empty
    const isValue = parseFloat(isAmount.replace(',', '.'))
    if (isNaN(isValue) || isValue === 0) {
      toast({
        title: 'Erreur',
        description: 'Le champ IS (Impôt sur les Sociétés) est obligatoire. Veuillez renseigner une valeur.',
        variant: 'destructive',
      })
      return
    }

    if (periodMode === 'personnalise' && (!dateStart || !dateEnd)) {
      toast.error('Veuillez renseigner une date de début et de fin pour la période personnalisée.')
      return
    }

    let key: PeriodKey = 'T1-2026'

    if (periodMode === 'trimestre') {
      key = quarter === 'T2' ? 'T2-2026' : 'T1-2026'
    } else if (periodMode === 'semestre') {
      key = semester === 'S2' ? 'T2-2026' : 'T1-2026'
    } else if (periodMode === 'mois') {
      key = ['Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].includes(month)
        ? 'T2-2026'
        : 'T1-2026'
    } else if (periodMode === 'personnalise') {
      key = dateStart >= '2026-04-01' ? 'T2-2026' : 'T1-2026'
    }

    setSelectedKey(key)
    toast.success('Rapport CPC généré avec succès')
  }

  const handleExportPdf = async () => {
    await exportReportPdf({
      reportName: 'Rapport CPC',
      periodLabel,
      companyName: 'Adria Treasury',
      generatedAt: new Date(),
      sections: detailedPdfSections,
    })
  }

  const handleExportExcel = async () => {
    await exportReportExcel({
      fileName: `cpc_${selectedKey.toLowerCase()}`,
      sheetName: 'CPC',
      rows: detailedExcelRows,
    })
  }

  const sectionResultLabel = (code: SectionCode) => {
    if (code === 'E') return "Résultat d'exploitation"
    if (code === 'F') return 'Résultat financier'
    return 'Résultat non courant'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2E5E]">COMPTE DE PRODUITS ET CHARGES</h1>
      </div>

      <Card className="border-[#DDE3EF] bg-white shadow-sm">
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#1B2E5E]">Période</p>
            <Select value={periodMode} onValueChange={(value) => setPeriodMode(value as PeriodMode)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mois">Mois</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="semestre">Semestre</SelectItem>
                <SelectItem value="personnalise">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {periodMode === 'mois' && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Mois</p>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'].map((value) => (
                      <SelectItem key={value} value={value}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Année</p>
                <Input value={year} onChange={(event) => setYear(event.target.value)} className="w-28" />
              </div>
            </>
          )}

          {periodMode === 'trimestre' && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Trimestre</p>
                <Select value={quarter} onValueChange={setQuarter}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['T1','T2','T3','T4'].map((value) => (<SelectItem key={value} value={value}>{value}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Année</p>
                <Input value={year} onChange={(event) => setYear(event.target.value)} className="w-28" />
              </div>
            </>
          )}

          {periodMode === 'semestre' && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Semestre</p>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['S1','S2'].map((value) => (<SelectItem key={value} value={value}>{value}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Année</p>
                <Input value={year} onChange={(event) => setYear(event.target.value)} className="w-28" />
              </div>
            </>
          )}

          {periodMode === 'personnalise' && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Date début</p>
                <Input type="date" value={dateStart} onChange={(event) => setDateStart(event.target.value)} className="w-44" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B2E5E]">Date fin</p>
                <Input type="date" value={dateEnd} onChange={(event) => setDateEnd(event.target.value)} className="w-44" />
              </div>
            </>
          )}

          <Button className="ml-auto bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90" onClick={handleGenerate}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Générer
          </Button>

          <Button variant="outline" onClick={handleExportPdf}><FileText className="mr-2 h-4 w-4" />PDF</Button>
          <Button variant="outline" onClick={handleExportExcel}><Download className="mr-2 h-4 w-4" />Excel</Button>
        </CardContent>
      </Card>

      <Card className="border-[#DDE3EF] bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#F4F6FB]">
                  <th className="border-b border-[#DDE3EF] px-4 py-3 text-left font-semibold text-[#1B2E5E]">Rubrique</th>
                  <th className="border-b border-[#DDE3EF] px-4 py-3 text-right font-semibold text-[#1B2E5E]">Montant (MAD)</th>
                </tr>
              </thead>
              <tbody>
                {(['E', 'F', 'NC'] as SectionCode[]).map((code) => {
                  const section = sections[code]
                  const products = total(section.produits)
                  const charges = total(section.charges)
                  const result = products - charges
                  const isOpen = expanded[code]

                  return (
                    <Fragment key={code}>
                      <tr key={`${code}-header`} className="bg-[#F8FAFC]">
                        <td className="border-b border-[#DDE3EF] px-4 py-3 font-semibold text-[#1B2E5E]">
                          <div className="flex items-center justify-between gap-2">
                            <span>{section.sectionLabel}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[#3B6FD4]"
                              onClick={() => setExpanded((prev) => ({ ...prev, [code]: !prev[code] }))}
                            >
                              {isOpen ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
                              {isOpen ? 'Masquer les détails' : 'Plus de détails'}
                            </Button>
                          </div>
                        </td>
                        <td className="border-b border-[#DDE3EF] px-4 py-3" />
                      </tr>

                      <tr key={`${code}-products`}>
                        <td className="border-b border-[#DDE3EF] px-4 py-2 text-[#1B2E5E]">{section.produitsTitle}</td>
                        <td className="border-b border-[#DDE3EF] px-4 py-2 text-right font-mono">{formatAmount(products)}</td>
                      </tr>

                      {isOpen && section.produits.map((row) => (
                        <tr key={`${code}-p-${row.label}`} className="bg-[#FAFBFC]">
                          <td className="border-b border-[#DDE3EF] px-4 py-2 pl-8 text-[#64748B]">• {row.label}</td>
                          <td className="border-b border-[#DDE3EF] px-4 py-2 text-right font-mono text-[#64748B]">{formatAmount(row.amount)}</td>
                        </tr>
                      ))}

                      <tr key={`${code}-charges`}>
                        <td className="border-b border-[#DDE3EF] px-4 py-2 text-[#1B2E5E]">{section.chargesTitle}</td>
                        <td className="border-b border-[#DDE3EF] px-4 py-2 text-right font-mono">{formatAmount(charges)}</td>
                      </tr>

                      {isOpen && section.charges.map((row) => (
                        <tr key={`${code}-c-${row.label}`} className="bg-[#FAFBFC]">
                          <td className="border-b border-[#DDE3EF] px-4 py-2 pl-8 text-[#64748B]">• {row.label}</td>
                          <td className="border-b border-[#DDE3EF] px-4 py-2 text-right font-mono text-[#64748B]">{formatAmount(row.amount)}</td>
                        </tr>
                      ))}

                      <tr key={`${code}-result`} className="bg-[#F1F5F9]">
                        <td className="border-b border-[#DDE3EF] px-4 py-2 font-semibold text-[#1B2E5E]">{sectionResultLabel(code)}</td>
                        <td className="border-b border-[#DDE3EF] px-4 py-2 text-right font-mono font-semibold text-[#1B2E5E]">{formatAmount(result)}</td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#DDE3EF] bg-white shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex justify-between"><span>Résultat brut avant IS</span><span className="font-mono">{formatAmount(summary.brutAvantIS)}</span></div>
          <div className="flex items-center justify-between gap-2">
            <span>IS (Impôt sur les résultats)</span>
            <Input value={isAmount} onChange={(event) => setIsAmount(event.target.value)} className="w-32 text-right" />
          </div>
          <div className="flex justify-between border-t border-[#DDE3EF] pt-2 text-lg font-bold text-[#1B2E5E]">
            <span>RÉSULTAT NET</span>
            <span className="font-mono">{formatAmount(summary.net)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
