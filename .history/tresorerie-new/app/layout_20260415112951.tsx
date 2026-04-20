import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: 'Adria Trésorerie - Gestion de Trésorerie',
  description: 'Module de gestion de trésorerie Adria Business & Technology',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { AuthProvider } from '@/lib/auth-context'
import { AppProvider } from '@/lib/app-context'
import { MainLayout } from '@/components/layout/layout'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <AuthProvider>
          <AppProvider>
            <main>{children}</main>
            <Toaster />
          </AppProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
