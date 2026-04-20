'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { invoices } from '@/lib/mock-data'
import type { Invoice } from '@/lib/types'
import { formatAmount } from '@/lib/format'
import { Check, X, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function ValidationPage() {
  // Get invoices with JUSTIFIÉ status
  const justifiedInvoices = invoices.filter((inv) => inv.status === 'JUSTIFIE')

  const [invoicesList, setInvoicesList] = useState<Invoice[]>(justifiedInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [justification, setJustification] = useState('')
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'reject'; invoice: Invoice } | null>(null)
  const [pageSize, setPageSize] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)

  const pageSizeValue = Number.parseInt(pageSize, 10)
  const totalPages = Math.max(1, Math.ceil(invoicesList.length / pageSizeValue))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * pageSizeValue
  const paginatedInvoices = invoicesList.slice(pageStart, pageStart + pageSizeValue)

  const handleApprove = (invoiceId: string) => {
    setInvoicesList((prev) => prev.filter((inv) => inv.id !== invoiceId))
    toast.success('Facture approuvée')
  }

  const handleReject = (invoiceId: string) => {
    setInvoicesList((prev) => prev.filter((inv) => inv.id !== invoiceId))
    toast.success('Facture rejetée')
  }

  const handleViewJustification = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setJustification(invoice.description || '')
    setShowDialog(true)
  }

  const handleConfirmAction = () => {
    if (!pendingAction) return
    if (pendingAction.type === 'approve') {
      handleApprove(pendingAction.invoice.id)
    } else {
      handleReject(pendingAction.invoice.id)
    }
    setPendingAction(null)
  }

  return (
    <>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1B2E5E]">File de Validation</h1>
          <p className="text-sm text-[#64748B]">
            Factures en attente d&apos;approbation par le trésorier
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-[#DDE3EF] bg-white p-4">
            <p className="text-sm text-[#64748B]">En attente d&apos;approbation</p>
            <p className="text-3xl font-bold text-[#1B2E5E]">{invoicesList.length}</p>
          </div>
        </div>

        {/* Validation Table */}
        <Card className="border-[#DDE3EF] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1B2E5E]">Factures justifiées</CardTitle>
          </CardHeader>
          <CardContent>
            {invoicesList.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[#64748B]">Aucune facture en attente de validation</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F4F6FB]">
                      <TableHead className="text-[#1B2E5E]">N° Facture</TableHead>
                      <TableHead className="text-[#1B2E5E]">Tiers</TableHead>
                      <TableHead className="text-[#1B2E5E]">Montant TTC</TableHead>
                      <TableHead className="text-[#1B2E5E]">Justification</TableHead>
                      <TableHead className="text-[#1B2E5E]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-[#DDE3EF] hover:bg-[#F4F6FB]">
                        <TableCell className="font-medium text-[#1B2E5E]">
                          {invoice.numero}
                        </TableCell>
                        <TableCell className="text-[#64748B]">{invoice.tiersNom}</TableCell>
                        <TableCell className="font-mono text-[#1B2E5E]">
                          {formatAmount(invoice.montantTTC)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#3B6FD4]"
                            onClick={() => handleViewJustification(invoice)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Voir
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#16A34A] hover:bg-[#16A34A]/10"
                              onClick={() => setPendingAction({ type: 'approve', invoice })}
                              title="Approuver"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#DC2626] hover:bg-[#DC2626]/10"
                              onClick={() => setPendingAction({ type: 'reject', invoice })}
                              title="Rejeter"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-[#DDE3EF] pt-3 text-sm text-[#64748B]">
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-3">
                <span>{paginatedInvoices.length} de {invoicesList.length} résultats</span>
                <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>
                  Précédent
                </Button>
                <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}>
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Justification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1B2E5E]">
              Justification — {selectedInvoice?.numero}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-[#64748B]">Facture</p>
                <p className="font-medium text-[#1B2E5E]">{selectedInvoice?.numero}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Tiers</p>
                <p className="font-medium text-[#1B2E5E]">{selectedInvoice?.tiersNom}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Montant TTC</p>
                <p className="font-medium text-[#1B2E5E]">
                  {selectedInvoice && formatAmount(selectedInvoice.montantTTC)}
                </p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#1B2E5E]">Justification soumise</p>
              <Textarea
                value={justification}
                readOnly
                className="min-h-32 border-[#DDE3EF] bg-[#F4F6FB]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-[#DDE3EF]"
            >
              Fermer
            </Button>
            <Button
              className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
              onClick={() => {
                handleApprove(selectedInvoice?.id || '')
                setShowDialog(false)
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Approuver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.type === 'approve' ? 'Approuver la facture' : 'Rejeter la facture'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.type === 'approve'
                ? `Confirmez l’approbation de ${pendingAction?.invoice.numero}.`
                : `Confirmez le rejet de ${pendingAction?.invoice.numero}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className={pendingAction?.type === 'approve' ? 'bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90' : 'bg-[#DC2626] text-white hover:bg-[#DC2626]/90'}
              onClick={handleConfirmAction}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
