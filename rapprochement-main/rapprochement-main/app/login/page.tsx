'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const nextErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      nextErrors.email = 'Email obligatoire.'
    }
    if (!password.trim()) {
      nextErrors.password = 'Mot de passe obligatoire.'
    }
    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        const normalizedEmail = email.trim().toLowerCase()
        if (normalizedEmail === 'admin@adria.ma' || normalizedEmail === 'admin.banque@adria.ma') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        toast.error('Identifiants incorrects')
      }
    } catch {
      toast.error('Identifiants incorrects')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB] p-4">
      <Card className="w-full max-w-md border-[#DDE3EF] bg-white shadow-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#1B2E5E] text-white">
            <span className="text-xl font-semibold">A</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-[#1B2E5E]">Adria Treasury</CardTitle>
            <p className="mt-1 text-sm text-[#64748B]">Plateforme de Trésorerie d&apos;Entreprise</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-[#1B2E5E]">
                Email
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="email@adria.ma"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setFormErrors((prev) => ({ ...prev, email: undefined }))
                }}
                required
                className={`border-[#DDE3EF] ${formErrors.email ? 'border-[#DC2626]' : ''}`}
              />
              {formErrors.email && <p className="text-xs text-[#DC2626]">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-[#1B2E5E]">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFormErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  required
                  className={`border-[#DDE3EF] pr-10 ${formErrors.password ? 'border-[#DC2626]' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1B2E5E]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formErrors.password && <p className="text-xs text-[#DC2626]">{formErrors.password}</p>}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1B2E5E] text-white hover:bg-[#1B2E5E]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
