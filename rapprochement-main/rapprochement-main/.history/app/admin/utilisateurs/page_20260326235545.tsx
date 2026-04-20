'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Plus, Search, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/format'
import { toast } from 'sonner'

interface Tresorier {
  id: string
  name: string
  email: string
  lastLogin: string
  active: boolean
  createdAt: string
}

const mockTresoriers: Tresorier[] = [
  {
    id: 'u1',
    name: 'Ahmed Bekkali',
    email: 'ahmed.bekkali@adria.com',
    lastLogin: '2026-03-26T14:30:00',
    active: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'u2',
    name: 'Fatima Zine',
    email: 'fatima.zine@adria.com',
    lastLogin: '2026-03-24T09:15:00',
    active: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'u3',
    name: 'Mohammed Idrissi',
    email: 'mohammed.idrissi@adria.com',
    lastLogin: '2026-03-20T11:45:00',
    active: false,
    createdAt: '2025-12-10',
  },
]

export default function UtilisateursPage() {
  const [tresoriers, setTresoriers] = useState<Tresorier[]>(mockTresoriers)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<Tresorier | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({})
  const [deleteTarget, setDeleteTarget] = useState<Tresorier | null>(null)
  const [pageSize, setPageSize] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredTresoriers = tresoriers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageSizeValue = Number.parseInt(pageSize, 10)
  const totalPages = Math.max(1, Math.ceil(filteredTresoriers.length / pageSizeValue))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * pageSizeValue
  const paginatedTresoriers = filteredTresoriers.slice(pageStart, pageStart + pageSizeValue)

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '' })
    setShowDialog(true)
  }

  const handleSaveUser = () => {
    const nextErrors: { name?: string; email?: string } = {}
    if (!formData.name.trim()) {
      nextErrors.name = 'Le nom est obligatoire.'
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'L’email est obligatoire.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Format email invalide.'
    }

    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    if (editingUser) {
      setTresoriers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? { ...u, ...formData } : u
        )
      )
      toast.success('Utilisateur modifié avec succès')
    } else {
      const newUser: Tresorier = {
        id: `u${Date.now()}`,
        ...formData,
        lastLogin: new Date().toISOString(),
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setTresoriers((prev) => [...prev, newUser])
      toast.success('Utilisateur créé avec succès')
    }
    setShowDialog(false)
  }

  const handleToggleActive = (userId: string) => {
    setTresoriers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, active: !u.active } : u
      )
    )
  }

  const handleDeleteUser = (userId: string) => {
    setTresoriers((prev) => prev.filter((u) => u.id !== userId))
    toast.success('Utilisateur supprimé')
  }

  const handleConfirmDeleteUser = () => {
    if (!deleteTarget) return
    handleDeleteUser(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1B2E5E]">Gestion des Utilisateurs</h1>
            <p className="text-sm text-[#64748B]">
              Gérez les trésoriers autorisés à accéder à la plateforme
            </p>
          </div>
          <Button
            onClick={handleAddUser}
            className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Trésorier
          </Button>
        </div>

        {/* Users Table */}
        <Card className="border-[#DDE3EF] bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#1B2E5E]">Trésoriers</CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#DDE3EF]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTresoriers.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[#64748B]">Aucun trésorier trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F4F6FB]">
                      <TableHead className="text-[#1B2E5E]">Nom</TableHead>
                      <TableHead className="text-[#1B2E5E]">Email</TableHead>
                      <TableHead className="text-[#1B2E5E]">Dernière connexion</TableHead>
                      <TableHead className="text-[#1B2E5E]">Statut</TableHead>
                      <TableHead className="text-[#1B2E5E]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTresoriers.map((user) => (
                      <TableRow key={user.id} className="border-[#DDE3EF] hover:bg-[#F4F6FB]">
                        <TableCell className="font-medium text-[#1B2E5E]">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-[#64748B]">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-[#64748B]">
                          {formatDate(user.lastLogin)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={
                                user.active
                                  ? 'bg-[#16A34A]/10 text-[#16A34A]'
                                  : 'bg-[#64748B]/10 text-[#64748B]'
                              }
                            >
                              {user.active ? 'Actif' : 'Inactif'}
                            </Badge>
                            <Switch
                              checked={user.active}
                              onCheckedChange={() => handleToggleActive(user.id)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user)
                                setFormData({ name: user.name, email: user.email })
                                setShowDialog(true)
                              }}
                              className="text-[#3B6FD4]"
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#DC2626] hover:bg-[#DC2626]/10"
                              onClick={() => setDeleteTarget(user)}
                            >
                              <Trash2 className="h-4 w-4" />
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
                <span>{paginatedTresoriers.length} de {filteredTresoriers.length} résultats</span>
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

      {/* User Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1B2E5E]">
              {editingUser ? 'Modifier le trésorier' : 'Ajouter un trésorier'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#1B2E5E]">Nom</Label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                  setFormErrors((prev) => ({ ...prev, name: undefined }))
                }}
                className={`border-[#DDE3EF] ${formErrors.name ? 'border-[#DC2626]' : ''}`}
                placeholder="Prénom Nom"
              />
              {formErrors.name && <p className="text-xs text-[#DC2626]">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[#1B2E5E]">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                  setFormErrors((prev) => ({ ...prev, email: undefined }))
                }}
                className={`border-[#DDE3EF] ${formErrors.email ? 'border-[#DC2626]' : ''}`}
                placeholder="email@adria.com"
              />
              {formErrors.email && <p className="text-xs text-[#DC2626]">{formErrors.email}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-[#DDE3EF]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveUser}
              className="bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
            >
              {editingUser ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l’utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement <strong>{deleteTarget?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-[#DC2626] text-white hover:bg-[#DC2626]/90" onClick={handleConfirmDeleteUser}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
