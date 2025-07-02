import { NextResponse } from 'next/server';

interface GootenProduct {
  vendor_routing: string;
  product_id: number;
  meta_description: string;
  url: string;
  name: string;
  meta_title: string;
  cheapest_shipping: string;
  deprecated: boolean;
  cheapest_price: string;
  out_of_stock: boolean;
  type: string;
  staging_product_id?: number;
}

interface GootenCategory {
  name: string;
  type: string;
  meta_title: string;
  meta_description: string;
  description: string;
  items: GootenProduct[];
}

interface Collection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  heroImage: string;
  productCount: number;
  icon: string;
  color: string;
  featured: boolean;
  products: Array<{
    id: string;
    title: string;
    style: string;
    price: number;
    originalPrice?: number;
    image: string;
    isNew?: boolean;
    isFeatured?: boolean;
  }>;
  category?: string;
  vendor: 'gooten' | 'local';
}

export async function GET() {
  try {
    let gootenCollections: Collection[] = [];

    // Try to fetch from Gooten, but use fallback if it fails
    try {
      const response = await fetch('https://gtnadminassets.blob.core.windows.net/productdatav3/catalog.json');
      
      if (response.ok) {
        const catalog = await response.json();
        
        // Handle different possible structures
        let categories: GootenCategory[] = [];
        
        if (catalog.categories && Array.isArray(catalog.categories)) {
          categories = catalog.categories;
        } else if (catalog.Result && catalog.Result.catalog && Array.isArray(catalog.Result.catalog)) {
          categories = catalog.Result.catalog;
        } else if (Array.isArray(catalog)) {
          // If catalog is directly an array
          categories = catalog;
        }

        // Transform categories into collections
        gootenCollections = categories.slice(0, 10).map((category: GootenCategory, index: number) => {
          const products = (category.items || []).slice(0, 20).map((product: GootenProduct) => {
            let price = 25;
            if (product.cheapest_price && typeof product.cheapest_price === 'string') {
              try {
                price = parseFloat(product.cheapest_price.replace(/[^0-9.]/g, ''));
                if (isNaN(price) || price <= 0) price = 25;
              } catch (e) {
                price = 25;
              }
            }

            return {
              id: `gooten-${product.product_id}`,
              title: product.name || `Product ${product.product_id}`,
              style: getProductStyle(product.name || '', category.name),
              price,
              originalPrice: price > 30 ? Math.round(price * 1.2) : undefined,
              image: getProductImage(product, category.name),
              isNew: Math.random() < 0.3,
              isFeatured: Math.random() < 0.4
            };
          });

          const collectionInfo = getCollectionInfo(category.name);
          
          return {
            id: `gooten-${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            title: category.name,
            subtitle: collectionInfo.subtitle,
            description: category.description || collectionInfo.description,
            image: products[0]?.image || collectionInfo.defaultImage,
            heroImage: collectionInfo.heroImage,
            productCount: category.items?.length || 0,
            icon: collectionInfo.icon,
            color: collectionInfo.color,
            featured: collectionInfo.featured,
            products,
            category: category.name,
            vendor: 'gooten'
          };
        });
      }
    } catch (gootenError) {
      console.warn('Failed to fetch from Gooten, using fallback collections:', gootenError);
      
      // Fallback Gooten-style collections
      gootenCollections = [
        {
          id: 'gooten-bestsellers',
          title: 'Bestsellers',
          subtitle: 'Top Customer Favorites',
          description: 'Our most popular products loved by customers worldwide.',
          image: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600&h=800&fit=crop',
          heroImage: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=1200&h=800&fit=crop',
          productCount: 25,
          icon: 'Star',
          color: 'gold',
          featured: true,
          products: generateMockProducts('bestsellers'),
          vendor: 'gooten'
        },
        {
          id: 'gooten-wall-art',
          title: 'Wall Art',
          subtitle: 'Transform Your Space',
          description: 'Beautiful wall art to make your space uniquely yours.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop',
          heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
          productCount: 18,
          icon: 'Frame',
          color: 'blue',
          featured: true,
          products: generateMockProducts('wall-art'),
          vendor: 'gooten'
        },
        {
          id: 'gooten-home-lifestyle',
          title: 'Home & Lifestyle',
          subtitle: 'Comfort Meets Style',
          description: 'Elevate your everyday with beautiful home essentials.',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop',
          heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop',
          productCount: 22,
          icon: 'Home',
          color: 'green',
          featured: true,
          products: generateMockProducts('home'),
          vendor: 'gooten'
        },
        {
          id: 'gooten-clothing',
          title: 'Clothing',
          subtitle: 'Express Yourself',
          description: 'Unique apparel that tells your story.',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
          heroImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=800&fit=crop',
          productCount: 15,
          icon: 'Shirt',
          color: 'purple',
          featured: false,
          products: generateMockProducts('clothing'),
          vendor: 'gooten'
        }
      ];
    }

    // Add curated local collections
    const localCollections: Collection[] = [
      {
        id: 'tropical-blooms',
        title: 'Tropical Blooms',
        subtitle: 'Hibiscus & Florida Flora',
        description: 'Celebrate Florida\'s vibrant botanical heritage with our hibiscus-inspired collection featuring vintage watercolor florals.',
        image: 'https://images.unsplash.com/photo-1594736797933-d0b22ba58871?w=600&h=800&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1594736797933-d0b22ba58871?w=1200&h=800&fit=crop',
        productCount: 8,
        icon: 'Flower',
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
        ],
        vendor: 'local'
      },
      {
        id: 'surf-breaks',
        title: 'Classic Surf Breaks',
        subtitle: 'Legendary Florida Waves',
        description: 'Iconic surf spots from Sebastian Inlet to Cocoa Beach, rendered in classic vintage poster style.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=800&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
        productCount: 12,
        icon: 'Waves',
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
        ],
        vendor: 'local'
      },
      {
        id: 'art-deco-florida',
        title: 'Art Deco Florida',
        subtitle: 'Miami Beach Glamour',
        description: 'Geometric elegance meets Florida charm in this sophisticated collection inspired by South Beach architecture.',
        image: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600&h=800&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=1200&h=800&fit=crop',
        productCount: 8,
        icon: 'Palette',
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
        ],
        vendor: 'local'
      }
    ];

    // Combine and sort collections - featured first
    const allCollections = [...localCollections, ...gootenCollections]
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.productCount - a.productCount;
      });

    return NextResponse.json({
      success: true,
      collections: allCollections,
      meta: {
        total: allCollections.length,
        featured: allCollections.filter(c => c.featured).length,
        gooten: gootenCollections.length,
        local: localCollections.length
      }
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

function generateMockProducts(category: string) {
  const productsByCategory = {
    'bestsellers': [
      { id: 'gooten-101', title: 'Premium Canvas Print', style: 'Canvas Art', price: 35, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop' },
      { id: 'gooten-102', title: 'Ceramic Coffee Mug', style: 'Ceramic Art', price: 18, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop' },
      { id: 'gooten-103', title: 'Comfort Throw Pillow', style: 'Home Textile', price: 28, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop' }
    ],
    'wall-art': [
      { id: 'gooten-201', title: 'Gallery Canvas', style: 'Canvas Print', price: 42, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop' },
      { id: 'gooten-202', title: 'Vintage Poster Print', style: 'Poster Art', price: 25, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop' },
      { id: 'gooten-203', title: 'Framed Art Print', style: 'Framed Art', price: 65, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop' }
    ],
    'home': [
      { id: 'gooten-301', title: 'Decorative Pillow', style: 'Home Textile', price: 32, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop' },
      { id: 'gooten-302', title: 'Kitchen Towel Set', style: 'Home Essentials', price: 22, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop' },
      { id: 'gooten-303', title: 'Cozy Blanket', style: 'Home Textile', price: 55, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop' }
    ],
    'clothing': [
      { id: 'gooten-401', title: 'Classic T-Shirt', style: 'Apparel', price: 24, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop' },
      { id: 'gooten-402', title: 'Hoodie Sweatshirt', style: 'Apparel', price: 45, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop' },
      { id: 'gooten-403', title: 'Tote Bag', style: 'Accessory', price: 18, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop' }
    ]
  };

  return (productsByCategory[category as keyof typeof productsByCategory] || productsByCategory.bestsellers)
    .map(product => ({
      ...product,
      isNew: Math.random() < 0.3,
      isFeatured: Math.random() < 0.4
    }));
}

function getProductStyle(name: string, category: string): string {
  const lowerName = name.toLowerCase();
  const lowerCategory = category.toLowerCase();
  
  if (lowerName.includes('canvas')) return 'Canvas Print';
  if (lowerName.includes('poster')) return 'Poster Art';
  if (lowerName.includes('pillow')) return 'Home Textile';
  if (lowerName.includes('mug')) return 'Ceramic Art';
  if (lowerName.includes('tote')) return 'Textile Art';
  if (lowerName.includes('phone')) return 'Tech Accessory';
  if (lowerName.includes('sticker')) return 'Vinyl Art';
  if (lowerCategory.includes('wall')) return 'Wall Art';
  if (lowerCategory.includes('clothing')) return 'Apparel';
  
  return 'Custom Print';
}

function getProductImage(product: GootenProduct, category: string): string {
  const lowerName = (product.name || '').toLowerCase();
  const lowerCategory = category.toLowerCase();
  
  // Category-based images
  if (lowerCategory.includes('wall') || lowerCategory.includes('art')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
  }
  if (lowerCategory.includes('home') || lowerCategory.includes('lifestyle')) {
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop';
  }
  if (lowerCategory.includes('clothing')) {
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop';
  }
  if (lowerCategory.includes('bestseller')) {
    return 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=400&h=500&fit=crop';
  }
  
  // Product-specific images
  if (lowerName.includes('pillow')) {
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop';
  }
  if (lowerName.includes('mug')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
  }
  if (lowerName.includes('canvas')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
  }
  
  return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
}

function getCollectionInfo(categoryName: string) {
  const categoryMap: Record<string, any> = {
    'Bestsellers': {
      subtitle: 'Top Customer Favorites',
      description: 'Our most popular products loved by customers worldwide.',
      defaultImage: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600&h=800&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=1200&h=800&fit=crop',
      icon: 'Star',
      color: 'gold',
      featured: true
    },
    'Wall Art': {
      subtitle: 'Transform Your Space',
      description: 'Beautiful wall art to make your space uniquely yours.',
      defaultImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
      icon: 'Frame',
      color: 'blue',
      featured: true
    },
    'Home & Lifestyle': {
      subtitle: 'Comfort Meets Style',
      description: 'Elevate your everyday with beautiful home essentials.',
      defaultImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop',
      icon: 'Home',
      color: 'green',
      featured: true
    },
    'Clothing': {
      subtitle: 'Express Yourself',
      description: 'Unique apparel that tells your story.',
      defaultImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=800&fit=crop',
      icon: 'Shirt',
      color: 'purple',
      featured: false
    },
    'Accessories': {
      subtitle: 'Perfect Finishing Touches',
      description: 'The details that complete your look.',
      defaultImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=800&fit=crop',
      icon: 'Package',
      color: 'pink',
      featured: false
    }
  };

  return categoryMap[categoryName] || {
    subtitle: 'Premium Collection',
    description: `Discover our curated ${categoryName} collection.`,
    defaultImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
    icon: 'Package',
    color: 'blue',
    featured: false
  };
} 