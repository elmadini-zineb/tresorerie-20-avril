'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Archive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { FournisseurForm } from '@/components/fournisseurs/fournisseur-form'
import { fournisseurs as mockFournisseurs } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState(mockFournisseurs)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [archiveDialog, setArchiveDialog] = useState<{ open: boolean; id: string | null; action: 'archive' | 'delete' }>({
    open: false,
    id: null,
    action: 'archive',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  const filteredFournisseurs = fournisseurs.filter(
    (f) => !f.archived && (f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const paginatedFournisseurs = filteredFournisseurs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredFournisseurs.length / itemsPerPage)

  const handleSave = (formData: any) => {
    if (editingId) {
      setFournisseurs(fournisseurs.map((f) => (f.id === editingId ? { ...f, ...formData } : f)))
      toast({ title: 'Succès', description: 'Fournisseur mis à jour avec succès' })
    } else {
      setFournisseurs([
        ...fournisseurs,
        {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      toast({ title: 'Succès', description: 'Fournisseur créé avec succès' })
    }
    setOpenDialog(false)
    setEditingId(null)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setOpenDialog(true)
  }

  const handleArchive = (id: string) => {
    setFournisseurs(fournisseurs.map((f) => (f.id === id ? { ...f, statut: 'Inactif' } : f)))
    toast({ title: 'Succès', description: 'Fournisseur archivé avec succès' })
  }

  const handleDelete = (id: string) => {
    setFournisseurs(fournisseurs.filter((f) => f.id !== id))
    toast({ title: 'Succès', description: 'Fournisseur supprimé avec succès' })
  }

  const editingFournisseur = editingId ? fournisseurs.find((f) => f.id === editingId) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1B2E5E]">Fournisseurs</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingId(null)}
              className="bg-[#3B6FD4] hover:bg-[#2E5BB8] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Modifier' : 'Ajouter'} un fournisseur</DialogTitle>
              <DialogDescription>
                {editingId ? 'Modifiez les informations du fournisseur' : 'Remplissez les informations du nouveau fournisseur'}
              </DialogDescription>
            </DialogHeader>
            <FournisseurForm initialData={editingFournisseur} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-gray-200 bg-white shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des fournisseurs ({filteredFournisseurs.length})</CardTitle>
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-64 border border-gray-200 bg-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-left text-[#64748B]">Nom</TableHead>
                <TableHead className="text-left text-[#64748B]">Email</TableHead>
                <TableHead className="text-left text-[#64748B]">Téléphone</TableHead>
                <TableHead className="text-left text-[#64748B]">Adresse</TableHead>
                <TableHead className="text-left text-[#64748B]">Statut</TableHead>
                <TableHead className="text-center text-[#64748B]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFournisseurs.length > 0 ? (
                paginatedFournisseurs.map((fournisseur) => (
                  <TableRow key={fournisseur.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="text-[#1B2E5E]">{fournisseur.raisonSociale}</TableCell>
                    <TableCell className="text-[#64748B]">{fournisseur.emailFacturation}</TableCell>
                    <TableCell className="text-[#64748B]">{fournisseur.telephone}</TableCell>
                    <TableCell className="text-[#64748B]">{fournisseur.adresse}</TableCell>
                    <TableCell>
                      <Badge variant={fournisseur.statut === 'Actif' ? 'default' : 'outline'} className={fournisseur.statut === 'Actif' ? 'bg-[#10B981] text-white' : ''}>
                        {fournisseur.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(fournisseur.id)}>
                        <Pencil className="h-4 w-4 text-[#3B6FD4]" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setArchiveDialog({ open: true, id: fournisseur.id, action: 'archive' })}>
                            <Archive className="h-4 w-4 text-[#D97706]" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Archiver ce fournisseur ?</AlertDialogTitle>
                            <AlertDialogDescription>Cette action ne peut pas être annulée.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogAction onClick={() => handleArchive(fournisseur.id)}>Archiver</AlertDialogAction>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setArchiveDialog({ open: true, id: fournisseur.id, action: 'delete' })}>
                            <Trash2 className="h-4 w-4 text-[#DC2626]" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ce fournisseur ?</AlertDialogTitle>
                            <AlertDialogDescription>Cette action ne peut pas être annulée.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogAction onClick={() => handleDelete(fournisseur.id)}>Supprimer</AlertDialogAction>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-[#64748B]">
                    Aucun fournisseur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                Première
              </Button>
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Précédente
              </Button>
              <span className="text-sm text-[#64748B]">
                Page {currentPage} sur {totalPages}
              </span>
              <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                Suivante
              </Button>
              <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                Dernière
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
