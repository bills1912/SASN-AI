import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'ASTA-CITA AI - Sistem Manajemen ASN',
  description: 'Platform terintegrasi untuk analisis talenta dan penilaian kinerja ASN berbasis Artificial Intelligence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}