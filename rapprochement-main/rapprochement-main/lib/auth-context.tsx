'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { UserRole } from './types'
import { mockAuthUsers } from './mock-data'

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (!storedUser) {
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User
      setUser(parsedUser)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const normalizedEmail = email.trim().toLowerCase()
    const matchedUser = mockAuthUsers.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail && candidate.password === password
    )

    if (!matchedUser) return false

    const authenticatedUser: User = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role as UserRole,
    }

    setUser(authenticatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const authValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user]
  )

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
