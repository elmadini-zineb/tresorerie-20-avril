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
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
