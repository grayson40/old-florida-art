import type { Metadata } from 'next'
import { Inter, Pacifico, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { CartSidebar } from '@/components/cart-sidebar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})
const pacifico = Pacifico({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico'
})
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'Old Florida Art Co. - Vintage Florida Prints',
  description: 'Discover our collection of vintage-inspired Florida art prints. Each piece captures the timeless spirit of the Sunshine State.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pacifico.variable} ${playfair.variable} antialiased`}>
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  )
} 