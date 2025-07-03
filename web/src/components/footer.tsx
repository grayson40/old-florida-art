import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Footer() {
  return (
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
  )
} 