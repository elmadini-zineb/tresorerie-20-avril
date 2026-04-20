'use client'

import { useState } from 'react'
import { Plus, Search, Pencil, Archive } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { fournisseurs as initialFournisseurs } from '@/lib/mock-data'
import type { Fournisseur } from '@/lib/types'
import { getStatusColor } from '@/lib/format'
import { FournisseurForm } from '@/components/fournisseurs/fournisseur-form'
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
import { toast } from 'sonner'

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>(initialFournisseurs)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<Fournisseur | null>(null)
  const [pageSize, setPageSize] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredFournisseurs = fournisseurs.filter(
    (f) =>
      f.raisonSociale.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.ice.includes(searchQuery) ||
      f.ville.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageSizeValue = Number.parseInt(pageSize, 10)
  const totalPages = Math.max(1, Math.ceil(filteredFournisseurs.length / pageSizeValue))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * pageSizeValue
  const paginatedFournisseurs = filteredFournisseurs.slice(pageStart, pageStart + pageSizeValue)
  const displayedCount = paginatedFournisseurs.length

  const handleSave = (fournisseur: Fournisseur) => {
    if (editingFournisseur) {
      setFournisseurs((prev) =>
        prev.map((f) => (f.id === fournisseur.id ? fournisseur : f))
      )
      toast.success('Fournisseur modifié avec succès')
    } else {
      setFournisseurs((prev) => [...prev, { ...fournisseur, id: `f${Date.now()}` }])
      toast.success('Fournisseur créé avec succès')
    }
    setShowForm(false)
    setEditingFournisseur(null)
  }

  const handleArchive = () => {
    if (archiveTarget) {
      setFournisseurs((prev) =>
        prev.map((f) =>
          f.id === archiveTarget.id ? { ...f, statut: 'Inactif' } : f
        )
      )
      toast.success('Fournisseur archivé avec succès')
      setArchiveTarget(null)
    }
  }

  if (showForm) {
    return (
      <FournisseurForm
        fournisseur={editingFournisseur}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false)
          setEditingFournisseur(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2E5E]">Fournisseurs</h1>
        <Button
          className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
          onClick={() => setShowForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Fournisseur
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <Input
            placeholder="Rechercher par nom, ICE ou ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#DDE3EF]"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-[#DDE3EF] bg-white shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#DDE3EF] bg-[#F4F6FB]">
                <TableHead className="font-semibold text-[#1B2E5E]">Raison Sociale</TableHead>
                <TableHead className="font-semibold text-[#1B2E5E]">ICE</TableHead>
                <TableHead className="font-semibold text-[#1B2E5E]">Ville</TableHead>
                <TableHead className="font-semibold text-[#1B2E5E]">Mode de paiement</TableHead>
                <TableHead className="font-semibold text-[#1B2E5E]">TVA par défaut</TableHead>
                <TableHead className="font-semibold text-[#1B2E5E]">Délai (j)</TableHead>
                <TableHead className="font-semibold text-[#1B2E5E]">Statut</TableHead>
                <TableHead className="font-semibold text-[#1B2E5E]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFournisseurs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#64748B]">
                      <Archive className="h-8 w-8" />
                      <p>Aucun fournisseur enregistré. Cliquez sur + Nouveau Fournisseur pour commencer.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedFournisseurs.map((fournisseur) => (
                  <TableRow
                    key={fournisseur.id}
                    className="border-[#DDE3EF] hover:bg-[#F4F6FB]"
                  >
                    <TableCell className="font-medium text-[#1B2E5E]">
                      {fournisseur.raisonSociale}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-[#64748B]">
                      {fournisseur.ice}
                    </TableCell>
                    <TableCell className="text-[#64748B]">{fournisseur.ville}</TableCell>
                    <TableCell className="text-[#64748B]">{fournisseur.modePaiement}</TableCell>
                    <TableCell className="text-[#64748B]">{fournisseur.tauxTvaDefaut}%</TableCell>
                    <TableCell className="text-[#64748B]">{fournisseur.delaiPaiement}j</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(fournisseur.statut)}>
                        {fournisseur.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#64748B] hover:text-[#1B2E5E]"
                          onClick={() => {
                            setEditingFournisseur(fournisseur)
                            setShowForm(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#64748B] hover:text-[#DC2626]"
                          onClick={() => setArchiveTarget(fournisseur)}
                        >
                          <Archive className="h-4 w-4" />
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
              <span>{displayedCount} de {filteredFournisseurs.length} résultats</span>
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

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={!!archiveTarget} onOpenChange={() => setArchiveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1B2E5E]">Archiver le fournisseur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir archiver le fournisseur{' '}
              <strong>{archiveTarget?.raisonSociale}</strong> ? Cette action changera son statut
              en Inactif.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#DDE3EF]">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-[#DC2626] text-white hover:bg-[#DC2626]/90"
            >
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
