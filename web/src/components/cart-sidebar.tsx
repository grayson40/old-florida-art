'use client'

import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CartSidebar() {
  const { state, dispatch } = useCart()

  if (!state.isOpen) return null

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-florida-sand-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-florida-green-700" />
            <h2 className="text-lg font-florida-display font-semibold text-florida-green-800">
              Shopping Cart
            </h2>
            {state.itemCount > 0 && (
              <Badge variant="secondary" className="bg-florida-green-100 text-florida-green-800">
                {state.itemCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="text-florida-green-600 hover:text-florida-green-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-florida-sand-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-florida-green-800 mb-2">
                Your cart is empty
              </h3>
              <p className="text-florida-green-600 mb-6">
                Add some beautiful Florida art prints to get started
              </p>
              <Button
                variant="florida"
                onClick={closeCart}
                asChild
              >
                <Link href="/prints">
                  Browse Prints
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="relative w-20 h-24 rounded-md overflow-hidden bg-florida-sand-50">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-medium text-florida-green-800 text-sm line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-florida-green-600 uppercase tracking-wide">
                        {item.style}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-florida-green-600">
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{item.frame}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md border border-florida-sand-300 hover:border-florida-green-300 transition-colors"
                        >
                          <Minus className="h-3 w-3 text-florida-green-700" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-florida-green-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md border border-florida-sand-300 hover:border-florida-green-300 transition-colors"
                        >
                          <Plus className="h-3 w-3 text-florida-green-700" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-florida-green-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-florida-green-500 hover:text-florida-flamingo-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-florida-sand-200 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-florida-green-800">Total:</span>
              <span className="text-florida-green-800 font-florida-display">
                ${state.total.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="florida"
                size="lg"
                className="w-full"
                onClick={closeCart}
                asChild
              >
                <Link href="/checkout" className="flex items-center justify-center space-x-2">
                  <span>Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full border-florida-sand-300 text-florida-green-700"
                onClick={closeCart}
                asChild
              >
                <Link href="/prints">
                  Continue Shopping
                </Link>
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-florida-green-600">
                Free shipping on orders over $75
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
} 