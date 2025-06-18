'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, X } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

interface ProductCardProps {
  id: string
  title: string
  style: string
  price: number
  originalPrice?: number
  image: string
  isNew?: boolean
  isFeatured?: boolean
}

const sizes = ['12" x 16"', '16" x 20"', '18" x 24"', '24" x 32"']
const frames = ['Unframed', 'Black Frame', 'White Frame', 'Natural Wood']

export function ProductCard({
  id,
  title,
  style,
  price,
  originalPrice,
  image,
  isNew = false,
  isFeatured = false
}: ProductCardProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedFrame, setSelectedFrame] = useState('')
  const { dispatch } = useCart()

  const handleQuickAdd = () => {
    if (selectedSize && selectedFrame) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id,
          title,
          style,
          price,
          originalPrice,
          image,
          size: selectedSize,
          frame: selectedFrame,
          quantity: 1
        }
      })
      setShowQuickAdd(false)
      setSelectedSize('')
      setSelectedFrame('')
    }
  }

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickAdd(true)
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-500 overflow-hidden border-0 bg-transparent">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-lg">
            <Link href={`/products/${id}`}>
              <Image
                src={image}
                alt={title}
                width={400}
                height={500}
                className="w-full h-80 object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
            </Link>
            
            {/* Minimal badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {isNew && (
                <Badge variant="destructive" className="bg-black text-white text-xs px-2 py-1">
                  NEW
                </Badge>
              )}
              {isFeatured && (
                <Badge variant="secondary" className="bg-florida-sunset-500 text-white text-xs px-2 py-1">
                  FEATURED
                </Badge>
              )}
            </div>

            {/* Wishlist button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-florida-green-700 hover:text-florida-flamingo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Heart className="h-4 w-4" />
            </Button>

            {/* Quick add overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4">
              <Button 
                variant="florida" 
                size="sm" 
                onClick={handleQuickAddClick}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pb-2">
          <div className="space-y-1">
            <Link href={`/products/${id}`}>
              <h3 className="font-florida-display text-lg font-medium text-florida-green-800 hover:text-florida-green-600 transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-florida-green-600 font-medium uppercase tracking-wide">
              {style}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold font-florida-display text-florida-green-800">
                ${price}
              </span>
              {originalPrice && (
                <span className="text-sm text-florida-green-500 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowQuickAdd(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-florida-display font-semibold text-florida-green-800">
                Quick Add to Cart
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuickAdd(false)}
                className="text-florida-green-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="w-20 h-24 relative rounded-md overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-florida-green-800 mb-1">{title}</h4>
                <p className="text-sm text-florida-green-600 mb-2">{style}</p>
                <p className="text-lg font-semibold text-florida-green-800">${price}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-florida-green-800 mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                        selectedSize === size
                          ? 'border-florida-green-500 bg-florida-green-500 text-white'
                          : 'border-florida-sand-300 text-florida-green-700 hover:border-florida-green-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-florida-green-800 mb-2">
                  Frame
                </label>
                <div className="flex flex-wrap gap-2">
                  {frames.map((frame) => (
                    <button
                      key={frame}
                      onClick={() => setSelectedFrame(frame)}
                      className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                        selectedFrame === frame
                          ? 'border-florida-green-500 bg-florida-green-500 text-white'
                          : 'border-florida-sand-300 text-florida-green-700 hover:border-florida-green-300'
                      }`}
                    >
                      {frame}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="florida"
                className="w-full"
                onClick={handleQuickAdd}
                disabled={!selectedSize || !selectedFrame}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
} 