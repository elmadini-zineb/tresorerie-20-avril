"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Building2, Users, FileText, Activity, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { enterpriseClients } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/format"
import type { EnterpriseClient } from "@/lib/types"

export default function AdminPage() {
  const [clients, setClients] = useState<EnterpriseClient[]>(enterpriseClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<EnterpriseClient | null>(null)

  const filteredClients = clients.filter(
    (client) =>
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ice.includes(searchTerm)
  )

  const totalActiveClients = clients.filter((c) => c.status === "active").length
  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyFee, 0)

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

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id))
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Totaux</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">
                {totalActiveClients} actifs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                MRR total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clients.reduce((sum, c) => sum + c.usersCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Tous les clients
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Factures ce mois</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActiveClients}</div>
              <p className="text-xs text-muted-foreground">
                À émettre
              </p>
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
                {filteredClients.map((client) => (
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
                            onClick={() => handleDeleteClient(client.id)}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
