'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

// Mock product data - would typically come from API/database
const product = {
  id: '1',
  title: 'Sebastian Inlet Classic',
  style: 'Vintage Watercolor',
  price: 45,
  originalPrice: 60,
  images: [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1520637836862-4d197d17c89a?w=800&h=1000&fit=crop',
  ],
  isNew: true,
  isFeatured: true,
  description: 'Our Sebastian Inlet Classic captures the timeless beauty of Florida\'s most iconic coastline. This vintage watercolor piece brings the laid-back spirit of old Florida into your space with its soft, dreamy palette and nostalgic charm.',
  details: [
    'Premium archival paper',
    'Fade-resistant inks',
    'Made in Florida',
    'Ships within 2-3 business days'
  ],
  sizes: ['12" x 16"', '16" x 20"', '18" x 24"', '24" x 32"'],
  frames: ['Unframed', 'Black Frame', 'White Frame', 'Natural Wood']
}

// Related products
const relatedProducts = [
  {
    id: '2',
    title: 'Cocoa Beach Legends',
    style: 'Art Deco',
    price: 42,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
    isFeatured: true
  },
  {
    id: '3',
    title: 'Space Coast Vintage',
    style: 'Minimalist Line Art',
    price: 38,
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c89a?w=400&h=500&fit=crop'
  }
]

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedFrame, setSelectedFrame] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    if (selectedSize && selectedFrame) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          title: product.title,
          style: product.style,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          size: selectedSize,
          frame: selectedFrame,
          quantity
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-florida-green-600 hover:text-florida-green-800">Home</Link>
          <span className="mx-2 text-florida-green-400">/</span>
                      <Link href="/prints" className="text-florida-green-600 hover:text-florida-green-800">Prints</Link>
          <span className="mx-2 text-florida-green-400">/</span>
          <span className="text-florida-green-800 font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-florida-sand-50">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-black text-white text-xs px-2 py-1">
                    NEW
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-florida-sunset-500 text-white text-xs px-2 py-1">
                    FEATURED
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Thumbnail images */}
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-20 relative overflow-hidden rounded-md ${
                    selectedImage === index 
                      ? 'ring-2 ring-florida-green-500' 
                      : 'ring-1 ring-florida-sand-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-florida-display font-medium text-florida-green-800 mb-2">
                {product.title}
              </h1>
              <p className="text-lg text-florida-green-600 font-medium uppercase tracking-wide">
                {product.style}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-semibold text-florida-green-800 font-florida-display">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-florida-green-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-florida-green-800">
                Size {!selectedSize && <span className="text-florida-flamingo-500">*</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
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

            {/* Frame Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-florida-green-800">
                Frame {!selectedFrame && <span className="text-florida-flamingo-500">*</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.frames.map((frame) => (
                  <button
                    key={frame}
                    onClick={() => setSelectedFrame(frame)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
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

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-medium text-florida-green-800">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-florida-sand-300 rounded-md hover:border-florida-green-300 transition-colors"
                >
                  <Minus className="h-4 w-4 text-florida-green-700" />
                </button>
                <span className="w-12 text-center font-medium text-florida-green-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-florida-sand-300 rounded-md hover:border-florida-green-300 transition-colors"
                >
                  <Plus className="h-4 w-4 text-florida-green-700" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <Button
                variant="florida"
                size="lg"
                className="w-full text-lg py-6"
                disabled={!selectedSize || !selectedFrame}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
              
              <div className="flex space-x-3">
                <Button variant="outline" size="lg" className="flex-1 border-florida-sand-300">
                  <Heart className="h-5 w-5 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="lg" className="flex-1 border-florida-sand-300">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-florida-sand-200 pt-6">
              <h3 className="font-florida-display font-semibold text-lg text-florida-green-800 mb-4">
                About This Print
              </h3>
              <p className="text-florida-green-700 leading-relaxed mb-6">
                {product.description}
              </p>
              
              <h4 className="font-medium text-florida-green-800 mb-3">Details</h4>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-center text-florida-green-700">
                    <div className="w-1.5 h-1.5 bg-florida-green-500 rounded-full mr-3"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-20 border-t border-florida-sand-200 pt-16">
          <h2 className="font-florida-display text-2xl font-semibold text-florida-green-800 mb-8">
            Pairs Well With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} {...relatedProduct} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
} 