'use client';

import { useState, useEffect } from 'react';
import { GootenProductDetail, GootenProductVariant } from '@/app/api/gooten/products/[productId]/route';

export interface ProductVariantOption {
  type: 'size' | 'color' | 'style';
  value: string;
  label: string;
  available: boolean;
  price?: number;
  sku?: string;
}

export interface TransformedProductDetail {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  basePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  variants: GootenProductVariant[];
  variantOptions: {
    sizes: ProductVariantOption[];
    colors: ProductVariantOption[];
    styles: ProductVariantOption[];
  };
  hasCustomization: boolean;
  isAvailable: boolean;
}

export interface UseGootenProductDetailState {
  product: TransformedProductDetail | null;
  selectedVariant: GootenProductVariant | null;
  loading: boolean;
  error: string | null;
}

export interface UseGootenProductDetailActions {
  selectVariant: (sku: string) => void;
  selectOption: (type: 'size' | 'color' | 'style', value: string) => void;
  generatePreview: (imageUrl?: string) => Promise<string | null>;
  refreshProduct: () => void;
}

export type UseGootenProductDetailReturn = UseGootenProductDetailState & UseGootenProductDetailActions;

export function useGootenProductDetail(productId: string): UseGootenProductDetailReturn {
  const [product, setProduct] = useState<TransformedProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<GootenProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/gooten/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.HadError) {
        throw new Error(data.Errors?.[0]?.ErrorMessage || 'Failed to fetch product details');
      }

      const productData: GootenProductDetail = data.Result;
      
      // Transform Gooten product data to our format
      const transformedProduct: TransformedProductDetail = {
        id: productData.Id.toString(),
        name: productData.Name,
        description: productData.Description,
        shortDescription: productData.ShortDescription,
        images: productData.ProductImages || [],
        basePrice: productData.BasePrice,
        priceRange: {
          min: productData.MinPrice,
          max: productData.MaxPrice,
        },
        variants: productData.ProductVariants || [],
        variantOptions: extractVariantOptions(productData.ProductVariants || []),
        hasCustomization: productData.HasProductTemplates,
        isAvailable: productData.HasAvailableProductVariants,
      };

      setProduct(transformedProduct);

      // Auto-select first available variant
      const firstAvailableVariant = productData.ProductVariants?.find(v => v.IsAvailable);
      if (firstAvailableVariant) {
        setSelectedVariant(firstAvailableVariant);
      }

    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const extractVariantOptions = (variants: GootenProductVariant[]) => {
    const sizes = [...new Set(variants.map(v => v.Size).filter(Boolean))]
      .map(size => ({
        type: 'size' as const,
        value: size,
        label: size,
        available: variants.some(v => v.Size === size && v.IsAvailable),
        price: variants.find(v => v.Size === size)?.Price,
        sku: variants.find(v => v.Size === size)?.Sku,
      }));

    const colors = [...new Set(variants.map(v => v.Color).filter(Boolean))]
      .map(color => ({
        type: 'color' as const,
        value: color,
        label: color,
        available: variants.some(v => v.Color === color && v.IsAvailable),
        price: variants.find(v => v.Color === color)?.Price,
        sku: variants.find(v => v.Color === color)?.Sku,
      }));

    // Extract style options from variant combinations
    const styles = [...new Set(variants.map(v => `${v.Size}-${v.Color}`).filter(Boolean))]
      .map(combo => {
        const [size, color] = combo.split('-');
        const variant = variants.find(v => v.Size === size && v.Color === color);
        return {
          type: 'style' as const,
          value: combo,
          label: `${size} - ${color}`,
          available: variant?.IsAvailable || false,
          price: variant?.Price,
          sku: variant?.Sku,
        };
      });

    return { sizes, colors, styles };
  };

  const selectVariant = (sku: string) => {
    const variant = product?.variants.find(v => v.Sku === sku);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const selectOption = (type: 'size' | 'color' | 'style', value: string) => {
    if (!product) return;

    if (type === 'style') {
      const variant = product.variants.find(v => `${v.Size}-${v.Color}` === value);
      if (variant) {
        setSelectedVariant(variant);
      }
    } else {
      // For size/color selection, find compatible variant
      const currentVariant = selectedVariant;
      let newVariant: GootenProductVariant | undefined;

      if (type === 'size') {
        newVariant = product.variants.find(v => 
          v.Size === value && 
          (currentVariant ? v.Color === currentVariant.Color : true)
        );
      } else if (type === 'color') {
        newVariant = product.variants.find(v => 
          v.Color === value && 
          (currentVariant ? v.Size === currentVariant.Size : true)
        );
      }

      if (newVariant) {
        setSelectedVariant(newVariant);
      }
    }
  };

  const generatePreview = async (imageUrl?: string): Promise<string | null> => {
    if (!selectedVariant || !product?.hasCustomization) {
      return null;
    }

    try {
      const response = await fetch(`/api/gooten/products/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku: selectedVariant.Sku,
          templateId: 1, // Default template ID - in real app, let user choose
          imageUrl: imageUrl || '',
        }),
      });

      const data = await response.json();

      if (data.HadError) {
        throw new Error(data.Errors?.[0]?.ErrorMessage || 'Failed to generate preview');
      }

      return data.Result?.PreviewUrl || null;
    } catch (err) {
      console.error('Error generating preview:', err);
      return null;
    }
  };

  const refreshProduct = () => {
    fetchProduct();
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return {
    product,
    selectedVariant,
    loading,
    error,
    selectVariant,
    selectOption,
    generatePreview,
    refreshProduct,
  };
} 