'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, MapPin, Flower, Leaf } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 florida-gradient opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-florida-sand-50/20 to-florida-sand-100/40" />
      
      {/* Decorative Botanical Elements */}
      <div className="absolute top-20 left-10 opacity-15 rotate-12">
          <Flower className="w-32 h-32 text-florida-flamingo-300" />
      </div>
      <div className="absolute top-42 right-20 opacity-20 -rotate-45">
        <Flower className="w-28 h-28 text-florida-flamingo-300" />
      </div>
      <div className="absolute bottom-32 left-1/4 opacity-15 rotate-45">
        <Leaf className="w-20 h-20 text-florida-green-300" />
      </div>
      
      <div className="absolute top-1/3 left-1/6 opacity-10 rotate-90">
        <Flower className="w-16 h-16 text-florida-sunset-300" />
      </div>
      <div className="absolute bottom-1/3 right-1/5 opacity-15 -rotate-30">
        <Leaf className="w-12 h-12 text-florida-blue-300" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4 mt-16">
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
              <Link href="/prints" className="flex items-center space-x-2">
                <span>Shop Prints</span>
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
        </div>
      </div>
    </section>
  )
} 