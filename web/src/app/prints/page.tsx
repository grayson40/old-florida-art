'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  SlidersHorizontal, 
  Search, 
  Filter, 
  Grid, 
  List,
  Flower,
  Leaf,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Enhanced mock products data with more variety and botanical themes
const allProducts = [
  // Tropical Blooms Collection
  {
    id: 'hibiscus-classic',
    title: 'Classic Hibiscus Dreams',
    style: 'Vintage Watercolor',
    collection: 'Tropical Blooms',
    price: 48,
    originalPrice: 65,
    image: 'https://images.unsplash.com/photo-1594736797933-d0b22ba58871?w=400&h=500&fit=crop',
    isNew: true,
    isFeatured: true,
    tags: ['botanical', 'hibiscus', 'tropical']
  },
  {
    id: 'bougainvillea-sunset',
    title: 'Bougainvillea Sunset',
    style: 'Art Deco Botanical',
    collection: 'Tropical Blooms',
    price: 45,
    image: 'https://images.unsplash.com/photo-1615232741321-8bfb1a5ffe26?w=400&h=500&fit=crop',
    isFeatured: true,
    tags: ['botanical', 'sunset', 'art-deco']
  },
  {
    id: 'palm-fronds',
    title: 'Sacred Palm Fronds',
    style: 'Minimalist Line Art',
    collection: 'Tropical Blooms',
    price: 42,
    image: 'https://images.unsplash.com/photo-1566054757965-edebc3e5e82a?w=400&h=500&fit=crop',
    tags: ['botanical', 'palm', 'minimalist']
  },
  {
    id: 'tropical-paradise',
    title: 'Tropical Paradise Triptych',
    style: 'Vintage Watercolor',
    collection: 'Tropical Blooms',
    price: 85,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=500&fit=crop',
    isNew: true,
    tags: ['botanical', 'tropical', 'triptych']
  },
  {
    id: 'flamingo-flower',
    title: 'Flamingo Flower Elegance',
    style: 'Botanical Illustration',
    collection: 'Tropical Blooms',
    price: 52,
    image: 'https://images.unsplash.com/photo-1586973826243-7c3c0516f1b6?w=400&h=500&fit=crop',
    tags: ['botanical', 'elegant', 'illustration']
  },
  {
    id: 'orchid-collection',
    title: 'Wild Orchid Collection',
    style: 'Vintage Watercolor',
    collection: 'Tropical Blooms',
    price: 58,
    image: 'https://images.unsplash.com/photo-1578932750355-5eb30ece487a?w=400&h=500&fit=crop',
    tags: ['botanical', 'orchid', 'vintage']
  },
  
  // Surf Breaks Collection
  {
    id: 'sebastian-inlet',
    title: 'Sebastian Inlet Classic',
    style: 'Vintage Surf Poster',
    collection: 'Surf Breaks',
    price: 45,
    originalPrice: 60,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop',
    isNew: true,
    isFeatured: true,
    tags: ['surf', 'vintage', 'classic']
  },
  {
    id: 'cocoa-beach',
    title: 'Cocoa Beach Legends',
    style: 'Art Deco',
    collection: 'Surf Breaks',
    price: 42,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
    isFeatured: true,
    tags: ['surf', 'art-deco', 'beach']
  },
  {
    id: 'new-smyrna',
    title: 'New Smyrna Beach Break',
    style: 'Minimalist Line Art',
    collection: 'Surf Breaks',
    price: 40,
    image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c89a?w=400&h=500&fit=crop',
    tags: ['surf', 'minimalist', 'beach']
  },

  // Art Deco Collection
  {
    id: 'deco-skyline',
    title: 'Miami Deco Skyline',
    style: 'Art Deco',
    collection: 'Art Deco Florida',
    price: 52,
    image: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=400&h=500&fit=crop',
    tags: ['art-deco', 'miami', 'skyline']
  },
  {
    id: 'deco-flamingo',
    title: 'Art Deco Flamingo',
    style: 'Art Deco',
    collection: 'Art Deco Florida',
    price: 49,
    image: 'https://images.unsplash.com/photo-1594736797933-d0b22ba58871?w=400&h=500&fit=crop',
    tags: ['art-deco', 'flamingo', 'geometric']
  },

  // Vintage Postcards
  {
    id: 'vintage-postcard',
    title: 'Greetings from Paradise',
    style: 'Vintage Postcard',
    collection: 'Vintage Postcards',
    price: 38,
    image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c89a?w=400&h=500&fit=crop',
    tags: ['vintage', 'postcard', 'retro']
  },
  {
    id: 'sunny-florida',
    title: 'Sunny Florida Days',
    style: 'Vintage Postcard',
    collection: 'Vintage Postcards',
    price: 36,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop',
    tags: ['vintage', 'sunny', 'retro']
  },

  // Mangrove Collection
  {
    id: 'mangrove-twilight',
    title: 'Mangrove Twilight',
    style: 'Atmospheric Watercolor',
    collection: 'Mangrove Mysteries',
    price: 46,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=500&fit=crop',
    tags: ['mangrove', 'atmospheric', 'twilight']
  }
]

const collections = ['All Collections', 'Tropical Blooms', 'Surf Breaks', 'Art Deco Florida', 'Vintage Postcards', 'Mangrove Mysteries']
const artStyles = ['All Styles', 'Vintage Watercolor', 'Art Deco', 'Minimalist Line Art', 'Botanical Illustration', 'Vintage Surf Poster', 'Atmospheric Watercolor', 'Vintage Postcard', 'Art Deco Botanical']
const priceRanges = ['All Prices', 'Under $40', '$40-$50', '$50-$60', 'Over $60']
const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' }
]

const ITEMS_PER_PAGE = 12

export default function PrintsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('All Collections')
  const [selectedStyle, setSelectedStyle] = useState('All Styles')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices')
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Search filter
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.style.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.collection.toLowerCase().includes(searchQuery.toLowerCase())) {
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
      
      // Price filter
      if (selectedPriceRange !== 'All Prices') {
        if (selectedPriceRange === 'Under $40' && product.price >= 40) return false
        if (selectedPriceRange === '$40-$50' && (product.price < 40 || product.price > 50)) return false
        if (selectedPriceRange === '$50-$60' && (product.price < 50 || product.price > 60)) return false
        if (selectedPriceRange === 'Over $60' && product.price <= 60) return false
      }
      
      // Feature filters
      if (showNewOnly && !product.isNew) return false
      if (showFeaturedOnly && !product.isFeatured) return false
      
      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
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

    return filtered
  }, [searchQuery, selectedCollection, selectedStyle, selectedPriceRange, showNewOnly, showFeaturedOnly, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCollection('All Collections')
    setSelectedStyle('All Styles')
    setSelectedPriceRange('All Prices')
    setShowNewOnly(false)
    setShowFeaturedOnly(false)
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || selectedCollection !== 'All Collections' || 
    selectedStyle !== 'All Styles' || selectedPriceRange !== 'All Prices' || 
    showNewOnly || showFeaturedOnly

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Botanical Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-florida-sand-50 to-florida-green-50/30">
        {/* Decorative botanical elements */}
        <div className="absolute inset-0">
          {/* Hibiscus decorative elements */}
          <div className="absolute top-20 left-10 opacity-10 rotate-12">
          <Flower className="w-32 h-32 text-florida-flamingo-300" />
          </div>
          <div className="absolute top-40 right-20 opacity-10 -rotate-45">
            <Flower className="w-32 h-32 text-florida-flamingo-300" />
          </div>
          <div className="absolute bottom-20 left-1/4 opacity-10 rotate-45">
            <Leaf className="w-24 h-24 text-florida-green-300" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-florida-script text-5xl sm:text-6xl lg:text-7xl text-florida-green-800 mb-4 drop-shadow-sm">
            Art Prints
          </h1>
          <p className="font-florida-body text-lg sm:text-xl text-florida-green-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover our complete collection of vintage-inspired Florida art. 
            From hibiscus blooms to legendary surf breaks, each piece captures 
            the timeless spirit of the Sunshine State.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-florida-green-500" />
              <Input
                type="text"
                placeholder="Search prints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-florida-sand-300 focus:ring-florida-green-500 focus:border-florida-green-500 bg-white/90"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Controls */}
        <div className="space-y-4 mb-8">
          {/* Mobile-first header */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between">
              <h2 className="font-florida-display text-lg font-semibold text-florida-green-800">
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'Print' : 'Prints'}
              </h2>
              
              {/* Mobile view toggle */}
              <div className="flex items-center space-x-2 sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-florida-green-100 text-florida-green-800' : 'text-florida-green-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-florida-green-100 text-florida-green-800' : 'text-florida-green-600'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Mobile controls row */}
            <div className="flex items-center space-x-3">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:hidden border-florida-sand-300 justify-center"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 bg-florida-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {[
                      searchQuery && 1,
                      selectedCollection !== 'All Collections' && 1,
                      selectedStyle !== 'All Styles' && 1,
                      selectedPriceRange !== 'All Prices' && 1,
                      showNewOnly && 1,
                      showFeaturedOnly && 1
                    ].filter(Boolean).length}
                  </Badge>
                )}
              </Button>

              {/* Mobile Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:hidden bg-white border border-florida-sand-300 rounded-md px-3 py-2 text-sm text-florida-green-800 focus:outline-none focus:ring-2 focus:ring-florida-green-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop controls */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Desktop View Mode Toggle */}
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

              {/* Desktop Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-florida-green-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-florida-sand-300 rounded-md px-3 py-1 text-sm text-florida-green-800 focus:outline-none focus:ring-2 focus:ring-florida-green-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile active filters display */}
          {hasActiveFilters && (
            <div className="sm:hidden">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="outline" className="border-florida-green-300 text-florida-green-700 text-xs">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {selectedCollection !== 'All Collections' && (
                  <Badge variant="outline" className="border-florida-green-300 text-florida-green-700 text-xs">
                    {selectedCollection}
                  </Badge>
                )}
                {selectedStyle !== 'All Styles' && (
                  <Badge variant="outline" className="border-florida-green-300 text-florida-green-700 text-xs">
                    {selectedStyle}
                  </Badge>
                )}
                {selectedPriceRange !== 'All Prices' && (
                  <Badge variant="outline" className="border-florida-green-300 text-florida-green-700 text-xs">
                    {selectedPriceRange}
                  </Badge>
                )}
                {showNewOnly && (
                  <Badge variant="outline" className="border-florida-green-300 text-florida-green-700 text-xs">
                    New Only
                  </Badge>
                )}
                {showFeaturedOnly && (
                  <Badge variant="outline" className="border-florida-green-300 text-florida-green-700 text-xs">
                    Featured Only
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-florida-green-600 hover:text-florida-green-800 text-xs px-2 py-1 h-auto"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Collection Filter */}
            <Card className="border-florida-sand-200 bg-florida-sand-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-florida-green-800 flex items-center">
                  <Flower className="h-4 w-4 mr-2" />
                  Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {collections.map(collection => (
                  <button
                    key={collection}
                    onClick={() => {
                      setSelectedCollection(collection)
                      setCurrentPage(1)
                    }}
                    className={`block w-full text-left text-sm py-2 px-3 rounded-md transition-colors ${
                      selectedCollection === collection 
                        ? 'bg-florida-green-100 text-florida-green-800 font-medium' 
                        : 'text-florida-green-600 hover:text-florida-green-800 hover:bg-florida-green-50'
                    }`}
                  >
                    {collection}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Art Style Filter */}
            <Card className="border-florida-sand-200 bg-florida-sand-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-florida-green-800 flex items-center">
                  <Leaf className="h-4 w-4 mr-2" />
                  Art Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {artStyles.map(style => (
                  <button
                    key={style}
                    onClick={() => {
                      setSelectedStyle(style)
                      setCurrentPage(1)
                    }}
                    className={`block w-full text-left text-sm py-2 px-3 rounded-md transition-colors ${
                      selectedStyle === style 
                        ? 'bg-florida-green-100 text-florida-green-800 font-medium' 
                        : 'text-florida-green-600 hover:text-florida-green-800 hover:bg-florida-green-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Price Range Filter */}
            <Card className="border-florida-sand-200 bg-florida-sand-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-florida-green-800">Price Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {priceRanges.map(range => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedPriceRange(range)
                      setCurrentPage(1)
                    }}
                    className={`block w-full text-left text-sm py-2 px-3 rounded-md transition-colors ${
                      selectedPriceRange === range 
                        ? 'bg-florida-green-100 text-florida-green-800 font-medium' 
                        : 'text-florida-green-600 hover:text-florida-green-800 hover:bg-florida-green-50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Special Features */}
            <Card className="border-florida-sand-200 bg-florida-sand-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-florida-green-800">Special Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNewOnly}
                    onChange={(e) => {
                      setShowNewOnly(e.target.checked)
                      setCurrentPage(1)
                    }}
                    className="rounded border-florida-sand-300 text-florida-green-600 focus:ring-florida-green-500"
                  />
                  <span className="text-sm text-florida-green-700">New Arrivals</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => {
                      setShowFeaturedOnly(e.target.checked)
                      setCurrentPage(1)
                    }}
                    className="rounded border-florida-sand-300 text-florida-green-600 focus:ring-florida-green-500"
                  />
                  <span className="text-sm text-florida-green-700">Featured</span>
                </label>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 mb-8">
                    {paginatedProducts.map((product) => (
                      <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-florida-sand-200/50 bg-white/90 backdrop-blur-sm rounded-xl">
                        <div className="flex flex-col sm:flex-row">
                          {/* Image Section */}
                          <div className="relative w-full sm:w-32 md:w-40 lg:w-48 h-48 sm:h-32 md:h-36 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                            />
                            
                            {/* Mobile badges overlay */}
                            <div className="absolute top-2 left-2 flex flex-wrap gap-1 sm:hidden">
                              {product.isNew && (
                                <Badge className="bg-gradient-to-r from-florida-flamingo-400 to-florida-sunset-400 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg border-0">
                                  <Flower className="w-2 h-2 mr-1" />
                                  New
                                </Badge>
                              )}
                              {product.isFeatured && (
                                <Badge className="bg-gradient-to-r from-florida-blue-400 to-florida-green-400 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg border-0">
                                  ⭐ Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Content Section */}
                          <CardContent className="flex-1 p-4 sm:p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between h-full">
                              <div className="space-y-2 flex-1 mb-3 sm:mb-0">
                                {/* Desktop badges */}
                                <div className="hidden sm:flex items-center space-x-2 mb-2">
                                  {product.isNew && (
                                    <Badge className="bg-gradient-to-r from-florida-flamingo-400 to-florida-sunset-400 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg border-0">
                                      <Flower className="w-2 h-2 mr-1" />
                                      New
                                    </Badge>
                                  )}
                                  {product.isFeatured && (
                                    <Badge className="bg-gradient-to-r from-florida-blue-400 to-florida-green-400 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg border-0">
                                      ⭐ Featured
                                    </Badge>
                                  )}
                                </div>
                                
                                <Link href={`/products/${product.id}`} className="block group/title">
                                  <h3 className="font-florida-display text-base sm:text-lg font-semibold text-florida-green-800 group-hover/title:text-florida-green-600 transition-colors line-clamp-2 leading-tight">
                                    {product.title}
                                  </h3>
                                </Link>
                                
                                <p className="text-xs sm:text-sm text-florida-green-600 font-medium uppercase tracking-wide opacity-80">
                                  {product.style}
                                </p>
                                
                                <p className="text-xs text-florida-green-500 hidden sm:block">
                                  {product.collection}
                                </p>
                              </div>
                              
                              {/* Price and Action Section */}
                              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right space-x-3 sm:space-x-0 sm:space-y-3">
                                <div className="flex flex-col sm:items-end">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg sm:text-xl font-bold font-florida-display text-florida-green-800">
                                      ${product.price}
                                    </span>
                                    {product.originalPrice && (
                                      <span className="text-sm text-florida-green-500 line-through opacity-75">
                                        ${product.originalPrice}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {product.originalPrice && (
                                    <Badge variant="outline" className="border-florida-flamingo-300 text-florida-flamingo-600 text-xs px-2 py-1 rounded-full mt-1 hidden sm:inline-flex">
                                      Save ${product.originalPrice - product.price}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex flex-col space-y-2">
                                  <Button asChild variant="florida" size="sm" className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg">
                                    <Link href={`/products/${product.id}`}>
                                      <span className="hidden sm:inline">View Details</span>
                                      <span className="sm:hidden">View</span>
                                    </Link>
                                  </Button>
                                  
                                  {/* Mobile collection info */}
                                  <p className="text-xs text-florida-green-500 text-center sm:hidden">
                                    {product.collection}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="border-florida-sand-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 1
                        )
                        .map((page, index, array) => {
                          const showEllipsis = index > 0 && array[index - 1] !== page - 1
                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsis && <span className="px-2 text-florida-green-500">...</span>}
                              <Button
                                variant={currentPage === page ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={currentPage === page ? "bg-florida-green-500 text-white" : "text-florida-green-600"}
                              >
                                {page}
                              </Button>
                            </div>
                          )
                        })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="border-florida-sand-300"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="relative inline-block">
                  <Flower className="w-16 h-16 text-florida-green-300 mx-auto mb-4 opacity-50" />
                  <div className="absolute -top-2 -right-2">
                    <Leaf className="w-8 h-8 text-florida-green-400 opacity-30 rotate-45" />
                  </div>
                </div>
                <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-2">
                  No prints found
                </h3>
                <p className="text-florida-green-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearAllFilters} variant="florida">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-florida-green-800 text-florida-green-50 py-12 mt-16">
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
                <div><a href="/prints" className="text-florida-green-200 hover:text-white">All Prints</a></div>
                <div><a href="/collections" className="text-florida-green-200 hover:text-white">Collections</a></div>
                <div><a href="/new" className="text-florida-green-200 hover:text-white">New Arrivals</a></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Collections</h4>
              <div className="space-y-2 text-sm">
                <div><a href="/collections/tropical-blooms" className="text-florida-green-200 hover:text-white">Tropical Blooms</a></div>
                <div><a href="/collections/surf-breaks" className="text-florida-green-200 hover:text-white">Surf Breaks</a></div>
                <div><a href="/collections/art-deco-florida" className="text-florida-green-200 hover:text-white">Art Deco</a></div>
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