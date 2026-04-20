"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { enterpriseClients } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/format"
import type { EnterpriseClient } from "@/lib/types"

export default function AdminPage() {
  const [clients, setClients] = useState<EnterpriseClient[]>(enterpriseClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<EnterpriseClient | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EnterpriseClient | null>(null)
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredClients = clients.filter(
    (client) =>
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ice.includes(searchTerm)
  )

  const totalActiveClients = clients.filter((c) => c.status === "active").length
  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyFee, 0)
  const pageSizeValue = Number.parseInt(pageSize, 10)
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSizeValue))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * pageSizeValue
  const paginatedClients = filteredClients.slice(pageStart, pageStart + pageSizeValue)

  const handleSaveClient = (formData: FormData) => {
    const newClient: EnterpriseClient = {
      id: editingClient?.id || `EC${String(clients.length + 1).padStart(3, "0")}`,
      companyName: formData.get("companyName") as string,
      ice: formData.get("ice") as string,
      sector: formData.get("sector") as string,
      contactName: formData.get("contactName") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      plan: formData.get("plan") as "starter" | "professional" | "enterprise",
      status: formData.get("status") as "active" | "inactive" | "trial",
      createdAt: editingClient?.createdAt || new Date().toISOString().split("T")[0],
      monthlyFee: Number(formData.get("monthlyFee")),
      usersCount: editingClient?.usersCount || 1,
    }

    if (editingClient) {
      setClients(clients.map((c) => (c.id === editingClient.id ? newClient : c)))
    } else {
      setClients([...clients, newClient])
    }
    setIsDialogOpen(false)
    setEditingClient(null)
  }

  const handleDeleteClient = () => {
    if (!deleteTarget) return
    setClients(clients.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Actif</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>
      case "trial":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Essai</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Enterprise</Badge>
      case "professional":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Professional</Badge>
      case "starter":
        return <Badge variant="outline">Starter</Badge>
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  return (
    <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
            <p className="text-muted-foreground">
              Gestion des clients entreprises et de leurs abonnements
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingClient(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form action={handleSaveClient}>
                <DialogHeader>
                  <DialogTitle>
                    {editingClient ? "Modifier le client" : "Nouveau client entreprise"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingClient
                      ? "Modifiez les informations du client"
                      : "Ajoutez un nouveau client à la plateforme"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Raison sociale</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        defaultValue={editingClient?.companyName}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ice">ICE</Label>
                      <Input
                        id="ice"
                        name="ice"
                        defaultValue={editingClient?.ice}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sector">Secteur</Label>
                      <Input
                        id="sector"
                        name="sector"
                        defaultValue={editingClient?.sector}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan">Plan</Label>
                      <Select name="plan" defaultValue={editingClient?.plan || "starter"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyFee">Frais mensuels (MAD)</Label>
                      <Input
                        id="monthlyFee"
                        name="monthlyFee"
                        type="number"
                        defaultValue={editingClient?.monthlyFee || 2000}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Statut</Label>
                      <Select name="status" defaultValue={editingClient?.status || "trial"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                          <SelectItem value="trial">Essai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="mb-3 font-medium">Contact principal</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Nom</Label>
                        <Input
                          id="contactName"
                          name="contactName"
                          defaultValue={editingClient?.contactName}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          defaultValue={editingClient?.contactEmail}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Téléphone</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          defaultValue={editingClient?.contactPhone}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingClient ? "Enregistrer" : "Créer le client"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border border-gray-200 shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Clients Totaux</p>
              <div className="mt-2 text-2xl font-semibold text-[#1B2E5E]">{clients.length}</div>
              <p className="text-xs text-muted-foreground">{totalActiveClients} actifs</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Revenus Mensuels</p>
              <div className="mt-2 text-2xl font-semibold text-[#1B2E5E]">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">MRR total</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
              <div className="mt-2 text-2xl font-semibold text-[#1B2E5E]">{clients.reduce((sum, c) => sum + c.usersCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Tous les clients</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Factures ce mois</p>
              <div className="mt-2 text-2xl font-semibold text-[#1B2E5E]">{totalActiveClients}</div>
              <p className="text-xs text-muted-foreground">À émettre</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Clients Entreprises</CardTitle>
                <CardDescription>
                  Liste de tous les clients utilisant la plateforme
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou ICE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paginatedClients.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#64748B]">Aucun client entreprise trouvé.</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Frais/mois</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Date création</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.companyName}</div>
                        <div className="text-sm text-muted-foreground">{client.ice}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{client.contactName}</div>
                        <div className="text-sm text-muted-foreground">{client.contactEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(client.plan)}</TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(client.monthlyFee)}
                    </TableCell>
                    <TableCell>{client.usersCount}</TableCell>
                    <TableCell>{formatDate(client.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingClient(client)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteTarget(client)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                <span>{paginatedClients.length} de {filteredClients.length} résultats</span>
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

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement <strong>{deleteTarget?.companyName}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction className="bg-[#DC2626] text-white hover:bg-[#DC2626]/90" onClick={handleDeleteClient}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}
