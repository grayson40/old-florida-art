'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ShoppingCart, Loader2, Plus, Minus, AlertCircle } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { GootenProductDetail, GootenProductVariant } from '@/app/api/gooten/products/[productId]/route'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
}

export function QuickAddModal({ isOpen, onClose, productId }: QuickAddModalProps) {
  const [product, setProduct] = useState<GootenProductDetail | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<GootenProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { dispatch } = useCart()

  // Fetch product details when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetails()
    }
  }, [isOpen, productId])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProduct(null)
      setSelectedVariant(null)
      setQuantity(1)
      setError(null)
    }
  }, [isOpen])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/gooten/products/${productId}`)
      const data = await response.json()

      if (data.HadError) {
        throw new Error(data.Errors?.[0]?.ErrorMessage || 'Failed to load product')
      }

      const productData: GootenProductDetail = data.Result
      setProduct(productData)

      // Auto-select first available variant
      const firstAvailable = productData.ProductVariants?.find(v => v.IsAvailable)
      if (firstAvailable) {
        setSelectedVariant(firstAvailable)
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleVariantSelect = (variant: GootenProductVariant) => {
    if (variant.IsAvailable) {
      setSelectedVariant(variant)
    }
  }

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return

    setIsAddingToCart(true)
    
    try {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: selectedVariant.Sku,
          title: product.Name,
          style: `${selectedVariant.Size} - ${selectedVariant.Color}`,
          price: selectedVariant.Price,
          originalPrice: selectedVariant.Price,
          image: selectedVariant.ProductImage || product.ProductImages[0] || '',
          size: selectedVariant.Size,
          frame: selectedVariant.Color,
          quantity
        }
      })
      
      // Close modal after successful add
      onClose()
    } catch (err) {
      console.error('Error adding to cart:', err)
      setError('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // Get unique sizes and colors
  const sizes = [...new Set(product?.ProductVariants?.map(v => v.Size).filter(Boolean) || [])]
  const colors = [...new Set(product?.ProductVariants?.map(v => v.Color).filter(Boolean) || [])]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-florida-green-50 to-florida-blue-50 p-6 border-b border-florida-sand-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-florida-green-600 hover:text-florida-green-800 hover:bg-white/80 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <h3 className="text-xl font-florida-display font-medium text-florida-green-800 mb-2">
            Quick Add to Cart
          </h3>
          <p className="text-sm text-florida-green-600">
            Choose your options and add to cart
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-florida-green-500 mx-auto mb-3" />
                <p className="text-florida-green-600">Loading product details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-florida-flamingo-500 mx-auto mb-3" />
                <p className="text-florida-green-800 font-medium mb-2">Unable to load product</p>
                <p className="text-florida-green-600 text-sm mb-4">{error}</p>
                <Button onClick={fetchProductDetails} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : product ? (
            <div className="space-y-6">
              
              {/* Product Preview */}
              <div className="flex space-x-4 p-4 bg-florida-sand-50 rounded-xl">
                <div className="w-24 h-30 relative rounded-lg overflow-hidden shadow-md flex-shrink-0">
                  <Image
                    src={selectedVariant?.ProductImage || product.ProductImages[0] || ''}
                    alt={product.Name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=240&fit=crop';
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-florida-green-800 mb-1 line-clamp-2">
                    {product.Name}
                  </h4>
                  {product.ShortDescription && (
                    <p className="text-sm text-florida-green-600 mb-2 line-clamp-2">
                      {product.ShortDescription.length > 100 
                        ? `${product.ShortDescription.substring(0, 100)}...` 
                        : product.ShortDescription
                      }
                    </p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-florida-green-800">
                      {formatPrice(selectedVariant?.Price || product.BasePrice)}
                    </span>
                    {product.HasProductTemplates && (
                      <Badge className="bg-florida-sunset-500 text-white text-xs px-2 py-1">
                        Customizable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="space-y-3">
                  <h5 className="font-medium text-florida-green-800">
                    Size {!selectedVariant && <span className="text-florida-flamingo-500">*</span>}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const sizeVariants = product.ProductVariants?.filter(v => v.Size === size) || []
                      const isAvailable = sizeVariants.some(v => v.IsAvailable)
                      const isSelected = selectedVariant?.Size === size
                      
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            const variant = sizeVariants.find(v => v.IsAvailable)
                            if (variant) handleVariantSelect(variant)
                          }}
                          disabled={!isAvailable}
                          className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                            isSelected
                              ? 'border-florida-green-500 bg-florida-green-500 text-white'
                              : isAvailable
                                ? 'border-florida-sand-300 text-florida-green-700 hover:border-florida-green-300'
                                : 'border-florida-sand-200 text-florida-sand-400 cursor-not-allowed'
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="space-y-3">
                  <h5 className="font-medium text-florida-green-800">
                    Color {!selectedVariant && <span className="text-florida-flamingo-500">*</span>}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                      const colorVariants = product.ProductVariants?.filter(v => v.Color === color) || []
                      const compatibleVariant = colorVariants.find(v => 
                        v.IsAvailable && 
                        (!selectedVariant?.Size || v.Size === selectedVariant.Size)
                      )
                      const isSelected = selectedVariant?.Color === color
                      
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            if (compatibleVariant) handleVariantSelect(compatibleVariant)
                          }}
                          disabled={!compatibleVariant}
                          className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                            isSelected
                              ? 'border-florida-green-500 bg-florida-green-500 text-white'
                              : compatibleVariant
                                ? 'border-florida-sand-300 text-florida-green-700 hover:border-florida-green-300'
                                : 'border-florida-sand-200 text-florida-sand-400 cursor-not-allowed'
                          }`}
                        >
                          {color}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Selected Variant Info */}
              {selectedVariant && (
                <div className="bg-white border border-florida-sand-200 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h6 className="font-medium text-florida-green-800">Selected Option</h6>
                      <p className="text-sm text-florida-green-600">
                        {selectedVariant.Size} • {selectedVariant.Color}
                      </p>
                      <p className="text-xs text-florida-green-500 mt-1">
                        SKU: {selectedVariant.Sku}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-florida-green-800">
                      {formatPrice(selectedVariant.Price)}
                    </span>
                  </div>
                  
                  {selectedVariant.MaxPrintableWidth && selectedVariant.MaxPrintableHeight && (
                    <p className="text-xs text-florida-green-500">
                      Max print area: {selectedVariant.MaxPrintableWidth}" × {selectedVariant.MaxPrintableHeight}"
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <h5 className="font-medium text-florida-green-800">Quantity</h5>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-florida-sand-300 rounded-md hover:border-florida-green-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-florida-sand-300 rounded-md hover:border-florida-green-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-florida-sand-200">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !selectedVariant.IsAvailable || isAddingToCart}
                  className="flex-1 bg-florida-green-600 hover:bg-florida-green-700 text-white"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add • {formatPrice((selectedVariant?.Price || 0) * quantity)}
                    </>
                  )}
                </Button>
              </div>

              {(!selectedVariant || !selectedVariant.IsAvailable) && (
                <p className="text-sm text-florida-flamingo-500 text-center">
                  Please select all available options to add to cart
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
} 