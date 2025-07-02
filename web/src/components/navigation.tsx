'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ShoppingCart, 
  Palmtree, 
  Search, 
  X, 
  Clock,
  Package,
  Grid3X3,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useSearch } from '@/hooks/use-search'

export function Navigation() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  
  const {
    query,
    setQuery,
    results,
    loading,
    recentSearches,
    hasResults,
    hasProductResults,
    hasCollectionResults,
    getProductResults,
    getCollectionResults,
    clearSearch,
    clearRecentSearches
  } = useSearch()

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  // Handle search input focus
  const handleSearchFocus = () => {
    setShowSearchResults(true)
  }

  // Handle search result selection
  const handleResultClick = (url: string) => {
    setShowSearchResults(false)
    setQuery('')
    router.push(url)
  }

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm)
    setShowSearchResults(true)
  }

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle Enter key for search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowSearchResults(false)
      router.push(`/prints?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <>
      <nav className="bg-florida-sand-100/95 backdrop-blur-sm border-b border-florida-sand-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <Palmtree className="h-8 w-8 text-florida-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-florida-script text-2xl text-florida-green-800">
                  Old Florida
                </span>
                <span className="font-florida-body text-xs text-florida-green-600 -mt-1">
                  Art Co.
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8" ref={searchContainerRef}>
              <div className="relative w-full">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-florida-green-500 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search products and collections..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      className="pl-10 pr-10 bg-florida-sand-50 border-florida-sand-300 focus:border-florida-green-400 focus:ring-florida-green-400"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-florida-green-500 hover:text-florida-green-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <Card className="absolute top-full left-0 right-0 mt-2 border-florida-sand-300 shadow-lg z-50 max-h-96 overflow-hidden">
                    <CardContent className="p-0">
                      {loading ? (
                        <div className="p-4 text-center">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-florida-green-600">Searching...</p>
                        </div>
                      ) : hasResults ? (
                        <div className="max-h-80 overflow-y-auto">
                          {/* Collections */}
                          {hasCollectionResults && (
                            <div className="p-3 border-b border-florida-sand-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <Grid3X3 className="h-4 w-4 text-florida-green-600" />
                                <span className="text-sm font-medium text-florida-green-800">Collections</span>
                              </div>
                              <div className="space-y-2">
                                {getCollectionResults().slice(0, 3).map((result) => (
                                  <button
                                    key={result.id}
                                    onClick={() => handleResultClick(result.url)}
                                    className="w-full text-left p-2 rounded-md hover:bg-florida-sand-100 transition-colors"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <img 
                                        src={result.image} 
                                        alt={result.title}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-florida-green-800 truncate">
                                          {result.title}
                                        </p>
                                        <p className="text-xs text-florida-green-600 truncate">
                                          {result.subtitle}
                                        </p>
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        {result.vendor}
                                      </Badge>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Products */}
                          {hasProductResults && (
                            <div className="p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Package className="h-4 w-4 text-florida-green-600" />
                                <span className="text-sm font-medium text-florida-green-800">Products</span>
                              </div>
                              <div className="space-y-2">
                                {getProductResults().slice(0, 6).map((result) => (
                                  <button
                                    key={result.id}
                                    onClick={() => handleResultClick(result.url)}
                                    className="w-full text-left p-2 rounded-md hover:bg-florida-sand-100 transition-colors"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <img 
                                        src={result.image} 
                                        alt={result.title}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-florida-green-800 truncate">
                                          {result.title}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                          {result.price && (
                                            <span className="text-xs text-florida-green-600">
                                              ${result.price}
                                            </span>
                                          )}
                                          {result.style && (
                                            <span className="text-xs text-florida-green-500">
                                              {result.style}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        {result.vendor}
                                      </Badge>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* View All Results */}
                          {hasResults && (
                            <div className="p-3 border-t border-florida-sand-200">
                              <Button 
                                variant="ghost" 
                                className="w-full text-florida-green-700 hover:bg-florida-green-50"
                                onClick={() => handleResultClick(`/prints?search=${encodeURIComponent(query)}`)}
                              >
                                View all results for "{query}"
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : query.length >= 2 ? (
                        <div className="p-4 text-center">
                          <p className="text-sm text-florida-green-600">
                            No results found for "{query}"
                          </p>
                        </div>
                      ) : (
                        <div className="p-3">
                          {/* Recent Searches */}
                          {recentSearches.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-florida-green-600" />
                                  <span className="text-sm font-medium text-florida-green-800">Recent</span>
                                </div>
                                <button
                                  onClick={clearRecentSearches}
                                  className="text-xs text-florida-green-600 hover:text-florida-green-800"
                                >
                                  Clear
                                </button>
                              </div>
                              <div className="space-y-1">
                                {recentSearches.map((search, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleRecentSearchClick(search)}
                                    className="w-full text-left px-2 py-1 text-sm text-florida-green-700 hover:bg-florida-sand-100 rounded transition-colors"
                                  >
                                    {search}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Links */}
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <TrendingUp className="h-4 w-4 text-florida-green-600" />
                              <span className="text-sm font-medium text-florida-green-800">Popular</span>
                            </div>
                            <div className="space-y-1">
                              {['surf art', 'tropical prints', 'vintage florida', 'hibiscus'].map((term) => (
                                <button
                                  key={term}
                                  onClick={() => handleRecentSearchClick(term)}
                                  className="w-full text-left px-2 py-1 text-sm text-florida-green-700 hover:bg-florida-sand-100 rounded transition-colors capitalize"
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
              <Link 
                href="/prints" 
                className="text-florida-green-700 hover:text-florida-green-900 font-medium transition-colors"
              >
                Shop
              </Link>
              <Link 
                href="/collections" 
                className="text-florida-green-700 hover:text-florida-green-900 font-medium transition-colors"
              >
                Collections
              </Link>
              <Link 
                href="/about" 
                className="text-florida-green-700 hover:text-florida-green-900 font-medium transition-colors"
              >
                About
              </Link>
            </div>

            {/* Cart & Actions */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Mobile Search Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden text-florida-green-700 hover:text-florida-green-900"
                onClick={() => router.push('/prints')}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleCart}
                className="relative text-florida-green-700 hover:text-florida-green-900"
              >
                <ShoppingCart className="h-5 w-5" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-florida-sunset-500 text-florida-sunset-50 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden text-florida-green-700 hover:text-florida-green-900"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-florida-sand-300 py-4">
              <div className="space-y-4">
                {/* Mobile Search */}
                <div className="px-2">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-florida-green-500 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 bg-florida-sand-50 border-florida-sand-300"
                      />
                    </div>
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-2 px-2">
                  <Link 
                    href="/prints" 
                    className="block px-3 py-2 text-florida-green-700 hover:text-florida-green-900 hover:bg-florida-sand-100 rounded-md font-medium transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Shop All Prints
                  </Link>
                  <Link 
                    href="/collections" 
                    className="block px-3 py-2 text-florida-green-700 hover:text-florida-green-900 hover:bg-florida-sand-100 rounded-md font-medium transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Collections
                  </Link>
                  <Link 
                    href="/about" 
                    className="block px-3 py-2 text-florida-green-700 hover:text-florida-green-900 hover:bg-florida-sand-100 rounded-md font-medium transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    About Us
                  </Link>
                </div>

                {/* Mobile CTA */}
                <div className="px-2 pt-2">
                  <Button variant="florida" className="w-full" asChild>
                    <Link href="/prints" onClick={() => setShowMobileMenu(false)}>
                      Shop Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
} 