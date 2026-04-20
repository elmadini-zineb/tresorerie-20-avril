'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, FileText, Search, Filter, Eye, Pencil, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { invoices as initialInvoices } from '@/lib/mock-data'
import type { Invoice, InvoiceType } from '@/lib/types'
import { formatAmount, formatDate, getStatusColor, getStatusLabel, getSourceColor } from '@/lib/format'
import { InvoiceForm } from '@/components/factures/invoice-form'
import { Skeleton } from '@/components/ui/skeleton'

function FacturesPageContent() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [activeTab, setActiveTab] = useState<InvoiceType>(typeParam === 'emises' ? 'EMISE' : 'RECUE')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [pageSize, setPageSize] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (typeParam === 'emises') {
      setActiveTab('EMISE')
    } else if (typeParam === 'recues') {
      setActiveTab('RECUE')
    }
  }, [typeParam])

  const filteredInvoices = invoices.filter((inv) => {
    const matchesType = inv.type === activeTab
    const matchesSearch =
      inv.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.tiersNom.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchesType && matchesSearch && matchesStatus
  })

  const pageSizeValue = Number.parseInt(pageSize, 10)
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSizeValue))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * pageSizeValue
  const paginatedInvoices = filteredInvoices.slice(pageStart, pageStart + pageSizeValue)
  const displayedCount = paginatedInvoices.length

  const handleSave = (invoice: Invoice) => {
    if (editingInvoice) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoice.id ? invoice : inv))
      )
    } else {
      setInvoices((prev) => [...prev, { ...invoice, id: `inv${Date.now()}` }])
    }
    setShowForm(false)
    setEditingInvoice(null)
  }

  if (showForm) {
    return (
      <InvoiceForm
        invoice={editingInvoice}
        invoiceType={activeTab}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false)
          setEditingInvoice(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1B2E5E]">Factures</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-[#3B6FD4] text-[#3B6FD4] hover:bg-[#3B6FD4]/10"
              onClick={() => {
                setEditingInvoice(null)
                setShowForm(true)
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Uploader une facture (OCR)
            </Button>
            <Button
              className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
              onClick={() => {
                setEditingInvoice(null)
                setShowForm(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Facture
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InvoiceType)}>
          <TabsList className="bg-white border border-[#DDE3EF]">
            <TabsTrigger
              value="RECUE"
              className="data-[state=active]:bg-[#DC2626]/10 data-[state=active]:text-[#DC2626]"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#DC2626]" />
                Factures Reçues — DÉBIT
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="EMISE"
              className="data-[state=active]:bg-[#16A34A]/10 data-[state=active]:text-[#16A34A]"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#16A34A]" />
                Factures Émises — CRÉDIT
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <Input
                  placeholder="Rechercher par numéro ou tiers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#DDE3EF]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 border-[#DDE3EF]">
                  <Filter className="mr-2 h-4 w-4 text-[#64748B]" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  <SelectItem value="RAPPROCHE">Rapprochée</SelectItem>
                  <SelectItem value="ECART_DETECTE">Écart détecté</SelectItem>
                  <SelectItem value="NON_RAPPROCHE">Non rapprochée</SelectItem>
                  <SelectItem value="JUSTIFIE">Justifié</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Card className="border-[#DDE3EF] bg-white shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#DDE3EF] bg-[#F4F6FB]">
                      <TableHead className="font-semibold text-[#1B2E5E]">N° Facture</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">
                        {activeTab === 'RECUE' ? 'Fournisseur' : 'Client'}
                      </TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Date Facture</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Date Échéance</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant HT</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E] text-right">TVA</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E] text-right">Montant TTC</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Statut</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Source</TableHead>
                      <TableHead className="font-semibold text-[#1B2E5E]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-[#64748B]">
                            <FileText className="h-8 w-8" />
                            <p>Aucune facture enregistrée. Cliquez sur + Nouvelle Facture pour commencer.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedInvoices.map((invoice) => (
                        <TableRow
                          key={invoice.id}
                          className="border-[#DDE3EF] hover:bg-[#F4F6FB]"
                        >
                          <TableCell className="font-medium text-[#1B2E5E]">
                            {invoice.numero}
                          </TableCell>
                          <TableCell className="text-[#64748B]">{invoice.tiersNom}</TableCell>
                          <TableCell className="text-[#64748B]">
                            {formatDate(invoice.dateEmission)}
                          </TableCell>
                          <TableCell className="text-[#64748B]">
                            {formatDate(invoice.dateEcheance)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-[#1B2E5E]">
                            {formatAmount(invoice.montantHT)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-[#64748B]">
                            {formatAmount(invoice.montantTva)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-[#1B2E5E]">
                            {formatAmount(invoice.montantTTC)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(invoice.status)}>
                              {getStatusLabel(invoice.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSourceColor(invoice.source)}>
                              {invoice.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#64748B] hover:text-[#1B2E5E]"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#64748B] hover:text-[#1B2E5E]"
                                onClick={() => {
                                  setEditingInvoice(invoice)
                                  setShowForm(true)
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-[#DDE3EF] px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-[#64748B]">
                    <span>Afficher</span>
                    <Select value={pageSize} onValueChange={(value) => { setPageSize(value); setCurrentPage(1) }}>
                      <SelectTrigger className="h-8 w-20 border-[#DDE3EF]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>par page</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#64748B]">
                    <span>{displayedCount} de {filteredInvoices.length} résultats</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage <= 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage >= totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}

export default function FacturesPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    }>
      <FacturesPageContent />
    </Suspense>
  )
}
