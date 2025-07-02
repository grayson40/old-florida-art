'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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

export function GootenProducts() {
  const [products, setProducts] = useState<GootenCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    inStock: false,
    maxPrice: ''
  });
  const [metadata, setMetadata] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.inStock) params.append('inStock', 'true');
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`/api/prints?${params.toString()}`);
      const data: GootenResponse = await response.json();

      if (data.HadError) {
        const errorMessage = data.Errors?.[0]?.ErrorMessage || 'Unknown error occurred';
        setError(errorMessage);
        return;
      }

      if (data.Result) {
        setProducts(data.Result.catalog);
        setMetadata(data.Result.metadata);
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

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchProducts();
  };

  const resetFilters = () => {
    setFilters({ category: '', inStock: false, maxPrice: '' });
    setTimeout(fetchProducts, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Gooten products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error loading products</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchProducts} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Gooten Product Catalog</h1>
        <p className="text-gray-600 mt-2">
          Browse print-on-demand products from Gooten's catalog
        </p>
        {metadata && (
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <span>Categories: {metadata.totalCategories}</span>
            <span>Products: {metadata.totalProducts}</span>
            {metadata.recipeId && (
              <span>Recipe ID: {metadata.recipeId}</span>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                type="text"
                placeholder="e.g., bestsellers"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Price</label>
              <Input
                type="number"
                placeholder="e.g., 50"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="inStock"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="inStock" className="text-sm font-medium">
                In Stock Only
              </label>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={applyFilters} size="sm">
                Apply Filters
              </Button>
              <Button onClick={resetFilters} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <div className="space-y-8">
        {products.map((category) => (
          <div key={category.name} className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-2xl font-semibold text-gray-900">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
              <Badge variant="secondary" className="mt-2">
                {category.items.length} products
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.items.map((product) => (
                <Card key={product.product_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.url && (
                      <img
                        src={product.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    {product.out_of_stock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-4">
                    <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-green-600">{product.cheapest_price}</span>
                        <span className="text-xs ml-2">+ {product.cheapest_shipping} shipping</span>
                      </div>
                      <Badge variant={product.out_of_stock ? "destructive" : "default"}>
                        ID: {product.product_id}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <Button 
                      className="w-full" 
                      size="sm"
                      disabled={product.out_of_stock}
                      onClick={() => {
                        // In a real app, this would navigate to product details
                        alert(`Product ID: ${product.product_id}\nName: ${product.name}\nPrice: ${product.cheapest_price}`);
                      }}
                    >
                      {product.out_of_stock ? 'Out of Stock' : 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found with current filters.</p>
          <Button onClick={resetFilters} className="mt-4">
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
} 