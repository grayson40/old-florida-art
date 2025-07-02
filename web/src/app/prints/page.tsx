'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { 
  SlidersHorizontal, 
  Filter, 
  Grid, 
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Zap,
  Star,
  TrendingUp,
  Search,
  Heart,
  ShoppingCart,
  Eye,
  Check,
  ArrowUpDown,
  Grid3X3,
  LayoutGrid
} from 'lucide-react'
import { useGootenProducts, type TransformedProduct } from '@/hooks/use-gooten-products'

const ITEMS_PER_PAGE = 12

function PrintsPageContent() {
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('All Collections')
  const [selectedStyle, setSelectedStyle] = useState('All Styles')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [gridSize, setGridSize] = useState<3 | 4>(4)
  const [currentPage, setCurrentPage] = useState(1)

  // Get Gooten products
  const { products: gootenProducts, loading: gootenLoading, error: gootenError } = useGootenProducts()

  // Use only Gooten products
  const allProducts = useMemo(() => {
    return gootenProducts
  }, [gootenProducts])

  // Handle URL search parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || searchParams.get('q') || ''
    const categoryFromUrl = searchParams.get('category') || ''
    const filterFromUrl = searchParams.get('filter') || ''
    
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
      setShowFilters(true)
    }
    
    if (categoryFromUrl) {
      const categoryMap: Record<string, string> = {
        'bestsellers': 'All Collections',
        'tropical': 'Tropical Blooms',
        'surf': 'Surf Breaks',
        'deco': 'Art Deco Florida',
        'vintage': 'Vintage Postcards'
      }
      const mappedCollection = categoryMap[categoryFromUrl] || 'All Collections'
      setSelectedCollection(mappedCollection)
    }
    
    if (filterFromUrl) {
      switch (filterFromUrl) {
        case 'new':
          setShowNewOnly(true)
          break
        case 'featured':
          setShowFeaturedOnly(true)
          break
        default:
          break
      }
    }
  }, [searchParams])

  // Extract unique collections and styles from all products
  const collections = useMemo(() => {
    const collectionsSet = new Set(allProducts.map((product: TransformedProduct) => product.collection))
    return ['All Collections', ...Array.from(collectionsSet)]
  }, [allProducts])

  const artStyles = useMemo(() => {
    const stylesSet = new Set(allProducts.map((product: TransformedProduct) => product.style))
    return ['All Styles', ...Array.from(stylesSet)]
  }, [allProducts])

  const sortOptions = [
    { value: 'featured', label: 'Featured', icon: Star },
    { value: 'newest', label: 'Newest First', icon: Zap },
    { value: 'price-low', label: 'Price: Low to High', icon: ArrowUpDown },
    { value: 'price-high', label: 'Price: High to Low', icon: ArrowUpDown },
    { value: 'name', label: 'Name A-Z', icon: ArrowUpDown }
  ]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product: TransformedProduct) => {
      // Search query filter
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false
      }

      // Collection filter
      if (selectedCollection !== 'All Collections' && product.collection !== selectedCollection) {
        return false
      }
      
      // Style filter
      if (selectedStyle !== 'All Styles' && product.style !== selectedStyle) {
        return false
      }
      
      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }
      
      // New only filter
      if (showNewOnly && !product.isNew) {
        return false
      }

      // Featured only filter
      if (showFeaturedOnly && !product.isFeatured) {
        return false
      }
      
      return true
    })

    // Sort products
    filtered.sort((a: TransformedProduct, b: TransformedProduct) => {
      switch (sortBy) {
        case 'featured':
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return 0
        case 'newest':
          if (a.isNew && !b.isNew) return -1
          if (!a.isNew && b.isNew) return 1
          return 0
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [allProducts, searchQuery, selectedCollection, selectedStyle, priceRange, showNewOnly, showFeaturedOnly, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCollection('All Collections')
    setSelectedStyle('All Styles')
    setPriceRange([0, 100])
    setShowNewOnly(false)
    setShowFeaturedOnly(false)
    setSortBy('featured')
    setCurrentPage(1)
  }

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedCollection !== 'All Collections') count++
    if (selectedStyle !== 'All Styles') count++
    if (priceRange[0] > 0 || priceRange[1] < 100) count++
    if (showNewOnly) count++
    if (showFeaturedOnly) count++
    if (searchQuery) count++
    return count
  }, [selectedCollection, selectedStyle, priceRange, showNewOnly, showFeaturedOnly, searchQuery])

  // Loading state
  if (gootenLoading) {
    return (
      <div className="min-h-screen bg-florida-sand-50/30">
        <Navigation />
        <div className="flex items-center justify-center min-h-64 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-florida-green-600 mx-auto mb-4"></div>
            <p className="text-florida-green-600 font-medium">Loading beautiful Florida prints...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-florida-sand-50/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-8 bg-white border-b border-florida-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-2">
                Prints
              </h1>
              <p className="text-lg text-florida-green-600">
                Discover {allProducts.length} beautiful vintage-inspired prints celebrating Florida's natural beauty
              </p>
              
              {gootenError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{gootenError}</p>
          </div>
              )}
          </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-florida-green-100 rounded-full mb-2">
                  <Package className="h-6 w-6 text-florida-green-600" />
          </div>
                <div className="font-semibold text-florida-green-800">{allProducts.length}</div>
                <div className="text-sm text-florida-green-600">Prints</div>
        </div>
        
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-florida-sunset-100 rounded-full mb-2">
                  <Star className="h-6 w-6 text-florida-sunset-600" />
                </div>
                <div className="font-semibold text-florida-green-800">4.9★</div>
                <div className="text-sm text-florida-green-600">Rating</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-florida-blue-100 rounded-full mb-2">
                  <Zap className="h-6 w-6 text-florida-blue-600" />
                </div>
                <div className="font-semibold text-florida-green-800">3-5</div>
                <div className="text-sm text-florida-green-600">Days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className={`w-full lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="border-florida-sand-200 sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-florida-green-600" />
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-florida-sunset-100 text-florida-sunset-700">
                        {activeFilterCount} active
                      </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                        onClick={clearAllFilters}
                        className="text-florida-green-600 hover:text-florida-green-800 p-1"
                >
                        <X className="h-4 w-4" />
                </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Search within results */}
                <div>
                  <label className="block text-sm font-medium text-florida-green-800 mb-2">
                    Search Prints
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-florida-green-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search by name or style..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-florida-sand-300 focus:border-florida-green-400 focus:ring-florida-green-400"
                    />
                  </div>
                </div>

                {/* Collection Filter */}
                <div>
                  <label className="block text-sm font-medium text-florida-green-800 mb-3">
                    Collection
                  </label>
                  <div className="space-y-2">
                    {collections.map(collection => (
                      <label key={collection} className="flex items-center">
                        <input
                          type="radio"
                          name="collection"
                          checked={selectedCollection === collection}
                          onChange={() => setSelectedCollection(collection)}
                          className="mr-3 text-florida-green-600 focus:ring-florida-green-400"
                        />
                        <span className="text-sm text-florida-green-700">{collection}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Style Filter */}
                <div>
                  <label className="block text-sm font-medium text-florida-green-800 mb-3">
                    Art Style
                  </label>
                  <div className="space-y-2">
                    {artStyles.map(style => (
                      <label key={style} className="flex items-center">
                        <input
                          type="radio"
                          name="style"
                          checked={selectedStyle === style}
                          onChange={() => setSelectedStyle(style)}
                          className="mr-3 text-florida-green-600 focus:ring-florida-green-400"
                        />
                        <span className="text-sm text-florida-green-700">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-florida-green-800 mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-florida-green-600 mt-1">
                    <span>$0</span>
                    <span>$100+</span>
                  </div>
                </div>

                {/* Special Filters */}
                <div>
                  <label className="block text-sm font-medium text-florida-green-800 mb-3">
                    Special Features
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showFeaturedOnly}
                        onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                        className="mr-3 text-florida-green-600 focus:ring-florida-green-400 rounded"
                      />
                      <span className="text-sm text-florida-green-700">Featured Only</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showNewOnly}
                        onChange={(e) => setShowNewOnly(e.target.checked)}
                        className="mr-3 text-florida-green-600 focus:ring-florida-green-400 rounded"
                      />
                      <span className="text-sm text-florida-green-700">New Arrivals</span>
                    </label>
              </div>
            </div>
            
                {/* Quick Clear */}
                {activeFilterCount > 0 && (
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="w-full border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            
            {/* Top Controls */}
            <div className="bg-white rounded-lg border border-florida-sand-200 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left side - Results and mobile filter */}
                <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden border-florida-green-300 text-florida-green-700"
              >
                    <Filter className="w-4 h-4 mr-2" />
                Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-florida-sunset-100 text-florida-sunset-700">
                        {activeFilterCount}
                  </Badge>
                )}
              </Button>

                  <div className="text-sm text-florida-green-600">
                    <span className="font-medium">{filteredProducts.length}</span> of {allProducts.length} prints
            </div>
          </div>

                {/* Right side - View controls and sort */}
                <div className="flex items-center gap-3">
                  
                  {/* Grid size control */}
                  <div className="hidden sm:flex items-center gap-1 border border-florida-sand-300 rounded-lg p-1">
                <Button
                      variant={gridSize === 3 ? "default" : "ghost"}
                  size="sm"
                      onClick={() => setGridSize(3)}
                      className="p-2"
                >
                      <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                      variant={gridSize === 4 ? "default" : "ghost"}
                  size="sm"
                      onClick={() => setGridSize(4)}
                      className="p-2"
                >
                      <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>

                  {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-florida-sand-300 rounded-lg bg-white text-florida-green-800 focus:border-florida-green-400 focus:ring-florida-green-400 text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

              {/* Active Filters Display */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-florida-sand-200">
                  <span className="text-sm text-florida-green-600 mr-2">Active filters:</span>
                  
                {selectedCollection !== 'All Collections' && (
                    <Badge variant="secondary" className="bg-florida-green-100 text-florida-green-700">
                    {selectedCollection}
                      <button
                        onClick={() => setSelectedCollection('All Collections')}
                        className="ml-1 text-florida-green-500 hover:text-florida-green-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                  </Badge>
                )}
                  
                {selectedStyle !== 'All Styles' && (
                    <Badge variant="secondary" className="bg-florida-blue-100 text-florida-blue-700">
                    {selectedStyle}
                      <button
                        onClick={() => setSelectedStyle('All Styles')}
                        className="ml-1 text-florida-blue-500 hover:text-florida-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                  </Badge>
                )}
                  
                  {(priceRange[0] > 0 || priceRange[1] < 100) && (
                    <Badge variant="secondary" className="bg-florida-sunset-100 text-florida-sunset-700">
                      ${priceRange[0]} - ${priceRange[1]}
                  <button
                        onClick={() => setPriceRange([0, 100])}
                        className="ml-1 text-florida-sunset-500 hover:text-florida-sunset-700"
                      >
                        <X className="h-3 w-3" />
                  </button>
                    </Badge>
                  )}
                  
                  {showFeaturedOnly && (
                    <Badge variant="secondary" className="bg-florida-flamingo-100 text-florida-flamingo-700">
                      Featured
                  <button
                        onClick={() => setShowFeaturedOnly(false)}
                        className="ml-1 text-florida-flamingo-500 hover:text-florida-flamingo-700"
                      >
                        <X className="h-3 w-3" />
                  </button>
                                </Badge>
                              )}
                  
                  {showNewOnly && (
                    <Badge variant="secondary" className="bg-florida-green-100 text-florida-green-700">
                      New
                      <button
                        onClick={() => setShowNewOnly(false)}
                        className="ml-1 text-florida-green-500 hover:text-florida-green-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                                    </Badge>
                                  )}

                  {searchQuery && (
                    <Badge variant="secondary" className="bg-florida-blue-100 text-florida-blue-700">
                      "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 text-florida-blue-500 hover:text-florida-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                                    </Badge>
                                  )}
                                </div>
                                    )}
                                  </div>
                                  
            {/* No Results */}
            {filteredProducts.length === 0 && !gootenLoading && (
              <Card className="text-center py-16 border-florida-sand-200">
                <CardContent>
                  <Package className="h-16 w-16 text-florida-green-400 mx-auto mb-6" />
                  <h2 className="font-florida-display text-2xl text-florida-green-800 mb-4">
                    No Prints Found
                  </h2>
                  <p className="text-florida-green-600 mb-8 max-w-md mx-auto">
                    We couldn't find any prints matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button onClick={clearAllFilters} variant="florida">
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 && (
              <>
                <div className={`grid gap-6 ${
                  gridSize === 3 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="group">
                      <ProductCard
                        id={product.id}
                        title={product.title}
                        style={product.style}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.image}
                        isNew={product.isNew}
                        isFeatured={product.isFeatured}
                      />
                        </div>
                    ))}
                  </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Card className="border-florida-sand-200">
                    <CardContent className="py-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        
                        {/* Page info */}
                        <div className="text-sm text-florida-green-600">
                          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} prints
                        </div>

                        {/* Pagination controls */}
                        <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="flex items-center space-x-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const page = i + 1
                          return (
                              <Button
                                  key={page}
                                  variant={currentPage === page ? 'florida' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                  className="w-10 h-10"
                              >
                                {page}
                              </Button>
                          )
                        })}
                            {totalPages > 5 && (
                              <>
                                {totalPages > 6 && <span className="text-florida-green-600 px-2">...</span>}
                                <Button
                                  variant={currentPage === totalPages ? 'florida' : 'outline'}
                                  size="sm"
                                  onClick={() => setCurrentPage(totalPages)}
                                  className="w-10 h-10"
                                >
                                  {totalPages}
                                </Button>
                              </>
                            )}
                    </div>
                    
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="flex items-center space-x-2"
                    >
                            <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Bottom CTA */}
            <Card className="border-florida-sand-200 bg-gradient-to-br from-florida-green-50 to-florida-blue-50">
              <CardContent className="text-center py-12">
                <h3 className="font-florida-script text-3xl text-florida-green-800 mb-4">
                  Can't Find What You're Looking For?
                </h3>
                <p className="text-florida-green-600 mb-8 max-w-2xl mx-auto">
                  Explore our curated collections for themed prints, or contact us for custom artwork requests. 
                  We're here to help you find the perfect Florida art for your space.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" size="lg" className="border-florida-green-300 text-florida-green-700 hover:bg-white">
                    <Link href="/collections" className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Browse Collections</span>
                    </Link>
                  </Button>
                  <Button asChild variant="florida" size="lg">
                    <Link href="/about" className="flex items-center space-x-2">
                      <Heart className="h-5 w-5" />
                      <span>Contact Us</span>
                    </Link>
                </Button>
              </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

function PrintsPageLoading() {
  return (
    <div className="min-h-screen bg-florida-sand-50/30">
      <Navigation />
      <div className="flex items-center justify-center min-h-64 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-florida-green-600 mx-auto mb-4"></div>
          <p className="text-florida-green-600 font-medium">Loading beautiful Florida prints...</p>
        </div>
      </div>
    </div>
  )
}

export default function PrintsPage() {
  return (
    <Suspense fallback={<PrintsPageLoading />}>
      <PrintsPageContent />
    </Suspense>
  )
} 