'use client'

import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Heart, Users, Palette, Award, Flower, Leaf, Camera, MapPin, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Botanical background pattern */}
        <div className="absolute inset-0 florida-gradient opacity-70" />
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
            <h1 className="font-florida-script text-5xl sm:text-6xl lg:text-7xl text-florida-green-800 mb-6">
              Our Story
            </h1>
            <p className="font-florida-body text-lg sm:text-xl text-florida-green-600 max-w-3xl mx-auto leading-relaxed">
              Born from a deep love for Florida&apos;s natural beauty and rich heritage, 
              Old Florida Art Co. creates vintage-inspired artwork that captures the soul 
              of the Sunshine State&apos;s most cherished landscapes and traditions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-6">
                  Our Mission
                </h2>
                <p className="font-florida-body text-lg text-florida-green-700 leading-relaxed mb-6">
                  We believe that Florida&apos;s natural beauty and cultural heritage deserve to be preserved 
                  and celebrated through art. Our mission is to create timeless pieces that honor the 
                  Old Florida spirit while bringing that magic into modern homes.
                </p>
                <p className="font-florida-body text-lg text-florida-green-700 leading-relaxed">
                  Each piece in our collection tells a story - from the hibiscus blooms that grace 
                  our gardens to the legendary surf breaks that have shaped our coastal culture. 
                  We&apos;re not just creating art; we&apos;re preserving memories and celebrating 
                  the timeless charm of Florida living.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-florida-sand-50/50 border-florida-sand-200">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-8 w-8 text-florida-flamingo-500 mx-auto mb-3" />
                    <h3 className="font-florida-display font-semibold text-florida-green-800 mb-2">
                      Made with Love
                    </h3>
                    <p className="text-sm text-florida-green-600">
                      Every piece crafted with passion for Florida&apos;s beauty
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-florida-blue-50/50 border-florida-blue-200">
                  <CardContent className="p-6 text-center">
                    <Palette className="h-8 w-8 text-florida-blue-500 mx-auto mb-3" />
                    <h3 className="font-florida-display font-semibold text-florida-green-800 mb-2">
                      Authentic Style
                    </h3>
                    <p className="text-sm text-florida-green-600">
                      Vintage-inspired designs rooted in Florida tradition
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/hibiscus-painting.jpg"
                  alt="Florida hibiscus garden"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-florida-flamingo-300 rounded-lg -z-10 opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-florida-sand-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-8">
            The Florida Heritage
          </h2>
          
          <div className="space-y-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-florida-green-500 text-white rounded-full flex items-center justify-center">
                      <Flower className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-3">
                      Botanical Paradise
                    </h3>
                    <p className="font-florida-body text-florida-green-700 leading-relaxed">
                      Florida&apos;s tropical climate has blessed us with an incredible diversity of flora. 
                      The hibiscus, our unofficial state flower, blooms year-round in vibrant colors 
                      that have inspired artists for generations. Our botanical collection celebrates 
                      these natural treasures that make Florida truly unique.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-florida-blue-500 text-white rounded-full flex items-center justify-center">
                      <Camera className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-3">
                      Vintage Tourism Era
                    </h3>
                    <p className="font-florida-body text-florida-green-700 leading-relaxed">
                      The golden age of Florida tourism in the mid-20th century brought a distinctive 
                      aesthetic that we lovingly recreate. From Art Deco hotels in Miami Beach to 
                      classic surf culture posters, this era defined Florida&apos;s visual identity 
                      and continues to inspire our vintage-style artwork today.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-florida-sunset-500 text-white rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-3">
                      Coastal Culture
                    </h3>
                    <p className="font-florida-body text-florida-green-700 leading-relaxed">
                      From the legendary surf breaks of the Space Coast to the pristine beaches 
                      of the Gulf, Florida&apos;s coastline has shaped our culture and lifestyle. 
                      Our surf break collection honors these special places where generations 
                      have found peace, adventure, and connection with nature.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-4">
              Our Craftsmanship
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto">
              Every print is created with meticulous attention to detail and a commitment 
              to preserving the authentic spirit of Old Florida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-florida-green-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-florida-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="h-8 w-8" />
                </div>
                <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-4">
                  Authentic Design
                </h3>
                <p className="font-florida-body text-florida-green-600 leading-relaxed">
                  Our artists research historical references and visit Florida locations 
                  to ensure every design captures the authentic spirit of the era and place.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-florida-blue-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-florida-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-4">
                  Museum Quality
                </h3>
                <p className="font-florida-body text-florida-green-600 leading-relaxed">
                  We use archival-quality papers and fade-resistant inks to ensure 
                  your prints maintain their vibrant colors for generations to come.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-florida-sunset-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-florida-sunset-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="font-florida-display text-xl font-semibold text-florida-green-800 mb-4">
                  Local Love
                </h3>
                <p className="font-florida-body text-florida-green-600 leading-relaxed">
                  As Florida natives, we pour our genuine love for this state into 
                  every piece, sharing the magic that makes Florida home.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-florida-sand-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            {/* Decorative hibiscus elements */}
            <div className="absolute -top-8 left-1/3 opacity-15">
              <Flower className="w-12 h-12 text-florida-flamingo-400 rotate-12" />
            </div>
            <div className="absolute -bottom-8 right-1/3 opacity-15">
              <Leaf className="w-10 h-10 text-florida-green-400 -rotate-12" />
            </div>
            
            <Card className="bg-gradient-to-br from-white to-florida-green-50/30 border-florida-sand-200">
              <CardContent className="p-12">
                <Users className="h-12 w-12 text-florida-green-500 mx-auto mb-6" />
                <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800 mb-6">
                  Meet the Artists
                </h2>
                <p className="font-florida-body text-lg text-florida-green-700 mb-8 leading-relaxed">
                  Our small team of Florida-based artists and designers share a common passion: 
                  celebrating the natural beauty and rich heritage of our beloved state. 
                  We&apos;re surfers, gardeners, historians, and dreamers who believe that 
                  art has the power to preserve memories and inspire wonder.
                </p>
                <p className="font-florida-body text-lg text-florida-green-700 mb-8 leading-relaxed">
                  From our studio overlooking the Indian River to weekend excursions exploring 
                  Florida&apos;s hidden gems, we live and breathe the Old Florida lifestyle 
                  that inspires our work. Each piece we create is a love letter to this 
                  incredible place we call home.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Badge variant="outline" className="border-florida-green-300 text-florida-green-700 px-4 py-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    Florida-Based Artists
                  </Badge>
                  <Badge variant="outline" className="border-florida-green-300 text-florida-green-700 px-4 py-2">
                    <Heart className="h-4 w-4 mr-2" />
                    Locally Inspired
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="font-florida-script text-4xl sm:text-5xl text-florida-green-800">
              Bring Florida Home
            </h2>
            <p className="font-florida-body text-lg text-florida-green-600 max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re a lifelong Floridian or someone who dreams of our sunny shores, 
              our collection helps you celebrate the beauty and spirit of the Sunshine State.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="florida" size="lg" className="text-lg px-8">
                <Link href="/collections" className="flex items-center space-x-2">
                  <span>Explore Collections</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50 text-lg px-8">
                <Link href="/prints">
                  Shop All Prints
                </Link>
              </Button>
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