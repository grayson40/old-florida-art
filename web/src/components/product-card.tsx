'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Star, Sparkles, Eye, Plus } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { QuickAddModal } from '@/components/quick-add-modal'

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
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

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

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <>
      <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 ease-out bg-white rounded-xl sm:rounded-2xl">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-florida-sand-50">
          <Link href={`/products/${id}`} className="block">
            <div className="aspect-[4/5] sm:aspect-[3/4] overflow-hidden relative">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-florida-sand-100 animate-pulse" />
              )}
              <Image
                src={image}
                alt={title}
                width={400}
                height={500}
                className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                priority={false}
              />
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </Link>
          
          {/* Enhanced Badges - Mobile Optimized */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
            {isNew && (
              <Badge className="bg-gradient-to-r from-florida-flamingo-500 to-florida-sunset-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-lg border-0 backdrop-blur-md">
                <Sparkles className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">New</span>
                <span className="sm:hidden">New</span>
              </Badge>
            )}
            {isFeatured && (
              <Badge className="bg-gradient-to-r from-florida-blue-500 to-florida-green-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-lg border-0 backdrop-blur-md">
                <Star className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Featured</span>
                <span className="sm:hidden">★</span>
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold shadow-lg border-0 backdrop-blur-md">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button - Touch Optimized */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLikeClick}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 hover:bg-white text-florida-green-600 hover:text-florida-flamingo-500 transition-all duration-300 rounded-full shadow-lg backdrop-blur-sm touch-manipulation"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-florida-flamingo-500' : ''}`} />
          </Button>

          {/* Mobile-Friendly Quick Actions Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-3 sm:pb-4">
            <div className="flex gap-2 sm:gap-3">
              <Button 
                variant="florida" 
                size="sm" 
                onClick={handleQuickAddClick}
                className="transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-xl rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium touch-manipulation"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Quick Add</span>
                <span className="sm:hidden">Add</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-75 shadow-xl rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white/95 backdrop-blur-sm border-white text-florida-green-700 hover:bg-florida-green-50 touch-manipulation"
              >
                <Link href={`/products/${id}`}>
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">View</span>
                  <span className="sm:hidden">View</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Content - Mobile Optimized Typography */}
        <CardContent className="p-3 sm:p-4 md:p-5">
          <div className="space-y-2 sm:space-y-3">
            {/* Title with Better Hierarchy */}
            <Link href={`/products/${id}`} className="block group/title">
              <h3 className="font-florida-display text-sm sm:text-base md:text-lg font-semibold text-florida-green-800 group-hover/title:text-florida-green-600 transition-colors duration-300 line-clamp-2 leading-tight tracking-tight">
                {title}
              </h3>
            </Link>
            
            {/* Style Tag - Improved Mobile Typography */}
            <p className="text-xs sm:text-sm text-florida-green-600/80 font-medium uppercase tracking-wide">
              {style}
            </p>
            
            {/* Price Section - Enhanced for Mobile */}
            <div className="flex items-center justify-between pt-1 sm:pt-2">
              <div className="flex items-baseline space-x-1 sm:space-x-2">
                <span className="text-lg sm:text-xl md:text-2xl font-bold font-florida-display text-florida-green-800">
                  ${price}
                </span>
                {originalPrice && (
                  <span className="text-xs sm:text-sm text-florida-green-500/70 line-through">
                    ${originalPrice}
                  </span>
                )}
              </div>
              
              {/* Savings Badge - Mobile Optimized */}
              {originalPrice && (
                <Badge variant="outline" className="border-florida-flamingo-300 text-florida-flamingo-600 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium bg-florida-flamingo-50">
                  <span className="hidden sm:inline">Save </span>${originalPrice - price}
                </Badge>
              )}
            </div>

            {/* Mobile-Only Quick Add Button */}
            <div className="pt-2 sm:hidden">
              <Button 
                onClick={handleQuickAddClick}
                variant="florida"
                size="sm"
                className="w-full rounded-lg text-sm font-medium touch-manipulation"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Subtle border animation on hover */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-florida-green-200 transition-colors duration-500 pointer-events-none" />
      </Card>

      {/* Enhanced Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        productId={id}
      />
    </>
  )
} 