'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowRight, 
  Star, 
  Loader2,
  TrendingUp,
  Grid3X3,
  Package,
  Heart,
  Award,
  Zap
} from 'lucide-react'
import { useGootenProducts } from '@/hooks/use-gooten-products'
import { useCollections } from '@/hooks/use-collections'

export default function HomePage() {
  const { products: gootenProducts, loading: productsLoading } = useGootenProducts()
  const { collections, loading: collectionsLoading, getFeaturedCollections } = useCollections()
  
  // Get featured products (first 6 from Gooten)
  const featuredProducts = gootenProducts.slice(0, 6)
  
  // Get featured collections
  const featuredCollections = getFeaturedCollections().slice(0, 3)

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      
      {/* Featured Collections Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-florida-green-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-florida-green-700 border-florida-green-300">
              Curated Collections
            </Badge>
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Discover Our Collections
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Explore carefully curated collections that capture the essence of Florida's diverse beauty and culture.
            </p>
          </div>

          {collectionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-florida-sand-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-florida-sand-200 rounded mb-2"></div>
                    <div className="h-3 bg-florida-sand-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredCollections.map((collection) => (
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-florida-sand-200 hover:border-florida-green-300">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={collection.image} 
                        alt={collection.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-white/90 text-florida-green-800 mb-2">
                          {collection.productCount} products
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        {collection.icon && (
                          <div className="text-florida-green-600">
                            {collection.icon}
                          </div>
                        )}
                        <h3 className="font-florida-display text-xl font-semibold text-florida-green-800">
                          {collection.title}
                        </h3>
                      </div>
                      <p className="text-florida-green-600 text-sm mb-3">
                        {collection.subtitle}
                      </p>
                      <p className="text-florida-green-700 text-sm leading-relaxed">
                        {collection.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50">
              <Link href="/collections" className="flex items-center space-x-2">
                <Grid3X3 className="h-5 w-5" />
                <span>View All Collections</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-florida-sunset-700 border-florida-sunset-300">
              Best Sellers
            </Badge>
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Featured Products
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Discover our most popular vintage-inspired Florida art prints, 
              each capturing the timeless spirit of the Sunshine State.
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-florida-sand-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-florida-sand-200 rounded mb-2"></div>
                    <div className="h-3 bg-florida-sand-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-florida-sand-200 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
               {featuredProducts.map((product) => (
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
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-florida-green-400 mx-auto mb-4" />
              <p className="text-florida-green-600 mb-4">
                Featured products are loading...
              </p>
              <Button asChild variant="outline">
                <Link href="/prints">Browse All Products</Link>
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="florida" size="lg">
              <Link href="/prints" className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Shop All Prints</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-gradient-to-br from-florida-green-50 to-florida-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Why Choose Old Florida Art
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Quality craftsmanship meets authentic Florida heritage in every piece
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-florida-sand-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-florida-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-florida-green-600" />
                </div>
                <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-4">
                  Premium Quality
                </h3>
                <p className="text-florida-green-600 leading-relaxed">
                  Museum-quality prints on premium materials that capture every detail 
                  of Florida's natural beauty with stunning clarity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-florida-sand-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-florida-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-florida-blue-600" />
                </div>
                <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-4">
                  Authentic Heritage
                </h3>
                <p className="text-florida-green-600 leading-relaxed">
                  Each design celebrates Florida's rich cultural heritage and natural 
                  wonders, from vintage surf culture to tropical botanical beauty.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-florida-sand-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-florida-sunset-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-florida-sunset-600" />
                </div>
                <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-4">
                  Fast & Reliable
                </h3>
                <p className="text-florida-green-600 leading-relaxed">
                  Quick production and shipping with our print-on-demand technology. 
                  Your Florida art arrives fresh and ready to display.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-florida-green-800 text-florida-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold font-florida-display mb-2">
                {productsLoading ? '...' : gootenProducts.length + '+'}
              </div>
              <div className="text-florida-green-200 font-medium">
                Unique Products
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold font-florida-display mb-2">
                {collectionsLoading ? '...' : collections.length}
              </div>
              <div className="text-florida-green-200 font-medium">
                Art Collections
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold font-florida-display mb-2">
                1000+
              </div>
              <div className="text-florida-green-200 font-medium">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold font-florida-display mb-2 flex items-center justify-center space-x-1">
                <span>4.9</span>
                <Star className="h-6 w-6 fill-current text-florida-sunset-300" />
              </div>
              <div className="text-florida-green-200 font-medium">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-florida-green-700 border-florida-green-300">
                Our Story
              </Badge>
              <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800">
                Celebrating Florida Heritage
              </h2>
              <div className="space-y-4 text-florida-green-700">
                <p className="text-lg leading-relaxed">
                  Born from a deep love for Florida's natural beauty and coastal culture, 
                  our collection celebrates the timeless charm of the Sunshine State.
                </p>
                <p>
                  Each piece is carefully crafted to capture the nostalgic spirit and 
                  laid-back lifestyle that makes Florida so special to those who call it home.
                </p>
                <p>
                  From vintage surf posters to tropical botanical art, we bring you 
                  authentic Florida style that transforms any space into a piece of paradise.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="florida">
                  <Link href="/about">Learn Our Story</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/collections">Browse Collections</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-gradient-to-br from-florida-sand-50 to-florida-green-50 border-florida-sand-200">
                <CardHeader>
                  <CardTitle className="font-florida-display text-florida-green-800 flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>Florida Art Heritage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-florida-blue-500 rounded-full"></div>
                    <span className="text-florida-green-700">Vintage-inspired designs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-florida-green-500 rounded-full"></div>
                    <span className="text-florida-green-700">Classic coastal aesthetics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-florida-sunset-500 rounded-full"></div>
                    <span className="text-florida-green-700">Museum-quality prints</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-florida-flamingo-500 rounded-full"></div>
                    <span className="text-florida-green-700">Sustainable production</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-florida-blue-400 rounded-full"></div>
                    <span className="text-florida-green-700">Fast, reliable shipping</span>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                <div><Link href="/prints?filter=bestsellers" className="text-florida-green-200 hover:text-white transition-colors">Best Sellers</Link></div>
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