import { NextResponse } from 'next/server';

interface SearchResult {
  type: 'product' | 'collection';
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  price?: number;
  style?: string;
  category?: string;
  vendor: 'gooten' | 'local';
  url: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const type = searchParams.get('type') || 'all'; // 'products', 'collections', or 'all'
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        meta: {
          total: 0,
          query: query,
          type: type
        }
      });
    }

    const results: SearchResult[] = [];

    // Fetch collections if needed
    if (type === 'collections' || type === 'all') {
      try {
        const collectionsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/collections`);
        if (collectionsResponse.ok) {
          const collectionsData = await collectionsResponse.json();
          
          collectionsData.collections?.forEach((collection: any) => {
            const searchableText = `${collection.title} ${collection.subtitle} ${collection.description}`.toLowerCase();
            
            if (searchableText.includes(query)) {
              results.push({
                type: 'collection',
                id: collection.id,
                title: collection.title,
                subtitle: collection.subtitle,
                description: collection.description,
                image: collection.image,
                category: collection.category,
                vendor: collection.vendor,
                url: `/collections/${collection.id}`
              });
            }
          });
        }
      } catch (error) {
        console.warn('Failed to search collections:', error);
      }
    }

    // Fetch and search Gooten products if needed
    if (type === 'products' || type === 'all') {
      try {
        // Get Gooten catalog
        const response = await fetch('https://gtnadminassets.blob.core.windows.net/productdatav3/catalog.json');
        
        if (response.ok) {
          const catalog = await response.json();
          
          // Handle different catalog structures
          let categories: any[] = [];
          if (catalog.categories && Array.isArray(catalog.categories)) {
            categories = catalog.categories;
          } else if (catalog.Result && catalog.Result.catalog && Array.isArray(catalog.Result.catalog)) {
            categories = catalog.Result.catalog;
          } else if (Array.isArray(catalog)) {
            categories = catalog;
          }

          // Search through products
          categories.forEach((category: any) => {
            if (category.items && Array.isArray(category.items)) {
              category.items.forEach((product: any) => {
                const searchableText = `${product.name || ''} ${category.name || ''} ${product.type || ''}`.toLowerCase();
                
                if (searchableText.includes(query)) {
                  let price = 25;
                  if (product.cheapest_price && typeof product.cheapest_price === 'string') {
                    try {
                      price = parseFloat(product.cheapest_price.replace(/[^0-9.]/g, ''));
                      if (isNaN(price) || price <= 0) price = 25;
                    } catch (e) {
                      price = 25;
                    }
                  }

                  results.push({
                    type: 'product',
                    id: `gooten-${product.product_id}`,
                    title: product.name || `Product ${product.product_id}`,
                    description: product.meta_description || `${category.name} product`,
                    image: getProductImage(product, category.name),
                    price: price,
                    style: getProductStyle(product.name || '', category.name),
                    category: category.name,
                    vendor: 'gooten',
                    url: `/products/gooten-${product.product_id}`
                  });
                }
              });
            }
          });
        }
      } catch (error) {
        console.warn('Failed to search Gooten products:', error);
      }

      // Add local products for comprehensive search
      const localProducts = [
        {
          type: 'product' as const,
          id: 'hibiscus-classic',
          title: 'Classic Hibiscus Dreams',
          description: 'Vintage watercolor hibiscus art celebrating Florida\'s botanical beauty',
          image: 'https://images.unsplash.com/photo-1594736797933-d0b22ba58871?w=400&h=500&fit=crop',
          price: 48,
          style: 'Vintage Watercolor',
          category: 'Tropical Blooms',
          vendor: 'local' as const,
          url: '/products/hibiscus-classic'
        },
        {
          type: 'product' as const,
          id: 'sebastian-inlet',
          title: 'Sebastian Inlet Classic',
          description: 'Vintage surf poster capturing Florida\'s legendary surf break',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop',
          price: 45,
          style: 'Vintage Surf Poster',
          category: 'Surf Breaks',
          vendor: 'local' as const,
          url: '/products/sebastian-inlet'
        },
        {
          type: 'product' as const,
          id: 'deco-skyline',
          title: 'Miami Deco Skyline',
          description: 'Art Deco inspired Miami Beach architecture',
          image: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=400&h=500&fit=crop',
          price: 52,
          style: 'Art Deco',
          category: 'Art Deco Florida',
          vendor: 'local' as const,
          url: '/products/deco-skyline'
        }
      ];

      localProducts.forEach(product => {
        const searchableText = `${product.title} ${product.description} ${product.style} ${product.category}`.toLowerCase();
        if (searchableText.includes(query)) {
          results.push(product);
        }
      });
    }

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Exact title matches first
      if (aTitle === query && bTitle !== query) return -1;
      if (bTitle === query && aTitle !== query) return 1;
      
      // Title starts with query
      if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
      if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;
      
      // Collections before products
      if (a.type === 'collection' && b.type === 'product') return -1;
      if (a.type === 'product' && b.type === 'collection') return 1;
      
      return 0;
    });

    // Limit results
    const limitedResults = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      results: limitedResults,
      meta: {
        total: results.length,
        shown: limitedResults.length,
        query: query,
        type: type
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
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

function getProductImage(product: any, category: string): string {
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
  
  return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
} 