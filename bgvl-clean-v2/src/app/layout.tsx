import type { Metadata } from 'next'
import './globals.css'
import { LangProvider } from '@/contexts/LangContext'
import { Toaster } from 'react-hot-toast'
import { getDB } from '@/lib/db'
import Preloader from '@/components/Preloader'

export const metadata: Metadata = {
  title: 'Ballon Global Ventures Limited — Global Agricultural & Petroleum Export',
  description: 'Nigeria\'s premier export company. Exporting premium agricultural products (sesame seeds, shea nuts, cashew nuts, shea butter, hibiscus flower) and petroleum products (gas, fuel, kerosene, diesel, bitumen) globally.',
  keywords: 'Nigeria export, sesame seeds, shea nuts, cashew nuts, shea butter, hibiscus, petroleum, diesel, bitumen, agriculture export',
  openGraph: {
    title: 'Ballon Global Ventures Limited',
    description: 'Global Agricultural & Petroleum Export Company — Nigeria',
    type: 'website',
  }
}

async function getServerTranslations() {
  try {
    const db = getDB()
    const rows = db.prepare('SELECT lang, key, value FROM translations').all() as any[]
    const result: Record<string, Record<string, string>> = {}
    for (const row of rows) {
      if (!result[row.lang]) result[row.lang] = {}
      result[row.lang][row.key] = row.value
    }
    return result
  } catch { return {} }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const serverTranslations = await getServerTranslations()
  return (
    <html lang="en">
      <body>
        <LangProvider serverTranslations={serverTranslations}>
          <Preloader />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#C9A84C',
                color: '#030303',
                fontFamily: 'Cinzel, serif',
                fontSize: '11px',
                letterSpacing: '1px',
                padding: '14px 20px',
                border: 'none',
                borderRadius: '0',
              },
              duration: 5000,
            }}
          />
        </LangProvider>
      </body>
    </html>
  )
}
