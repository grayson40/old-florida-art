'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 florida-gradient opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-florida-sand-50/20 to-florida-sand-100/40" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-20 rotate-12">
        <div className="w-32 h-32 border-2 border-florida-green-300 rounded-full" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 -rotate-12">
        <div className="w-24 h-24 border-2 border-florida-sunset-300 rounded-full" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4 mt-12">
            <h1 className="font-florida-script text-6xl sm:text-7xl lg:text-8xl text-florida-green-800 drop-shadow-sm">
              Old Florida
            </h1>
            <h2 className="font-florida-display text-2xl sm:text-3xl lg:text-4xl text-florida-green-700 font-semibold">
              Surf Break Collection
            </h2>
            <div className="flex items-center justify-center space-x-2 text-florida-blue-600">
              <MapPin className="h-5 w-5" />
              <span className="font-florida-body text-lg">
                From Sebastian Inlet to Cocoa Beach
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="font-florida-body text-lg sm:text-xl text-florida-green-600 max-w-2xl mx-auto leading-relaxed">
            Celebrate Florida&apos;s legendary surf breaks with our vintage-inspired poster collection. 
            Each piece captures the laid-back spirit and natural beauty of the Sunshine State&apos;s surfing heritage.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              asChild 
              variant="florida" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6"
            >
              <Link href="/posters" className="flex items-center space-x-2">
                <span>Explore Collection</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-florida-green-300 text-florida-green-700 hover:bg-florida-green-50 text-lg px-8 py-6"
            >
              <Link href="/surf-breaks">
                View Surf Breaks
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-2xl">🏄‍♂️</div>
              <h3 className="font-florida-display font-semibold text-florida-green-800">
                Authentic Breaks
              </h3>
              <p className="text-sm text-florida-green-600">
                Real Florida surf spots mapped with precision
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">🎨</div>
              <h3 className="font-florida-display font-semibold text-florida-green-800">
                Vintage Style
              </h3>
              <p className="text-sm text-florida-green-600">
                Classic art deco and watercolor aesthetics
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">🖼️</div>
              <h3 className="font-florida-display font-semibold text-florida-green-800">
                Premium Quality
              </h3>
              <p className="text-sm text-florida-green-600">
                Museum-quality prints on archival paper
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 