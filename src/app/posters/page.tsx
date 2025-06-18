'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

// Mock products data - focused on art styles
const allProducts = [
  {
    id: '1',
    title: 'Sebastian Inlet Classic',
    style: 'Vintage Watercolor',
    price: 45,
    originalPrice: 60,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop',
    isNew: true,
    isFeatured: true
  },
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
  },
  {
    id: '4',
    title: 'Daytona Beach Retro',
    style: 'Geometric Modern',
    price: 52,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop',
    isNew: true
  },
  {
    id: '5',
    title: 'Melbourne Beach Classic',
    style: 'Photographic',
    price: 35,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=500&fit=crop'
  },
  {
    id: '6',
    title: 'Indialantic Dreams',
    style: 'Watercolor Abstract',
    price: 48,
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=500&fit=crop'
  }
]

const artStyles = ['All Styles', 'Vintage Watercolor', 'Art Deco', 'Minimalist Line Art', 'Geometric Modern', 'Photographic', 'Watercolor Abstract']
const priceRanges = ['All Prices', 'Under $40', '$40-$50', 'Over $50']
const features = ['New Arrivals', 'Featured', 'Best Sellers']

export default function PostersPage() {
  const [selectedStyle, setSelectedStyle] = useState('All Styles')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('Featured')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = allProducts.filter(product => {
    // Style filter
    if (selectedStyle !== 'All Styles' && product.style !== selectedStyle) {
      return false
    }
    
    // Price filter
    if (selectedPriceRange !== 'All Prices') {
      if (selectedPriceRange === 'Under $40' && product.price >= 40) return false
      if (selectedPriceRange === '$40-$50' && (product.price < 40 || product.price > 50)) return false
      if (selectedPriceRange === 'Over $50' && product.price <= 50) return false
    }
    
    // Features filter
    if (selectedFeatures.length > 0) {
      if (selectedFeatures.includes('New Arrivals') && !product.isNew) return false
      if (selectedFeatures.includes('Featured') && !product.isFeatured) return false
    }
    
    return true
  })

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <div className="bg-florida-sand-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-florida-script text-5xl sm:text-6xl text-florida-green-800 mb-4">
              Art Prints
            </h1>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Discover our complete collection of vintage-inspired Florida art. 
              Each piece captures the timeless spirit of the Sunshine State.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Mobile filter toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-between border-florida-sand-300"
              >
                <span className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Art Style Filter */}
              <Card className="border-florida-sand-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-florida-green-800">Art Style</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {artStyles.map(style => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                        selectedStyle === style 
                          ? 'bg-florida-green-100 text-florida-green-800 font-medium' 
                          : 'text-florida-green-600 hover:text-florida-green-800'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Price Range Filter */}
              <Card className="border-florida-sand-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-florida-green-800">Price Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                        selectedPriceRange === range 
                          ? 'bg-florida-green-100 text-florida-green-800 font-medium' 
                          : 'text-florida-green-600 hover:text-florida-green-800'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Features Filter */}
              <Card className="border-florida-sand-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-florida-green-800">Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {features.map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="rounded border-florida-sand-300 text-florida-green-600 focus:ring-florida-green-500"
                      />
                      <span className="text-sm text-florida-green-700">{feature}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-florida-sand-200">
              <p className="text-florida-green-600">
                {filteredProducts.length} print{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-florida-green-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-florida-sand-300 rounded-md px-3 py-1 text-sm text-florida-green-700 focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedStyle !== 'All Styles' || selectedPriceRange !== 'All Prices' || selectedFeatures.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedStyle !== 'All Styles' && (
                  <Badge variant="secondary" className="bg-florida-green-100 text-florida-green-800">
                    {selectedStyle}
                    <button 
                      onClick={() => setSelectedStyle('All Styles')}
                      className="ml-2 hover:text-florida-green-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedPriceRange !== 'All Prices' && (
                  <Badge variant="secondary" className="bg-florida-green-100 text-florida-green-800">
                    {selectedPriceRange}
                    <button 
                      onClick={() => setSelectedPriceRange('All Prices')}
                      className="ml-2 hover:text-florida-green-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedFeatures.map(feature => (
                  <Badge key={feature} variant="secondary" className="bg-florida-green-100 text-florida-green-800">
                    {feature}
                    <button 
                      onClick={() => toggleFeature(feature)}
                      className="ml-2 hover:text-florida-green-900"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-florida-green-600 text-lg mb-4">No prints match your current filters.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedStyle('All Styles')
                    setSelectedPriceRange('All Prices')
                    setSelectedFeatures([])
                  }}
                  className="border-florida-green-300 text-florida-green-700"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 