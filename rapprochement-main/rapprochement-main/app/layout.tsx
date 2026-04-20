import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AppProvider } from '@/lib/app-context'
import { AuthProvider } from '@/lib/auth-context'
import { MainLayout } from '@/components/layout/main-layout'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Adria Treasury — Rapprochement Bancaire',
  description: 'Solution de rapprochement bancaire pour la trésorerie d\'entreprise au Maroc',
  generator: 'Adria Business and Technology',
}

export const viewport: Viewport = {
  themeColor: '#111E3F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <AppProvider>
            <MainLayout>{children}</MainLayout>
          </AppProvider>
        </AuthProvider>
        <Toaster
          position="top-right"
          duration={4000}
          toastOptions={{
            className: 'max-w-[320px] border border-[#DDE3EF] bg-white text-[#1B2E5E] shadow-sm',
            classNames: {
              success: 'border-l-4 border-l-[#16A34A]',
              error: 'border-l-4 border-l-[#DC2626]',
              info: 'border-l-4 border-l-[#3B82F6]',
              warning: 'border-l-4 border-l-[#3B82F6]',
              title: 'text-sm font-medium',
              description: 'text-sm text-[#64748B]',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
