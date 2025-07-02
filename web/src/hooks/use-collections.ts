import { useState, useEffect } from 'react';

export interface Collection {
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

interface CollectionsResponse {
  success: boolean;
  collections: Collection[];
  meta: {
    total: number;
    featured: number;
    gooten: number;
    local: number;
  };
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/collections');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch collections: ${response.status}`);
        }

        const data: CollectionsResponse = await response.json();
        
        if (!data.success) {
          throw new Error('API returned unsuccessful response');
        }

        setCollections(data.collections);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  // Helper functions
  const getFeaturedCollections = () => collections.filter(c => c.featured);
  
  const getCollectionById = (id: string) => collections.find(c => c.id === id);
  
  const getCollectionsByVendor = (vendor: 'gooten' | 'local') => 
    collections.filter(c => c.vendor === vendor);

  return {
    collections,
    loading,
    error,
    getFeaturedCollections,
    getCollectionById,
    getCollectionsByVendor,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-trigger the effect
      setCollections([]);
    }
  };
} 