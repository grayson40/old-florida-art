'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Package,
  Palette,
  Ruler,
  Zap
} from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useGootenProducts } from '@/hooks/use-gooten-products'
import { ProductCard } from '@/components/product-card'
import { Footer } from '@/components/footer'

const PRODUCT_SIZES = [
  { name: '8x10', price: 0, popular: false },
  { name: '11x14', price: 5, popular: true },
  { name: '16x20', price: 15, popular: false },
  { name: '18x24', price: 25, popular: false },
  { name: '24x36', price: 45, popular: false }
]

const FRAME_OPTIONS = [
  { name: 'No Frame', price: 0, description: 'Print only' },
  { name: 'Black Frame', price: 25, description: 'Classic black wooden frame' },
  { name: 'White Frame', price: 25, description: 'Clean white wooden frame' },
  { name: 'Natural Wood', price: 30, description: 'Natural oak frame' }
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { dispatch } = useCart()
  const { products, loading } = useGootenProducts()
  
  const [selectedSize, setSelectedSize] = useState(PRODUCT_SIZES[1]) // Default to 11x14
  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[0]) // Default to no frame
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Find the product by ID
  const product = products.find(p => p.id === params.id)

  // Get related products from the same collection
  const relatedProducts = product ? products.filter(p => 
    p.collection === product.collection && 
    p.id !== product.id
  ).slice(0, 4) : []

  // Mock additional product data for demonstration
  const productDetails = {
    description: `Experience the timeless beauty of Florida with this stunning ${product?.style || 'print'}. Carefully crafted to capture the essence of the Sunshine State, this piece brings authentic Florida charm to any space.`,
    features: [
      'Museum-quality archival paper',
      'Fade-resistant inks',
      'Multiple size options available',
      'Ready to frame or hang'
    ],
    materials: 'Premium matte finish on archival paper',
    dimensions: 'Available in multiple sizes',
    care: 'Keep away from direct sunlight. Dust gently with soft, dry cloth.',
    shipping: 'Ships within 3-5 business days',
    returns: '30-day return policy'
  }

  // Multiple product images for gallery
  const productImages = product ? [
    product.image,
    // Generate variations of the same image for demo
    product.image.replace('w=400', 'w=500'),
    product.image.replace('h=500', 'h=600'),
    product.image.replace('fit=crop', 'fit=fill&bg=white')
  ] : []

  // Calculate total price
  const basePrice = product?.price || 25
  const totalPrice = basePrice + selectedSize.price + selectedFrame.price

  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      id: `${product.id}-${selectedSize.name}-${selectedFrame.name}`,
      productId: product.id,
      title: product.title,
      style: product.style,
      price: totalPrice,
      image: product.image,
      quantity,
      size: selectedSize.name,
      frame: selectedFrame.name,
      vendor: 'gooten'
    }

    dispatch({ type: 'ADD_ITEM', payload: cartItem })
    
    // Show success feedback (you could add a toast here)
    console.log('Added to cart:', cartItem)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: `Check out this beautiful Florida art: ${product?.title}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-florida-green-600 mx-auto mb-4"></div>
            <p className="text-florida-green-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-florida-green-400 mx-auto mb-4" />
            <h2 className="font-florida-display text-2xl text-florida-green-800 mb-4">
              Product Not Found
            </h2>
            <p className="text-florida-green-600 mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button asChild variant="florida">
                <Link href="/prints">Browse All Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-florida-sand-50/30">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-florida-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-florida-green-600 hover:text-florida-green-800">
              Home
            </Link>
            <span className="text-florida-green-400">/</span>
            <Link href="/prints" className="text-florida-green-600 hover:text-florida-green-800">
              Prints
            </Link>
            <span className="text-florida-green-400">/</span>
            <span className="text-florida-green-800 font-medium truncate">
              {product.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-florida-sand-100 rounded-2xl overflow-hidden">
              <Image
                src={productImages[activeImageIndex] || product.image}
                alt={product.title}
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square bg-florida-sand-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === activeImageIndex 
                      ? 'border-florida-green-400' 
                      : 'border-florida-sand-200 hover:border-florida-green-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {product.isNew && (
                    <Badge className="bg-florida-flamingo-100 text-florida-flamingo-700 border-florida-flamingo-200">
                      New
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-florida-blue-100 text-florida-blue-700 border-florida-blue-200">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-florida-green-600">
                    {product.collection}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current text-florida-flamingo-500' : 'text-florida-green-600'}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5 text-florida-green-600" />
                  </Button>
                </div>
              </div>
              
              <h1 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-3">
                {product.title}
              </h1>
              
              <p className="text-lg text-florida-green-600 font-medium mb-4">
                {product.style}
              </p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-florida-sunset-400" />
                  ))}
                  <span className="text-sm text-florida-green-600 ml-2">4.9 (127 reviews)</span>
                </div>
              </div>
              
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold font-florida-display text-florida-green-800">
                  ${totalPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-florida-green-500 line-through">
                    ${product.originalPrice + selectedSize.price + selectedFrame.price}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-florida-display text-lg font-semibold text-florida-green-800 mb-3 flex items-center">
                <Ruler className="h-5 w-5 mr-2" />
                Size
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {PRODUCT_SIZES.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={`relative p-3 text-center border-2 rounded-lg transition-colors ${
                      selectedSize.name === size.name
                        ? 'border-florida-green-400 bg-florida-green-50'
                        : 'border-florida-sand-300 hover:border-florida-green-300'
                    }`}
                  >
                    <div className="font-medium text-florida-green-800">{size.name}"</div>
                    <div className="text-sm text-florida-green-600">
                      {size.price > 0 ? `+$${size.price}` : 'Base price'}
                    </div>
                    {size.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-florida-sunset-400 text-white text-xs px-2 py-1">
                        Popular
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div>
              <h3 className="font-florida-display text-lg font-semibold text-florida-green-800 mb-3 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Frame Options
              </h3>
              <div className="space-y-3">
                {FRAME_OPTIONS.map((frame) => (
                  <button
                    key={frame.name}
                    onClick={() => setSelectedFrame(frame)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                      selectedFrame.name === frame.name
                        ? 'border-florida-green-400 bg-florida-green-50'
                        : 'border-florida-sand-300 hover:border-florida-green-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-florida-green-800">{frame.name}</div>
                        <div className="text-sm text-florida-green-600">{frame.description}</div>
                      </div>
                      <div className="text-florida-green-800 font-semibold">
                        {frame.price > 0 ? `+$${frame.price}` : 'Included'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-florida-display text-lg font-semibold text-florida-green-800 mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-florida-sand-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-florida-sand-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-florida-sand-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-florida-green-600">
                  Total: ${(totalPrice * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-florida-green-600 hover:bg-florida-green-700 text-white py-4 text-lg font-semibold rounded-xl"
                size="lg"
              >
                <Package className="h-5 w-5 mr-2" />
                Add to Cart - ${(totalPrice * quantity).toFixed(2)}
              </Button>
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm text-florida-green-600">
                <div className="flex flex-col items-center space-y-1">
                  <Truck className="h-5 w-5" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Shield className="h-5 w-5" />
                  <span>Satisfaction guaranteed</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <RotateCcw className="h-5 w-5" />
                  <span>30-day returns</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-florida-display text-florida-green-800">
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-florida-green-700 leading-relaxed">
                  {productDetails.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-florida-green-800 mb-1">Features:</h4>
                    <ul className="text-sm text-florida-green-600 space-y-1">
                      {productDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-florida-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-florida-green-800 mb-1">Materials:</h4>
                      <p className="text-florida-green-600">{productDetails.materials}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-florida-green-800 mb-1">Care Instructions:</h4>
                      <p className="text-florida-green-600">{productDetails.care}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-florida-green-800 mb-1">Shipping:</h4>
                      <p className="text-florida-green-600">{productDetails.shipping}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-florida-green-800 mb-1">Returns:</h4>
                      <p className="text-florida-green-600">{productDetails.returns}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-florida-sand-200">
            <div className="text-center mb-8">
              <h2 className="font-florida-script text-3xl text-florida-green-800 mb-4">
                You Might Also Like
              </h2>
              <p className="text-florida-green-600">
                More from the {product.collection} collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  title={relatedProduct.title}
                  style={relatedProduct.style}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.originalPrice}
                  image={relatedProduct.image}
                  isNew={relatedProduct.isNew}
                  isFeatured={relatedProduct.isFeatured}
                />
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href={`/prints?collection=${encodeURIComponent(product.collection)}`} className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>View All {product.collection}</span>
                  <Zap className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
        
        {/* Fallback if no related products */}
        {relatedProducts.length === 0 && (
          <div className="mt-16 pt-8 border-t border-florida-sand-200">
            <div className="text-center mb-8">
              <h2 className="font-florida-script text-3xl text-florida-green-800 mb-4">
                Explore More Prints
              </h2>
              <p className="text-florida-green-600">
                Discover more beautiful Florida art from our collection
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/prints" className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Browse All Prints</span>
                  <Zap className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
} 