import { useState, useEffect } from 'react';

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

interface GootenResponse {
  HadError: boolean;
  Result?: {
    catalog: GootenCategory[];
    metadata: {
      totalCategories: number;
      totalProducts: number;
      filters: {
        category: string | null;
        inStock: boolean | null;
        maxPrice: string | null;
      };
      recipeId: string;
    };
  };
  Errors?: Array<{
    ErrorMessage: string;
    PropertyName: string;
  }>;
}

// Transform Gooten product to match your existing product structure
export interface TransformedProduct {
  id: string;
  title: string;
  style: string;
  collection: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
  vendor: 'gooten' | 'local';
  product_id?: number;
  cheapest_shipping?: string;
  out_of_stock?: boolean;
}

export function useGootenProducts() {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [categories, setCategories] = useState<GootenCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformGootenProduct = (product: GootenProduct, categoryName: string): TransformedProduct => {
    // Safely extract price as number, handle undefined/null values
    let price = 25; // Default price if not available
    if (product.cheapest_price && typeof product.cheapest_price === 'string') {
      try {
        price = parseFloat(product.cheapest_price.replace(/[^0-9.]/g, ''));
        if (isNaN(price) || price <= 0) {
          price = 25; // Fallback price
        }
      } catch (e) {
        console.warn('Failed to parse price for product:', product.product_id, product.cheapest_price);
        price = 25;
      }
    }
    
    // Generate a safe ID - handle undefined product_id
    const safeProductId = product.product_id || Date.now() + Math.random();
    
    // Generate collection name based on category
    const collection = mapCategoryToCollection(categoryName);
    
    // Generate style based on product name
    const style = generateStyleFromName(product.name || 'Custom Product');
    
    // Generate tags
    const tags = generateTags(product.name || '', categoryName);
    
    // Generate a proper image URL
    const image = generateProductImage(product, categoryName);
    
    return {
      id: `gooten-${safeProductId}`,
      title: product.name || `Product ${product.product_id}`,
      style,
      collection,
      price,
      image,
      isNew: false, // Could be enhanced with date logic
      isFeatured: categoryName === 'Bestsellers' || price < 30,
      tags,
      vendor: 'gooten',
      product_id: product.product_id,
      cheapest_shipping: product.cheapest_shipping || 'Standard',
      out_of_stock: product.out_of_stock || false
    };
  };

  const mapCategoryToCollection = (categoryName: string): string => {
    const categoryMap: Record<string, string> = {
      'Bestsellers': 'Bestsellers',
      'Wall Art': 'Wall Art Collection',
      'Home & Lifestyle': 'Home Decor',
      'Clothing': 'Apparel',
      'Accessories': 'Accessories',
      'Drinkware': 'Drinkware',
      'Baby': 'Baby Collection',
    };
    
    return categoryMap[categoryName] || categoryName;
  };

  const generateStyleFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('woven') || lowerName.includes('textile')) return 'Woven Art';
    if (lowerName.includes('canvas')) return 'Canvas Print';
    if (lowerName.includes('poster')) return 'Poster Art';
    if (lowerName.includes('mug') || lowerName.includes('cup')) return 'Ceramic Art';
    if (lowerName.includes('pillow')) return 'Home Textile';
    if (lowerName.includes('tote') || lowerName.includes('bag')) return 'Textile Art';
    if (lowerName.includes('phone')) return 'Tech Accessory';
    if (lowerName.includes('sticker')) return 'Vinyl Art';
    
    return 'Custom Print';
  };

  const generateTags = (name: string, category: string): string[] => {
    const tags: string[] = [];
    const lowerName = name.toLowerCase();
    const lowerCategory = category.toLowerCase();
    
    // Add category-based tags
    if (lowerCategory.includes('wall')) tags.push('wall-art');
    if (lowerCategory.includes('home')) tags.push('home-decor');
    if (lowerCategory.includes('clothing')) tags.push('apparel');
    if (lowerCategory.includes('accessory')) tags.push('accessories');
    
    // Add product-specific tags
    if (lowerName.includes('pillow')) tags.push('pillow', 'home');
    if (lowerName.includes('mug')) tags.push('mug', 'drinkware');
    if (lowerName.includes('canvas')) tags.push('canvas', 'art');
    if (lowerName.includes('poster')) tags.push('poster', 'print');
    if (lowerName.includes('tote')) tags.push('tote', 'bag');
    if (lowerName.includes('phone')) tags.push('phone-case', 'tech');
    
    // Add material/style tags
    if (lowerName.includes('woven')) tags.push('woven', 'textile');
    if (lowerName.includes('vintage')) tags.push('vintage');
    if (lowerName.includes('modern')) tags.push('modern');
    
    return tags.length > 0 ? tags : ['custom-print'];
  };

  const generateProductImage = (product: GootenProduct, categoryName: string): string => {
    // Use product.url if available, otherwise generate based on product type
    if (product.url && product.url.startsWith('http')) {
      return product.url;
    }
    
    // Generate a contextual image based on product type and category
    const lowerName = (product.name || '').toLowerCase();
    const lowerCategory = categoryName.toLowerCase();
    
    // Category-based images
    if (lowerCategory.includes('bestseller')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop';
    }
    if (lowerCategory.includes('wall') || lowerCategory.includes('art')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
    }
    if (lowerCategory.includes('home') || lowerCategory.includes('lifestyle')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop';
    }
    if (lowerCategory.includes('clothing') || lowerCategory.includes('apparel')) {
      return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop';
    }
    
    // Product-specific images
    if (lowerName.includes('pillow')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('mug') || lowerName.includes('cup')) {
      return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('canvas') || lowerName.includes('poster') || lowerName.includes('print')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('tote') || lowerName.includes('bag')) {
      return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('phone') || lowerName.includes('case')) {
      return 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('shirt') || lowerName.includes('tee')) {
      return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('sticker') || lowerName.includes('decal')) {
      return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop';
    }
    
    // Default placeholder based on category
    if (lowerCategory.includes('wall') || lowerCategory.includes('art')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
    }
    
    // Ultimate fallback
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
  };

  const generatePlaceholderImage = (name: string): string => {
    // Legacy function, now using generateProductImage
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('pillow')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('mug')) {
      return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('canvas') || lowerName.includes('poster')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
    }
    if (lowerName.includes('tote')) {
      return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop';
    }
    
    // Default placeholder
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
  };

  const fetchProducts = async (filters?: {
    category?: string;
    inStock?: boolean;
    maxPrice?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.inStock) params.append('inStock', 'true');
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      const response = await fetch(`/api/prints?${params.toString()}`);
      const data: GootenResponse = await response.json();

      if (data.HadError) {
        const errorMessage = data.Errors?.[0]?.ErrorMessage || 'Unknown error occurred';
        setError(errorMessage);
        return;
      }

      if (data.Result) {
        setCategories(data.Result.catalog);
        
        // Transform all products with validation
        const transformedProducts: TransformedProduct[] = [];
        data.Result.catalog.forEach(category => {
          category.items.forEach(product => {
            // Validate product has essential data
            if (product && (product.product_id || product.name)) {
              try {
                transformedProducts.push(transformGootenProduct(product, category.name));
              } catch (error) {
                console.warn('Failed to transform product:', product, error);
              }
            } else {
              console.warn('Skipping invalid product:', product);
            }
          });
        });
        
        setProducts(transformedProducts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchProducts,
  };
} 