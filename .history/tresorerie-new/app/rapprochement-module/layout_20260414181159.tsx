'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

interface RoleAccessMap {
  [route: string]: string[] // roles autorisés par route
}

const ROLE_ACCESS_MAP: RoleAccessMap = {
  // Pages Rapprochement
  '/rapprochement-module/rapprochement': ['TRESORIER', 'ADMIN_BANQUE'],
  
  // Pages Clients
  '/rapprochement-module/clients': ['TRESORIER', 'ADMIN_CLIENT'],
  
  // Pages Fournisseurs
  '/rapprochement-module/fournisseurs': ['TRESORIER'],
  
  // Pages Factures
  '/rapprochement-module/factures': ['TRESORIER', 'ADMIN_CLIENT'],
  
  // Pages Dashboard
  '/rapprochement-module/dashboard': ['TRESORIER', 'ADMIN_CLIENT', 'ADMIN_BANQUE'],
  
  // Pages Rapports
  '/rapprochement-module/rapports': ['TRESORIER', 'ADMIN_CLIENT', 'ADMIN_BANQUE'],
  '/rapprochement-module/rapports/etat-rapprochement': ['TRESORIER', 'ADMIN_CLIENT', 'ADMIN_BANQUE'],
  '/rapprochement-module/rapports/cpc': ['TRESORIER', 'ADMIN_CLIENT', 'ADMIN_BANQUE'],
  '/rapprochement-module/rapports/tva': ['TRESORIER', 'ADMIN_CLIENT', 'ADMIN_BANQUE'],
  
  // Pages Paramétrages
  '/rapprochement-module/parametres': ['TRESORIER', 'ADMIN_CLIENT'],
  
  // Pages Admin (TRESORIER uniquement)
  '/rapprochement-module/admin': ['TRESORIER'],
  '/rapprochement-module/admin/configuration': ['TRESORIER'],
  '/rapprochement-module/admin/utilisateurs': ['TRESORIER'],
  '/rapprochement-module/admin/validation': ['TRESORIER'],
}

function isRouteAccessible(pathname: string, userRole: string | null): boolean {
  if (!userRole) return false

  // Cherche la route exacte ou la plus spécifique
  for (const [route, allowedRoles] of Object.entries(ROLE_ACCESS_MAP)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return allowedRoles.includes(userRole)
    }
  }

  // Route non répertoriée - accès refusé par défaut
  return false
}

export default function RapprochementModuleLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Attendre le chargement de l'authentification
    if (isLoading) return

    // Rediriger si non authentifié
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    // Vérifier l'accès par rôle
    if (!isRouteAccessible(pathname, user.role)) {
      // Rediriger vers le dashboard si accès refusé
      router.push('/dashboard')
      return
    }
  }, [isLoading, isAuthenticated, user, pathname, router])

  // Afficher rien pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de l'accès...</p>
        </div>
      </div>
    )
  }

  // Afficher rien si non authentifié (redirection en cours)
  if (!isAuthenticated || !user) {
    return null
  }

  // Afficher rien si accès refusé (redirection en cours)
  if (!isRouteAccessible(pathname, user.role)) {
    return null
  }

  // Afficher les enfants si autorisé
  return children
}
