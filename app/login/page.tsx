'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: { email?: string; password?: string } = {}
    if (!email.trim()) nextErrors.email = 'Email obligatoire.'
    if (!password.trim()) nextErrors.password = 'Mot de passe obligatoire.'
    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        router.push('/dashboard')
      } else {
        toast.error('Identifiants incorrects')
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B2E5E]">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <span className="text-xl font-semibold text-[#1B2E5E]">Adria Treasury</span>
        </div>

        <div className="rounded-xl border border-[#DDE3EF] bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-bold text-[#1B2E5E]">Connexion</h1>
          <p className="mb-6 text-sm text-[#64748B]">{"Accédez à votre espace de trésorerie"}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-[#1B2E5E]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFormErrors((p) => ({ ...p, email: undefined })) }}
                placeholder="votre@email.ma"
                className="w-full rounded-lg border border-[#DDE3EF] bg-white px-3 py-2 text-sm text-[#1B2E5E] placeholder:text-[#94A3B8] focus:border-[#3B6FD4] focus:outline-none focus:ring-2 focus:ring-[#3B6FD4]/20"
              />
              {formErrors.email && <p className="text-xs text-red-600">{formErrors.email}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-[#1B2E5E]">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFormErrors((p) => ({ ...p, password: undefined })) }}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#DDE3EF] bg-white px-3 py-2 text-sm text-[#1B2E5E] placeholder:text-[#94A3B8] focus:border-[#3B6FD4] focus:outline-none focus:ring-2 focus:ring-[#3B6FD4]/20"
              />
              {formErrors.password && <p className="text-xs text-red-600">{formErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#1B2E5E] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1B2E5E]/90 disabled:opacity-60"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-[#F4F6FB] p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Comptes de demonstration</p>
            <div className="space-y-1 text-xs text-[#64748B]">
              <p><span className="font-medium text-[#1B2E5E]">TRESORIER:</span> tresorier@adria.ma</p>
              <p><span className="font-medium text-[#1B2E5E]">ADMIN CLIENT:</span> admin@adria.ma</p>
              <p><span className="font-medium text-[#1B2E5E]">ADMIN BANQUE:</span> admin.banque@adria.ma</p>
              <p className="mt-1"><span className="font-medium text-[#1B2E5E]">Mot de passe:</span> password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
