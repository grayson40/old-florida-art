'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Grid3X3,
  Package,
  Clock,
  TrendingUp,
  X,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { useSearch } from '@/hooks/use-search'
import Link from 'next/link'

const ITEMS_PER_PAGE = 12

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState<'all' | 'products' | 'collections'>('all')
  
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    recentSearches,
    search,
    hasResults,
    hasProductResults,
    hasCollectionResults,
    getProductResults,
    getCollectionResults
  } = useSearch()

  // Set initial query from URL
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery)
    }
  }, [initialQuery, query, setQuery])

  // Update URL when search query changes
  useEffect(() => {
    if (query) {
      const newParams = new URLSearchParams()
      newParams.set('q', query)
      if (filterType !== 'all') {
        newParams.set('type', filterType)
      }
      router.replace(`/search?${newParams.toString()}`, { scroll: false })
    }
  }, [query, filterType, router])

  // Filter results based on type
  const filteredResults = useMemo(() => {
    switch (filterType) {
      case 'products':
        return getProductResults()
      case 'collections':
        return getCollectionResults()
      default:
        return results
    }
  }, [results, filterType, getProductResults, getCollectionResults])

  // Paginate results
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    setCurrentPage(1)
  }

  const handleFilterChange = (type: 'all' | 'products' | 'collections') => {
    setFilterType(type)
    setCurrentPage(1)
  }

  const handleRecentSearchClick = (searchTerm: string) => {
    handleSearch(searchTerm)
  }

  return (
    <div className="min-h-screen bg-florida-sand-50/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-florida-green-50 to-florida-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Search
            </h1>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Discover authentic Florida art, from vintage surf posters to tropical botanical prints
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-florida-green-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for art, collections, styles..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white border-florida-sand-300 focus:border-florida-green-400 focus:ring-florida-green-400 rounded-xl shadow-sm"
              />
              {query && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-florida-green-500 hover:text-florida-green-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant={filterType === 'all' ? 'florida' : 'outline'}
              onClick={() => handleFilterChange('all')}
              className="rounded-full"
            >
              All Results
            </Button>
            <Button
              variant={filterType === 'products' ? 'florida' : 'outline'}
              onClick={() => handleFilterChange('products')}
              className="rounded-full"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
            <Button
              variant={filterType === 'collections' ? 'florida' : 'outline'}
              onClick={() => handleFilterChange('collections')}
              className="rounded-full"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Collections
            </Button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-florida-green-600" />
              <p className="text-florida-green-600">Searching...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* No Query State */}
          {!loading && !query && (
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <Search className="h-16 w-16 text-florida-green-400 mx-auto mb-6" />
                <h2 className="font-florida-display text-2xl text-florida-green-800 mb-4">
                  Start Your Search
                </h2>
                <p className="text-florida-green-600 mb-8">
                  Enter keywords to find the perfect Florida art for your space. Search by style, 
                  collection, color, or theme.
                </p>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="text-left max-w-md mx-auto">
                    <h3 className="font-florida-display text-lg text-florida-green-800 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Recent Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((searchTerm, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(searchTerm)}
                          className="px-3 py-1 bg-florida-green-100 text-florida-green-700 rounded-full text-sm hover:bg-florida-green-200 transition-colors"
                        >
                          {searchTerm}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="text-left max-w-md mx-auto mt-8">
                  <h3 className="font-florida-display text-lg text-florida-green-800 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['vintage florida', 'surf art', 'tropical', 'flamingo', 'palm trees', 'art deco'].map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1 bg-florida-blue-100 text-florida-blue-700 rounded-full text-sm hover:bg-florida-blue-200 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Header */}
          {!loading && query && hasResults && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-florida-display text-2xl text-florida-green-800 mb-2">
                    Search Results
                  </h2>
                  <p className="text-florida-green-600">
                    Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{query}"
                  </p>
                </div>
                
                {/* Results Summary */}
                <div className="flex items-center space-x-4 text-sm text-florida-green-600">
                  {hasProductResults && (
                    <span className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {getProductResults().length} product{getProductResults().length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {hasCollectionResults && (
                    <span className="flex items-center">
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      {getCollectionResults().length} collection{getCollectionResults().length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && query && !hasResults && (
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <Package className="h-16 w-16 text-florida-green-400 mx-auto mb-6" />
                <h2 className="font-florida-display text-2xl text-florida-green-800 mb-4">
                  No Results Found
                </h2>
                <p className="text-florida-green-600 mb-8">
                  We couldn't find anything matching "{query}". Try different keywords or browse our collections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => handleSearch('')} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                  <Button asChild variant="florida">
                    <Link href="/collections">
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Browse Collections
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!loading && hasResults && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                 {paginatedResults.map((result) => {
                   if (result.type === 'product') {
                     return (
                       <ProductCard
                         key={result.id}
                         id={result.id}
                         title={result.title}
                         style={result.style || 'Print'}
                         price={result.price || 25}
                         originalPrice={undefined}
                         image={result.image}
                         isNew={false}
                         isFeatured={false}
                       />
                     )
                   } else if (result.type === 'collection') {
                     return (
                       <Card key={result.id} className="group hover:shadow-lg transition-shadow duration-300">
                         <div className="aspect-[4/3] overflow-hidden bg-florida-sand-100 rounded-t-lg">
                           <img
                             src={result.image}
                             alt={result.title}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                           />
                         </div>
                         <CardContent className="p-4">
                           <h3 className="font-florida-display text-lg font-semibold text-florida-green-800 mb-2">
                             {result.title}
                           </h3>
                           <p className="text-florida-green-600 text-sm mb-4 line-clamp-2">
                             {result.description}
                           </p>
                           <Button asChild variant="outline" size="sm" className="w-full">
                             <Link href={result.url} className="flex items-center justify-center">
                               View Collection
                               <ArrowRight className="h-4 w-4 ml-2" />
                             </Link>
                           </Button>
                         </CardContent>
                       </Card>
                     )
                   }
                   return null
                 })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      Previous
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
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function SearchPageLoading() {
  return (
    <div className="min-h-screen bg-florida-sand-50/30">
      <Navigation />
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-florida-green-50 to-florida-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Search
            </h1>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Discover authentic Florida art, from vintage surf posters to tropical botanical prints
            </p>
          </div>
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-florida-green-600" />
            <p className="text-florida-green-600">Loading search...</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  )
} 