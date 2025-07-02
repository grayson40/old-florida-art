'use client'

import { useState, useEffect, useCallback } from 'react'

interface SearchResult {
  type: 'product' | 'collection'
  id: string
  title: string
  subtitle?: string
  description: string
  image: string
  price?: number
  style?: string
  category?: string
  vendor: 'gooten' | 'local'
  url: string
}

interface SearchResponse {
  success: boolean
  results: SearchResult[]
  meta: {
    total: number
    shown: number
    query: string
    type: string
  }
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch (e) {
          console.warn('Failed to parse recent searches')
        }
      }
    }
  }, [])

  // Save recent searches to localStorage
  const saveToRecentSearches = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setRecentSearches(prev => {
      const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(updated))
      }
      
      return updated
    })
  }, [])

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches')
    }
  }, [])

  // Debounced search function
  const search = useCallback(async (
    searchQuery: string, 
    type: 'all' | 'products' | 'collections' = 'all'
  ) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      setError(null)
      setShowResults(false)
      return
    }

    setLoading(true)
    setError(null)
    setShowResults(true)

    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        type,
        limit: '20'
      })

      const response = await fetch(`/api/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data: SearchResponse = await response.json()
      
      if (data.success) {
        setResults(data.results)
        
        // Save to recent searches if we have results
        if (data.results.length > 0) {
          saveToRecentSearches(searchQuery.trim())
        }
      } else {
        setError('Search failed')
        setResults([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [saveToRecentSearches])

  // Debounced search with delay
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    const timeoutId = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, search])

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    setShowResults(false)
  }, [])

  // Hide results
  const hideResults = useCallback(() => {
    setShowResults(false)
  }, [])

  // Show results
  const showResultsPanel = useCallback(() => {
    if (query.trim() && results.length > 0) {
      setShowResults(true)
    }
  }, [query, results.length])

  // Quick search function for immediate results
  const quickSearch = useCallback(async (searchQuery: string) => {
    return search(searchQuery, 'all')
  }, [search])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    recentSearches,
    search,
    quickSearch,
    clearSearch,
    hideResults,
    showResultsPanel,
    clearRecentSearches,
    // Helper functions
    getProductResults: () => results.filter(r => r.type === 'product'),
    getCollectionResults: () => results.filter(r => r.type === 'collection'),
    hasResults: results.length > 0,
    hasProductResults: results.some(r => r.type === 'product'),
    hasCollectionResults: results.some(r => r.type === 'collection')
  }
} 