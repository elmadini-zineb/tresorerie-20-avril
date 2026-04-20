'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { UserRole } from './types'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'adria-auth-user'

const mockAuthUsers = [
  { id: 'tr-001', name: 'Tresorier Adria', email: 'tresorier@adria.ma', role: 'TRESORIER' as UserRole, password: 'password' },
  { id: 'ac-001', name: 'Admin Client Adria', email: 'admin@adria.ma', role: 'ADMIN_CLIENT' as UserRole, password: 'password' },
  { id: 'ab-001', name: 'Admin Banque Adria', email: 'admin.banque@adria.ma', role: 'ADMIN_BANQUE' as UserRole, password: 'password' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (!storedUser) return
    try {
      setUser(JSON.parse(storedUser) as User)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const normalizedEmail = email.trim().toLowerCase()
    const matchedUser = mockAuthUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    )
    if (!matchedUser) return false
    const authenticatedUser: User = { id: matchedUser.id, name: matchedUser.name, email: matchedUser.email, role: matchedUser.role }
    setUser(authenticatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
