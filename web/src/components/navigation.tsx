'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Waves, Palmtree } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

export function Navigation() {
  const { state, dispatch } = useCart()

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  return (
    <nav className="bg-florida-sand-100/80 backdrop-blur-sm border-b border-florida-sand-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Waves className="h-8 w-8 text-florida-blue-600" />
              <Palmtree className="h-8 w-8 text-florida-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-florida-script text-2xl text-florida-green-800">
                Old Florida
              </span>
              <span className="font-florida-body text-xs text-florida-green-600 -mt-1">
                Art Co.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/posters" 
              className="text-florida-green-700 hover:text-florida-green-900 font-medium transition-colors"
            >
              Prints
            </Link>
            <Link 
              href="/collections" 
              className="text-florida-green-700 hover:text-florida-green-900 font-medium transition-colors"
            >
              Collections
            </Link>
            <Link 
              href="/about" 
              className="text-florida-green-700 hover:text-florida-green-900 font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Cart & CTA */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleCart}
              className="relative text-florida-green-700 hover:text-florida-green-900"
            >
              <ShoppingCart className="h-5 w-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-florida-sunset-500 text-florida-sunset-50 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Button>
            <Button variant="florida" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/posters">
                Shop Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 