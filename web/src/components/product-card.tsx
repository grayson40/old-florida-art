'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, X, Flower } from 'lucide-react'
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
  const [isLiked, setIsLiked] = useState(false)
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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <>
      <Card className="group hover:shadow-2xl hover:shadow-florida-green-200/20 transition-all duration-700 overflow-hidden border border-florida-sand-200/50 bg-white/80 backdrop-blur-sm rounded-2xl">
        <div className="relative overflow-hidden">
          <Link href={`/products/${id}`} className="block">
            <div className="aspect-[3/4] overflow-hidden bg-florida-sand-50">
              <Image
                src={image}
                alt={title}
                width={400}
                height={500}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </Link>
          
          {/* Elegant badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-gradient-to-r from-florida-flamingo-400 to-florida-sunset-400 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg border-0 backdrop-blur-md">
                <Flower className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
            {isFeatured && (
              <Badge className="bg-gradient-to-r from-florida-blue-400 to-florida-green-400 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg border-0 backdrop-blur-md">
                ⭐ Featured
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={handleLikeClick}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white text-florida-green-600 hover:text-florida-flamingo-500 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full shadow-lg backdrop-blur-sm"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-florida-flamingo-500' : ''}`} />
          </Button> */}

          {/* Elegant overlay with quick add */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
            <Button 
              variant="florida" 
              size="sm" 
              onClick={handleQuickAddClick}
              className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl rounded-full px-6"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            <Link href={`/products/${id}`} className="block group/title">
              <h3 className="font-florida-display text-lg font-semibold text-florida-green-800 group-hover/title:text-florida-green-600 transition-colors duration-300 line-clamp-2 leading-tight">
                {title}
              </h3>
            </Link>
            
            <p className="text-sm text-florida-green-600 font-medium uppercase tracking-wider opacity-80">
              {style}
            </p>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-florida-display text-florida-green-800">
                  ${price}
                </span>
                {originalPrice && (
                  <span className="text-sm text-florida-green-500 line-through opacity-75">
                    ${originalPrice}
                  </span>
                )}
              </div>
              
              {originalPrice && (
                <Badge variant="outline" className="border-florida-flamingo-300 text-florida-flamingo-600 text-xs px-2 py-1 rounded-full">
                  Save ${originalPrice - price}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elegant Quick Add Modal */}
      {showQuickAdd && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setShowQuickAdd(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-florida-green-50 to-florida-blue-50 p-6 border-b border-florida-sand-200">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuickAdd(false)}
                  className="text-florida-green-600 hover:text-florida-green-800 hover:bg-white/80 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <h3 className="text-xl font-florida-script text-florida-green-800 mb-2">
                Add to Cart
              </h3>
              <p className="text-sm text-florida-green-600">
                Choose your preferred size and frame
              </p>
            </div>

            <div className="p-6">
              {/* Product Preview */}
              <div className="flex space-x-4 mb-6 p-4 bg-florida-sand-50/50 rounded-xl">
                <div className="w-20 h-24 relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-florida-display font-semibold text-florida-green-800 mb-1 line-clamp-2">
                    {title}
                  </h4>
                  <p className="text-sm text-florida-green-600 mb-2 uppercase tracking-wide">
                    {style}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-florida-green-800">${price}</span>
                    {originalPrice && (
                      <span className="text-sm text-florida-green-500 line-through">
                        ${originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-florida-green-800 mb-3">
                  Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 text-sm border-2 rounded-xl transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-florida-green-500 bg-florida-green-50 text-florida-green-800 font-semibold'
                          : 'border-florida-sand-300 text-florida-green-600 hover:border-florida-green-300 hover:bg-florida-green-50/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-florida-green-800 mb-3">
                  Frame
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {frames.map((frame) => (
                    <button
                      key={frame}
                      onClick={() => setSelectedFrame(frame)}
                      className={`p-3 text-sm border-2 rounded-xl transition-all duration-200 ${
                        selectedFrame === frame
                          ? 'border-florida-green-500 bg-florida-green-50 text-florida-green-800 font-semibold'
                          : 'border-florida-sand-300 text-florida-green-600 hover:border-florida-green-300 hover:bg-florida-green-50/50'
                      }`}
                    >
                      {frame}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleQuickAdd}
                disabled={!selectedSize || !selectedFrame}
                variant="florida"
                size="lg"
                className="w-full text-lg py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              {(!selectedSize || !selectedFrame) && (
                <p className="text-xs text-florida-green-500 text-center mt-2">
                  Please select both size and frame options
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
} 