'use client'

import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Flower, Waves, Palette, Camera, Leaf, Package, Star, Frame, Home, Shirt, Filter, Grid, Search } from 'lucide-react'
import { useCollections, type Collection } from '@/hooks/use-collections'
import { useState, useMemo } from 'react'

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
  flamingo: 'bg-gradient-to-br from-pink-500 to-red-400',
  blue: 'bg-gradient-to-br from-blue-500 to-indigo-400',
  sunset: 'bg-gradient-to-br from-orange-500 to-pink-400',
  sand: 'bg-gradient-to-br from-yellow-500 to-orange-400',
  green: 'bg-gradient-to-br from-green-500 to-emerald-400',
  gold: 'bg-gradient-to-br from-yellow-500 to-amber-400',
  purple: 'bg-gradient-to-br from-purple-500 to-indigo-400',
  pink: 'bg-gradient-to-br from-pink-500 to-purple-400'
};

export default function CollectionsPage() {
  const { collections, loading, error, getFeaturedCollections } = useCollections();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'featured' | 'gooten' | 'local'>('all');

  const filteredCollections = useMemo(() => {
    let filtered = collections;

    // Apply filter
    if (selectedFilter === 'featured') {
      filtered = filtered.filter(c => c.featured);
    } else if (selectedFilter === 'gooten') {
      filtered = filtered.filter(c => c.vendor === 'gooten');
    } else if (selectedFilter === 'local') {
      filtered = filtered.filter(c => c.vendor === 'local');
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [collections, searchTerm, selectedFilter]);

  const featuredCollections = getFeaturedCollections();

  if (loading) {
    return (
      <div className="min-h-screen bg-florida-sand-50/30">
        <Navigation />
        <div className="flex items-center justify-center min-h-64 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-florida-green-600 mx-auto mb-4"></div>
            <p className="text-florida-green-600 font-medium">Loading beautiful Florida collections...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Collections</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-florida-sand-50">
      <Navigation />
      
      {/* Compact Hero Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-florida-sand-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-2">
                Our Collections
              </h1>
              <p className="text-lg text-florida-green-600 max-w-2xl">
                Discover curated collections that capture the essence of Florida's beauty, 
                from tropical blooms to legendary surf breaks.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-florida-green-100 rounded-full mb-2">
                  <Package className="h-6 w-6 text-florida-green-600" />
                </div>
                <div className="font-semibold text-florida-green-800">{collections.length}</div>
                <div className="text-sm text-florida-green-600">Collections</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-florida-sunset-100 rounded-full mb-2">
                  <Star className="h-6 w-6 text-florida-sunset-600" />
                </div>
                <div className="font-semibold text-florida-green-800">{featuredCollections.length}</div>
                <div className="text-sm text-florida-green-600">Featured</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-florida-blue-100 rounded-full mb-2">
                  <Palette className="h-6 w-6 text-florida-blue-600" />
                </div>
                <div className="font-semibold text-florida-green-800">
                  {collections.reduce((total, col) => total + col.productCount, 0)}
                </div>
                <div className="text-sm text-florida-green-600">Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {featuredCollections.length > 0 && selectedFilter === 'all' && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-florida-display text-2xl lg:text-3xl font-bold text-florida-green-800 mb-2">
                  Featured Collections
                </h2>
                <p className="font-florida-body text-florida-green-600">
                  Our most popular and carefully curated collections
                </p>
              </div>
              <Badge variant="secondary" className="bg-florida-sunset-100 text-florida-sunset-700">
                {featuredCollections.length} Featured
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {featuredCollections.slice(0, 2).map((collection) => (
                <FeaturedCollectionCard key={collection.id} collection={collection} />
              ))}
            </div>

            {featuredCollections.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCollections.slice(2).map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Collections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-florida-display text-2xl lg:text-3xl font-bold text-florida-green-800">
              {selectedFilter === 'all' ? 'All Collections' : 
               selectedFilter === 'featured' ? 'Featured Collections' :
               selectedFilter === 'local' ? 'Curated Collections' : 'Print-on-Demand Collections'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Grid className="h-4 w-4" />
              <span>{filteredCollections.length} collections</span>
            </div>
          </div>

          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No collections found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
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

function FeaturedCollectionCard({ collection }: { collection: Collection }) {
  const IconComponent = iconMap[collection.icon as keyof typeof iconMap] || Package;
  const colorClass = colorMap[collection.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="group relative overflow-hidden h-80 cursor-pointer hover:shadow-xl transition-all duration-300 border-florida-sand-200">
        <div className="absolute inset-0">
          <img
            src={collection.image}
            alt={collection.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg ${colorClass} backdrop-blur-sm`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            {collection.featured && (
              <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-florida-display text-2xl font-bold mb-1">
                {collection.title}
              </h3>
              <p className="font-florida-body text-lg opacity-90">
                {collection.subtitle}
              </p>
            </div>
            <p className="font-florida-body text-sm opacity-80 line-clamp-2">
              {collection.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {collection.productCount} items
              </span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  const IconComponent = iconMap[collection.icon as keyof typeof iconMap] || Package;
  const colorClass = colorMap[collection.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="group relative overflow-hidden h-64 cursor-pointer hover:shadow-lg transition-all duration-300 border-florida-sand-200">
        <div className="absolute inset-0">
          <img
            src={collection.image}
            alt={collection.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg ${colorClass} backdrop-blur-sm`}>
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            {collection.featured && (
              <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400 text-xs">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div>
              <h3 className="font-florida-display text-lg font-bold mb-1">
                {collection.title}
              </h3>
              <p className="font-florida-body text-sm opacity-90">
                {collection.subtitle}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                {collection.productCount} items
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 