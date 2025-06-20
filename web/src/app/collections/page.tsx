'use client'

import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Flower, Waves, Palette, Camera, Leaf } from 'lucide-react'

// Mock data for collections
const collections = [
  {
    id: 'tropical-blooms',
    title: 'Tropical Blooms',
    subtitle: 'Hibiscus & Florida Flora',
    description: 'Celebrate Florida\'s vibrant botanical heritage with our hibiscus-inspired collection featuring vintage watercolor florals.',
    image: 'https://images.unsplash.com/photo-1594736797933-d0b22ba58871?w=600&h=800&fit=crop',
    productCount: 12,
    icon: Flower,
    color: 'flamingo',
    featured: true,
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
      }
    ]
  },
  {
    id: 'surf-breaks',
    title: 'Classic Surf Breaks',
    subtitle: 'Legendary Florida Waves',
    description: 'Iconic surf spots from Sebastian Inlet to Cocoa Beach, rendered in classic vintage poster style.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=800&fit=crop',
    productCount: 15,
    icon: Waves,
    color: 'blue',
    featured: true,
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
      }
    ]
  },
  {
    id: 'art-deco-florida',
    title: 'Art Deco Florida',
    subtitle: 'Miami Beach Glamour',
    description: 'Geometric elegance meets Florida charm in this sophisticated collection inspired by South Beach architecture.',
    image: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600&h=800&fit=crop',
    productCount: 8,
    icon: Palette,
    color: 'sunset',
    featured: false,
    products: [
      {
        id: 'deco-skyline',
        title: 'Miami Deco Skyline',
        style: 'Art Deco',
        price: 52,
        image: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=400&h=500&fit=crop'
      }
    ]
  },
  {
    id: 'vintage-postcards',
    title: 'Vintage Postcards',
    subtitle: 'Greetings from Florida',
    description: 'Nostalgic postcards capturing the golden age of Florida tourism with authentic vintage charm.',
    image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c89a?w=600&h=800&fit=crop',
    productCount: 10,
    icon: Camera,
    color: 'sand',
    featured: false,
    products: [
      {
        id: 'vintage-postcard',
        title: 'Greetings from Paradise',
        style: 'Vintage Postcard',
        price: 38,
        image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c89a?w=400&h=500&fit=crop'
      }
    ]
  },
  {
    id: 'mangrove-mysteries',
    title: 'Mangrove Mysteries',
    subtitle: 'Everglades & Coastal Wetlands',
    description: 'Explore Florida\'s mysterious wetlands through atmospheric artwork celebrating our unique ecosystem.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=800&fit=crop',
    productCount: 6,
    icon: Leaf,
    color: 'green',
    featured: false,
    products: [
      {
        id: 'mangrove-twilight',
        title: 'Mangrove Twilight',
        style: 'Atmospheric Watercolor',
        price: 46,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=500&fit=crop'
      }
    ]
  }
]

const featuredCollections = collections.filter(c => c.featured)
const allCollections = collections

export default function CollectionsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Botanical background pattern */}
        <div className="absolute inset-0 florida-gradient opacity-60" />
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
          <div className="space-y-6">
            <h1 className="font-florida-script text-6xl sm:text-7xl lg:text-8xl text-florida-green-800 drop-shadow-sm">
              Collections
            </h1>
            <h2 className="font-florida-display text-2xl sm:text-3xl lg:text-4xl text-florida-green-700 font-semibold">
              Curated Florida Experiences
            </h2>
            <p className="font-florida-body text-lg sm:text-xl text-florida-green-600 max-w-3xl mx-auto leading-relaxed">
              Discover our thoughtfully curated collections celebrating Florida&apos;s natural beauty, 
              from vibrant hibiscus blooms to legendary surf breaks, each telling a unique story 
              of the Sunshine State&apos;s timeless charm.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Featured Collections
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Our most beloved collections, featuring the essence of Old Florida&apos;s 
              botanical beauty and coastal heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {featuredCollections.map((collection) => {
              const IconComponent = collection.icon
              const colorClasses = {
                flamingo: 'bg-florida-flamingo-50 border-florida-flamingo-200 text-florida-flamingo-800',
                blue: 'bg-florida-blue-50 border-florida-blue-200 text-florida-blue-800',
                sunset: 'bg-florida-sunset-50 border-florida-sunset-200 text-florida-sunset-800',
                green: 'bg-florida-green-50 border-florida-green-200 text-florida-green-800',
                sand: 'bg-florida-sand-50 border-florida-sand-200 text-florida-sand-800'
              }

              return (
                <Card key={collection.id} className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 bg-gradient-to-br from-white to-florida-sand-50/30">
                  <div className="relative">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                    
                    {/* Collection info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-full ${colorClasses[collection.color as keyof typeof colorClasses]} bg-white/90 mr-3`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {collection.productCount} pieces
                        </Badge>
                      </div>
                      <h3 className="font-florida-script text-3xl mb-2">
                        {collection.title}
                      </h3>
                      <p className="font-florida-display text-lg text-white/90 mb-1">
                        {collection.subtitle}
                      </p>
                      <p className="text-white/80 text-sm mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Sample products */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {collection.products.slice(0, 3).map((product) => (
                        <div key={product.id} className="group/product">
                          <div className="aspect-[3/4] rounded-lg overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover/product:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="mt-2">
                            <h4 className="text-xs font-medium text-florida-green-800 line-clamp-1">
                              {product.title}
                            </h4>
                            <p className="text-xs text-florida-green-600">${product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button asChild variant="florida" className="w-full">
                      <Link href={`/collections/${collection.id}`} className="flex items-center justify-center space-x-2">
                        <span>Explore Collection</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* All Collections Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-florida-sand-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              All Collections
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Browse our complete collection of Florida-inspired artwork, 
              each series celebrating a different aspect of our coastal paradise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCollections.map((collection) => {
              const IconComponent = collection.icon
              const colorClasses = {
                flamingo: 'bg-florida-flamingo-500 text-white',
                blue: 'bg-florida-blue-500 text-white',
                sunset: 'bg-florida-sunset-500 text-white',
                green: 'bg-florida-green-500 text-white',
                sand: 'bg-florida-sand-500 text-white'
              }

              return (
                <Card key={collection.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 bg-white">
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    
                    <div className="absolute top-4 left-4">
                      <div className={`p-2 rounded-full ${colorClasses[collection.color as keyof typeof colorClasses]}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-florida-display text-xl font-semibold mb-1">
                        {collection.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {collection.subtitle}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-florida-green-600 text-sm mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-florida-green-300 text-florida-green-700">
                        {collection.productCount} prints
                      </Badge>
                      <Button asChild variant="outline" size="sm" className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50">
                        <Link href={`/collections/${collection.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            {/* Decorative hibiscus elements */}
            <div className="absolute -top-8 left-1/4 opacity-20">
              <Flower className="w-16 h-16 text-florida-flamingo-400 rotate-12" />
            </div>
            <div className="absolute -bottom-8 right-1/4 opacity-20">
              <Flower className="w-12 h-12 text-florida-flamingo-400 -rotate-12" />
            </div>
            
            <Card className="bg-gradient-to-br from-florida-sand-50 to-florida-green-50/30 border-florida-sand-200">
              <CardContent className="p-12">
                <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-6">
                  Create Your Gallery
                </h2>
                <p className="font-florida-body text-lg text-florida-green-600 mb-8 max-w-2xl mx-auto">
                  Mix and match pieces from different collections to create your perfect 
                  Florida-inspired gallery wall. Each print tells a story of our beautiful state.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild variant="florida" size="lg" className="text-lg px-8">
                    <Link href="/prints" className="flex items-center space-x-2">
                      <span>Shop All Prints</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50 text-lg px-8">
                    <Link href="/gallery-guide">
                      Gallery Guide
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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