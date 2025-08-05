import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from './components/Navigation'
import { SidebarProvider } from './components/SidebarContext'
import LayoutWrapper from './components/LayoutWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'AmiAble - Empowering Talent with Disabilities in Media',
  description: 'A comprehensive platform connecting talented individuals who have disabilities to opportunities in film, television, and OTT industries. Discover verified profiles, manage projects, and build inclusive teams.',
  keywords: 'disability, talent, media, film, television, OTT, inclusive hiring, accessibility, casting, production, acting, voice acting, lighting, sound design',
  authors: [{ name: 'AmiAble Team' }],
  openGraph: {
    title: 'AmiAble - Empowering Talent with Disabilities in Media',
    description: 'Connect with talented individuals who have disabilities for your next media project. Verified profiles, inclusive hiring, and professional opportunities.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AmiAble - Empowering Talent with Disabilities in Media',
    description: 'Connect with talented individuals who have disabilities for your next media project.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>

      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          <div id="root">
            <Navigation />
            <LayoutWrapper>
              <main>
                {children}
              </main>
            </LayoutWrapper>
          </div>
        </SidebarProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
} 