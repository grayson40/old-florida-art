import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

// Updated mock data for featured products - focused on art/style
const featuredProducts = [
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
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      
      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Featured Collection
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Discover our most popular vintage-inspired Florida art prints, 
              each capturing the timeless spirit of the Sunshine State.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50">
              <Link href="/prints" className="flex items-center space-x-2">
                <span>View All Prints</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-florida-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold font-florida-display text-florida-green-800 mb-2">
                25+
              </div>
              <div className="text-florida-green-600 font-medium">
                Unique Designs
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-florida-display text-florida-green-800 mb-2">
                8
              </div>
              <div className="text-florida-green-600 font-medium">
                Artistic Styles
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-florida-display text-florida-green-800 mb-2">
                1000+
              </div>
              <div className="text-florida-green-600 font-medium">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-florida-display text-florida-green-800 mb-2">
                4.9
              </div>
              <div className="text-florida-green-600 font-medium flex items-center justify-center space-x-1">
                <Star className="h-4 w-4 fill-current text-florida-sunset-500" />
                <span>Average Rating</span>
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
              <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800">
                The Story Behind
              </h2>
              <div className="space-y-4 text-florida-green-700">
                <p className="text-lg leading-relaxed">
                  Born from a deep love for Florida&apos;s natural beauty and coastal culture, 
                  our collection celebrates the timeless charm of the Sunshine State.
                </p>
                <p>
                  Each piece is carefully crafted to capture the nostalgic spirit and 
                  laid-back lifestyle that makes Florida so special to those who call it home.
                </p>
              </div>
              <Button asChild variant="florida">
                <Link href="/about">Learn Our Story</Link>
              </Button>
            </div>
            
            <div className="relative">
              <Card className="bg-florida-sand-100/50 border-florida-sand-200">
                <CardHeader>
                  <CardTitle className="font-florida-display text-florida-green-800">
                    Florida Art Heritage
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
                    <span className="text-florida-green-700">Timeless Florida charm</span>
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
                Celebrating Florida&apos;s heritage through vintage-inspired art.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Shop</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/prints" className="text-florida-green-200 hover:text-white">All Prints</Link></div>
                <div><Link href="/styles" className="text-florida-green-200 hover:text-white">Art Styles</Link></div>
                <div><Link href="/collections" className="text-florida-green-200 hover:text-white">Collections</Link></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-florida-display font-semibold">Learn</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/about" className="text-florida-green-200 hover:text-white">Our Story</Link></div>
                <div><Link href="/blog" className="text-florida-green-200 hover:text-white">Blog</Link></div>
                <div><Link href="/care" className="text-florida-green-200 hover:text-white">Print Care</Link></div>
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
            © 2024 Old Florida Art Co. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
} 