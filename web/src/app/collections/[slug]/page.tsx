'use client'

import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Filter, Grid, List, Flower, Leaf } from 'lucide-react'
import { useState } from 'react'

// Mock collection data (in a real app, this would come from a CMS or API)
const collectionsData = {
  'tropical-blooms': {
    id: 'tropical-blooms',
    title: 'Tropical Blooms',
    subtitle: 'Hibiscus & Florida Flora',
    description: 'Celebrate Florida\'s vibrant botanical heritage with our hibiscus-inspired collection featuring vintage watercolor florals. Each piece captures the lush, tropical essence of the Sunshine State\'s most beloved blooms.',
    longDescription: 'Our Tropical Blooms collection pays homage to Florida\'s rich botanical diversity, with special focus on the iconic hibiscus flower that has become synonymous with tropical paradise. These vintage-inspired watercolor prints blend traditional botanical illustration techniques with modern artistic sensibilities, creating timeless pieces that bring the beauty of Florida\'s gardens indoors.',
    heroImage: 'https://images.unsplash.com/photo-1594736797933-d0b22ba58871?w=1200&h=800&fit=crop',
    products: [
      {
        id: 'hibiscus-classic',
        title: 'Classic Hibiscus Dreams',
        style: 'Vintage Watercolor',
        price: 48,
        originalPrice: 65,
        image: 'https://images.unsplash.com/photo-1594736797933-d0b22ba58871?w=400&h=500&fit=crop',
        isNew: true,
        isFeatured: true
      },
      {
        id: 'bougainvillea-sunset',
        title: 'Bougainvillea Sunset',
        style: 'Art Deco Botanical',
        price: 45,
        image: 'https://images.unsplash.com/photo-1615232741321-8bfb1a5ffe26?w=400&h=500&fit=crop',
        isFeatured: true
      },
      {
        id: 'palm-fronds',
        title: 'Sacred Palm Fronds',
        style: 'Minimalist Line Art',
        price: 42,
        image: 'https://images.unsplash.com/photo-1566054757965-edebc3e5e82a?w=400&h=500&fit=crop'
      },
      {
        id: 'tropical-paradise',
        title: 'Tropical Paradise Triptych',
        style: 'Vintage Watercolor',
        price: 85,
        originalPrice: 120,
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=500&fit=crop',
        isNew: true
      },
      {
        id: 'flamingo-flower',
        title: 'Flamingo Flower Elegance',
        style: 'Botanical Illustration',
        price: 52,
        image: 'https://images.unsplash.com/photo-1586973826243-7c3c0516f1b6?w=400&h=500&fit=crop'
      },
      {
        id: 'orchid-collection',
        title: 'Wild Orchid Collection',
        style: 'Vintage Watercolor',
        price: 58,
        image: 'https://images.unsplash.com/photo-1578932750355-5eb30ece487a?w=400&h=500&fit=crop'
      }
    ]
  },
  'surf-breaks': {
    id: 'surf-breaks',
    title: 'Classic Surf Breaks',
    subtitle: 'Legendary Florida Waves',
    description: 'Iconic surf spots from Sebastian Inlet to Cocoa Beach, rendered in classic vintage poster style that captures the essence of Florida\'s legendary surf culture.',
    longDescription: 'From the consistent waves of Sebastian Inlet to the championship breaks of Cocoa Beach, Florida\'s Space Coast has produced some of the world\'s best surfers. Our Classic Surf Breaks collection celebrates these legendary spots with authentic vintage poster aesthetics that transport you to the golden age of Florida surfing.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
    products: [
      {
        id: 'sebastian-inlet',
        title: 'Sebastian Inlet Classic',
        style: 'Vintage Surf Poster',
        price: 45,
        originalPrice: 60,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop',
        isNew: true,
        isFeatured: true
      },
      {
        id: 'cocoa-beach',
        title: 'Cocoa Beach Legends',
        style: 'Art Deco',
        price: 42,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
        isFeatured: true
      },
      {
        id: 'new-smyrna',
        title: 'New Smyrna Beach Break',
        style: 'Minimalist Line Art',
        price: 40,
        image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c89a?w=400&h=500&fit=crop'
      }
    ]
  }
}

interface CollectionPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const collection = collectionsData[slug as keyof typeof collectionsData]
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')

  // Redirect to 404 if collection doesn't exist
  if (!collection) {
    return <div>Collection not found</div>
  }

  const sortedProducts = [...collection.products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.title.localeCompare(b.title)
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    }
  })

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={collection.heroImage}
            alt={collection.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60" />
        </div>
        
        {/* Decorative botanical elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 opacity-20 rotate-12">
            <Flower className="w-24 h-24 text-florida-flamingo-300" />
          </div>
          <div className="absolute bottom-20 right-20 opacity-20 -rotate-12">
            <Leaf className="w-20 h-20 text-florida-green-300" />
          </div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="space-y-6">
              <h1 className="font-florida-script text-5xl sm:text-6xl lg:text-7xl drop-shadow-lg">
                {collection.title}
              </h1>
              <h2 className="font-florida-display text-xl sm:text-2xl lg:text-3xl font-semibold opacity-90">
                {collection.subtitle}
              </h2>
              <p className="font-florida-body text-lg max-w-3xl mx-auto leading-relaxed opacity-90">
                {collection.description}
              </p>
              <div className="flex items-center justify-center space-x-2 pt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {collection.products.length} Prints
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb & Navigation */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-florida-sand-50/50 border-b border-florida-sand-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-florida-green-600">
              <Link href="/" className="hover:text-florida-green-800">Home</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-florida-green-800">Collections</Link>
              <span>/</span>
              <span className="text-florida-green-800 font-medium">{collection.title}</span>
            </div>
            <Button asChild variant="outline" size="sm" className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50">
              <Link href="/collections" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>All Collections</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Collection Description */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-florida-sand-50 to-florida-green-50/20 border-florida-sand-200">
            <CardContent className="p-8">
              <p className="font-florida-body text-lg text-florida-green-700 leading-relaxed">
                {collection.longDescription}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-florida-sand-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h3 className="font-florida-display text-lg font-semibold text-florida-green-800">
                {collection.products.length} Prints
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-florida-green-100 text-florida-green-800' : 'text-florida-green-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-florida-green-100 text-florida-green-800' : 'text-florida-green-600'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-florida-green-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-florida-sand-300 rounded-md px-3 py-1 text-sm text-florida-green-800 focus:outline-none focus:ring-2 focus:ring-florida-green-500"
                >
                  <option value="featured">Featured First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {product.isNew && (
                              <Badge variant="destructive" className="bg-black text-white text-xs">
                                NEW
                              </Badge>
                            )}
                            {product.isFeatured && (
                              <Badge variant="secondary" className="bg-florida-sunset-500 text-white text-xs">
                                FEATURED
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-florida-display text-lg font-medium text-florida-green-800">
                            {product.title}
                          </h3>
                          <p className="text-sm text-florida-green-600 font-medium uppercase tracking-wide">
                            {product.style}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold font-florida-display text-florida-green-800">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-florida-green-500 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          <Button asChild variant="florida" size="sm">
                            <Link href={`/products/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Collections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-florida-sand-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Explore More Collections
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Discover other curated collections that celebrate Florida&apos;s unique beauty and heritage.
            </p>
          </div>
          
          <div className="text-center">
            <Button asChild variant="florida" size="lg" className="text-lg px-8">
              <Link href="/collections" className="flex items-center space-x-2">
                <span>View All Collections</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-florida-green-800 text-florida-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-florida-script text-2xl">Old Florida</h3>
              <p className="text-sm text-florida-green-200">
                Celebrating Florida&apos;s heritage through vintage-inspired art.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Shop</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/prints" className="text-florida-green-200 hover:text-white">All Prints</Link></div>
                <div><Link href="/collections" className="text-florida-green-200 hover:text-white">Collections</Link></div>
                <div><Link href="/new" className="text-florida-green-200 hover:text-white">New Arrivals</Link></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Collections</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/collections/tropical-blooms" className="text-florida-green-200 hover:text-white">Tropical Blooms</Link></div>
                <div><Link href="/collections/surf-breaks" className="text-florida-green-200 hover:text-white">Surf Breaks</Link></div>
                <div><Link href="/collections/art-deco-florida" className="text-florida-green-200 hover:text-white">Art Deco</Link></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Connect</h4>
              <div className="space-y-2 text-sm">
                <div className="text-florida-green-200">hello@oldflorida.com</div>
                <div className="text-florida-green-200">(321) 555-ARTS</div>
                <div className="text-florida-green-200">Florida, USA</div>
              </div>
            </div>
          </div>
          <div className="border-t border-florida-green-700 mt-8 pt-8 text-center text-sm text-florida-green-200">
            <p>&copy; 2024 Old Florida Art Co. Celebrating the Sunshine State&apos;s timeless beauty.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 