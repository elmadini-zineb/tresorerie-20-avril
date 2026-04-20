'use client'

import { usePathname } from 'next/navigation'
import { UserNav } from './user-nav'
import { useApp } from '@/lib/app-context'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/rapprochement-module')) {
    const rapprochementPath = pathname.split('/rapprochement-module')[1]
    if (rapprochementPath.startsWith('/dashboard')) return 'Dashboard'
    if (rapprochementPath.startsWith('/rapprochement')) return 'Rapprochement Bancaire'
    if (rapprochementPath.startsWith('/factures')) return 'Factures'
    if (rapprochementPath.startsWith('/rapports/etat-rapprochement')) return 'État de Rapprochement'
    if (rapprochementPath.startsWith('/rapports/cpc')) return 'Compte de Produits et Charges (CPC)'
    if (rapprochementPath.startsWith('/rapports/tva')) return 'Déclaration de TVA'
    return 'Rapprochement'
  }

  if (pathname.startsWith('/dashboard')) return 'Tableau de Bord'
  if (pathname.startsWith('/clients')) return 'Gestion des Clients'
  if (pathname.startsWith('/fournisseurs')) return 'Gestion des Fournisseurs'
  if (pathname.startsWith('/factures')) return 'Gestion des Factures'
  if (pathname.startsWith('/admin/utilisateurs')) return 'Gestion des Utilisateurs'
  if (pathname.startsWith('/admin/configuration')) return 'Configuration'
  if (pathname.startsWith('/admin/validation')) return 'Validation'
  if (pathname.startsWith('/parametres')) return 'Paramètres'

  return 'ADRIA Business & Technology'
}

export function Header() {
  const pathname = usePathname()
  const { notifications } = useApp()
  const pageTitle = getPageTitle(pathname)

  const hasNotifications = notifications.length > 0

  return (
    <header className="fixed top-0 right-0 left-0 z-20 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hasNotifications ? (
                notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full ${notif.read ? 'bg-gray-300' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium">{notif.title}</p>
                      <p className="text-xs text-gray-500">{notif.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-sm text-gray-500">
                  Aucune nouvelle notification
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
