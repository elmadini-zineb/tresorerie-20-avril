"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Building2, User, Bell, Shield, Palette, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function ParametresPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const isAdmin = user?.role === "ADMIN_CLIENT" || user?.role === "ADMIN_BANQUE"
  const [notifications, setNotifications] = useState({
    email: true,
    factures: true,
    rapprochement: true,
    rapports: false,
  })

  useEffect(() => {
    if (user && !isAdmin) {
      router.replace('/dashboard')
    }
  }, [user, isAdmin, router])

  const handleSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos modifications ont été sauvegardées avec succès.",
    })
  }

  if (user && !isAdmin) {
    return null
  }

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres de votre compte et de l&apos;application
          </p>
        </div>

        <Tabs defaultValue="entreprise" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none">
            <TabsTrigger value="entreprise" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Entreprise</span>
            </TabsTrigger>
            <TabsTrigger value="profil" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="securite" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="apparence" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Apparence</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entreprise">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l&apos;entreprise</CardTitle>
                <CardDescription>
                  Informations légales et fiscales de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="raison-sociale">Raison sociale</Label>
                    <Input id="raison-sociale" defaultValue="Tech Solutions SARL" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="forme-juridique">Forme juridique</Label>
                    <Select defaultValue="sarl">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarl">SARL</SelectItem>
                        <SelectItem value="sa">SA</SelectItem>
                        <SelectItem value="sas">SAS</SelectItem>
                        <SelectItem value="auto">Auto-entrepreneur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ice">ICE</Label>
                    <Input id="ice" defaultValue="001234567890123" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="if">Identifiant Fiscal (IF)</Label>
                    <Input id="if" defaultValue="12345678" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rc">Registre de Commerce (RC)</Label>
                    <Input id="rc" defaultValue="123456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnss">CNSS</Label>
                    <Input id="cnss" defaultValue="1234567" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" defaultValue="123 Boulevard Mohammed V" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input id="ville" defaultValue="Casablanca" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code-postal">Code postal</Label>
                    <Input id="code-postal" defaultValue="20000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pays">Pays</Label>
                    <Select defaultValue="ma">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ma">Maroc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Enregistrer les modifications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profil">
            <Card>
              <CardHeader>
                <CardTitle>Profil utilisateur</CardTitle>
                <CardDescription>
                  Vos informations personnelles et de connexion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" defaultValue="Ahmed" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" defaultValue="Benjelloun" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="ahmed@techsolutions.ma" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input id="telephone" defaultValue="+212 6 12 34 56 78" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger className="w-full md:w-1/2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="comptable">Comptable</SelectItem>
                      <SelectItem value="tresorier">Trésorier</SelectItem>
                      <SelectItem value="lecture">Lecture seule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Enregistrer les modifications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Configurez comment et quand vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les notifications importantes par email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes factures</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications pour les factures en retard ou à échéance
                    </p>
                  </div>
                  <Switch
                    checked={notifications.factures}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, factures: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapprochement bancaire</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertes sur les écarts de rapprochement détectés
                    </p>
                  </div>
                  <Switch
                    checked={notifications.rapprochement}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, rapprochement: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapports périodiques</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les rapports CPC et TVA automatiquement
                    </p>
                  </div>
                  <Switch
                    checked={notifications.rapports}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, rapports: checked })
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Enregistrer les préférences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="securite">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez votre mot de passe et les options de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Changer le mot de passe</h4>
                  <div className="grid gap-4 md:w-1/2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button onClick={handleSave}>Mettre à jour le mot de passe</Button>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Authentification à deux facteurs</h4>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez une couche de sécurité supplémentaire à votre compte
                  </p>
                  <Button variant="outline">Configurer 2FA</Button>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Sessions actives</h4>
                  <p className="text-sm text-muted-foreground">
                    Gérez les appareils connectés à votre compte
                  </p>
                  <Button variant="outline">Voir les sessions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apparence">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l&apos;apparence de l&apos;application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Thème</Label>
                  <div className="grid grid-cols-3 gap-4 md:w-1/2">
                    <Button variant="outline" className="h-24 flex-col gap-2">
                      <div className="h-8 w-8 rounded-full bg-background border" />
                      <span className="text-xs">Clair</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-900" />
                      <span className="text-xs">Sombre</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2 border-primary">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-background to-slate-900" />
                      <span className="text-xs">Système</span>
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <Label>Langue</Label>
                  </div>
                  <Select defaultValue="fr">
                    <SelectTrigger className="w-full md:w-1/2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Enregistrer les préférences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
