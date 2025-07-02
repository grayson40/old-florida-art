'use client'

import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Filter, Grid, List, Flower, Leaf, Star, Frame, Home, Shirt, Package, Waves, Palette, Camera, Search, SlidersHorizontal } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useCollections, type Collection } from '@/hooks/use-collections'

const iconMap = {
  Flower,
  Waves,
  Palette,
  Camera,
  Leaf,
  Package,
  Star,
  Frame,
  Home,
  Shirt
};

const colorMap = {
  flamingo: 'from-pink-500 to-red-400',
  blue: 'from-blue-500 to-indigo-400',
  sunset: 'from-orange-500 to-pink-400',
  sand: 'from-yellow-500 to-orange-400',
  green: 'from-green-500 to-emerald-400',
  gold: 'from-yellow-500 to-amber-400',
  purple: 'from-purple-500 to-indigo-400',
  pink: 'from-pink-500 to-purple-400'
};

export default function CollectionPage() {
  const params = useParams()
  const slug = params.slug as string
  const { collections, loading, error, getCollectionById } = useCollections()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const collection = getCollectionById(slug)

  useEffect(() => {
    if (collections.length > 0 && !collection) {
      // Collection not found, could redirect to 404 or collections page
      console.warn(`Collection ${slug} not found`)
    }
  }, [collections, collection, slug])

  const filteredAndSortedProducts = useMemo(() => {
    if (!collection) return []
    
    let products = [...collection.products]

    // Apply search filter
    if (searchTerm) {
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.style.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    products.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.title.localeCompare(b.title)
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
      }
    })

    return products
  }, [collection, sortBy, searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "The collection you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link href="/collections">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Collections
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const IconComponent = iconMap[collection.icon as keyof typeof iconMap] || Package
  const gradientClass = colorMap[collection.color as keyof typeof colorMap] || colorMap.blue

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-florida-sand-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={collection.heroImage}
            alt={collection.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 opacity-20 rotate-12">
            <IconComponent className="w-24 h-24 text-white" />
          </div>
          <div className="absolute bottom-20 right-20 opacity-20 -rotate-12">
            <IconComponent className="w-20 h-20 text-white" />
          </div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradientClass} backdrop-blur-sm shadow-lg`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                {collection.featured && (
                  <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400 px-3 py-1">
                    Featured Collection
                  </Badge>
                )}
              </div>
              
              <h1 className="font-florida-script text-5xl sm:text-6xl lg:text-7xl drop-shadow-lg">
                {collection.title}
              </h1>
              <h2 className="font-florida-display text-xl sm:text-2xl lg:text-3xl font-semibold opacity-90">
                {collection.subtitle}
              </h2>
              <p className="font-florida-body text-lg max-w-4xl mx-auto leading-relaxed opacity-90">
                {collection.description}
              </p>
              <div className="flex items-center justify-center space-x-4 pt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  {collection.productCount} Products
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  {collection.vendor === 'gooten' ? 'Print-on-Demand' : 'Curated'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb & Navigation */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-sm border-b border-florida-sand-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-2 text-sm text-florida-green-600">
              <Link href="/" className="hover:text-florida-green-800 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-florida-green-800 transition-colors">Collections</Link>
              <span>/</span>
              <span className="text-florida-green-800 font-medium">{collection.title}</span>
            </div>
            <Button asChild variant="outline" size="sm" className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50 w-fit">
              <Link href="/collections" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>All Collections</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm border-b border-florida-sand-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-florida-sand-300 rounded-lg focus:ring-2 focus:ring-florida-blue-500 focus:border-transparent bg-white/80"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-florida-sand-300 rounded-lg bg-white/80 text-sm focus:ring-2 focus:ring-florida-blue-500"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">A-Z</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-florida-sand-300 rounded-lg overflow-hidden bg-white/80">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-florida-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-florida-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Results count */}
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {filteredAndSortedProducts.length} products
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? `No products match "${searchTerm}"` : 'No products available in this collection'}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                     {filteredAndSortedProducts.map((product) => (
                     <ProductCard
                       key={product.id}
                       id={product.id}
                       title={product.title}
                       style={product.style}
                       price={product.price}
                       originalPrice={product.originalPrice}
                       image={product.image}
                       isNew={product.isNew}
                       isFeatured={product.isFeatured}
                     />
                   ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-florida-sand-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-48 h-48 md:h-auto">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-2">
                                  {product.title}
                                </h3>
                                <p className="text-florida-green-600 mb-2">{product.style}</p>
                                <div className="flex items-center gap-2 mb-4">
                                  {product.isNew && (
                                    <Badge className="bg-florida-blue-100 text-florida-blue-800">New</Badge>
                                  )}
                                  {product.isFeatured && (
                                    <Badge className="bg-florida-flamingo-100 text-florida-flamingo-800">Featured</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-florida-display text-2xl font-bold text-florida-green-800">
                                  ${product.price}
                                </div>
                                {product.originalPrice && (
                                  <div className="text-sm text-gray-500 line-through">
                                    ${product.originalPrice}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button asChild className="bg-florida-blue-600 hover:bg-florida-blue-700">
                                <Link href={`/products/${product.id}`}>
                                  View Details
                                </Link>
                              </Button>
                              <Button variant="outline" className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50">
                                Quick Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-florida-green-800 text-florida-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-florida-script text-2xl">Old Florida</h3>
              <p className="text-sm text-florida-green-200">
                Celebrating Florida's heritage through vintage-inspired art that 
                brings the beauty of the Sunshine State to your home.
              </p>
              <div className="flex space-x-4">
                <Badge variant="outline" className="text-xs text-florida-green-200 border-florida-green-600">
                  Made in Florida
                </Badge>
                <Badge variant="outline" className="text-xs text-florida-green-200 border-florida-green-600">
                  Premium Quality
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Shop</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/prints" className="text-florida-green-200 hover:text-white transition-colors">All Prints</Link></div>
                <div><Link href="/collections" className="text-florida-green-200 hover:text-white transition-colors">Collections</Link></div>
                <div><Link href="/prints?category=bestsellers" className="text-florida-green-200 hover:text-white transition-colors">Best Sellers</Link></div>
                <div><Link href="/prints?filter=new" className="text-florida-green-200 hover:text-white transition-colors">New Arrivals</Link></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Learn</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/about" className="text-florida-green-200 hover:text-white transition-colors">Our Story</Link></div>
                <div><Link href="/collections" className="text-florida-green-200 hover:text-white transition-colors">Art Collections</Link></div>
                <div><span className="text-florida-green-200">Print Care Guide</span></div>
                <div><span className="text-florida-green-200">Size Guide</span></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Connect</h4>
              <div className="space-y-2 text-sm">
                <div className="text-florida-green-200">hello@oldflorida.com</div>
                <div className="text-florida-green-200">(321) 555-ARTS</div>
                <div className="text-florida-green-200">Florida, USA</div>
                <div className="flex items-center space-x-2 text-florida-green-200">
                  <Star className="h-4 w-4 fill-current" />
                  <span>4.9/5 Customer Rating</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-florida-green-700 mt-8 pt-8 text-center text-sm text-florida-green-200">
            <p>&copy; 2024 Old Florida Art Co. All rights reserved. Made with ❤️ in the Sunshine State.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 