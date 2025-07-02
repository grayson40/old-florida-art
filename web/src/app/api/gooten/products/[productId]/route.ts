import { NextRequest, NextResponse } from 'next/server';
import { GOOTEN_CONFIG } from '@/lib/gooten-config';

export interface GootenProductVariant {
  Sku: string;
  Size: string;
  Color: string;
  Units: string;
  Price: number;
  MaxPrintableWidth: number;
  MaxPrintableHeight: number;
  ProductImage: string;
  IsAvailable: boolean;
}

export interface GootenProductTemplate {
  Id: number;
  Name: string;
  Description: string;
  TemplateImage: string;
  PrintableAreaTop: number;
  PrintableAreaLeft: number;
  PrintableAreaWidth: number;
  PrintableAreaHeight: number;
}

export interface GootenProductDetail {
  Id: number;
  UId: string;
  Name: string;
  ShortDescription: string;
  Description: string;
  HasAvailableProductVariants: boolean;
  HasProductTemplates: boolean;
  ProductVariants: GootenProductVariant[];
  ProductTemplates: GootenProductTemplate[];
  ProductImages: string[];
  BasePrice: number;
  MinPrice: number;
  MaxPrice: number;
}

// Helper function to generate realistic product variants based on product type
function generateProductVariants(product: any, categoryName: string): GootenProductVariant[] {
  const productName = (product.name || '').toLowerCase();
  const price = parseFloat(product.cheapest_price?.replace(/[^0-9.]/g, '') || '25');
  
  // Generate variants based on product type
  let sizes: string[] = [];
  let colors: string[] = [];
  
  // Determine sizes based on product type and category
  if (categoryName.toLowerCase().includes('wall') || productName.includes('poster') || productName.includes('canvas')) {
    sizes = ['8x10', '11x14', '16x20', '18x24', '24x36'];
  } else if (productName.includes('pillow')) {
    sizes = ['16x16', '18x18', '20x20'];
  } else if (productName.includes('mug')) {
    sizes = ['11oz', '15oz'];
  } else if (productName.includes('shirt') || productName.includes('tee')) {
    sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  } else {
    sizes = ['Small', 'Medium', 'Large'];
  }
  
  // Determine colors based on product type
  if (productName.includes('pillow') || productName.includes('shirt') || productName.includes('tee')) {
    colors = ['White', 'Black', 'Navy', 'Gray', 'Heather'];
  } else if (productName.includes('mug')) {
    colors = ['White', 'Black', 'Blue'];
  } else {
    colors = ['Default', 'Premium'];
  }
  
  // Generate all combinations
  const variants: GootenProductVariant[] = [];
  
  sizes.forEach((size, sizeIndex) => {
    colors.forEach((color, colorIndex) => {
      variants.push({
        Sku: `${product.product_id}-${sizeIndex}-${colorIndex}`,
        Size: size,
        Color: color,
        Units: 'Each',
        Price: price + (sizeIndex * 5) + (colorIndex * 2), // Vary price by size/color
        MaxPrintableWidth: 8,
        MaxPrintableHeight: 10,
        ProductImage: product.url || '',
        IsAvailable: !product.out_of_stock
      });
    });
  });
  
  return variants;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId: rawProductId } = await params;
    
    // Extract the numeric ID from "gooten-XXX" format
    const productId = rawProductId.replace('gooten-', '');
    
    // Validate productId
    if (!productId || isNaN(Number(productId))) {
      return NextResponse.json({
        HadError: true,
        ErrorReferenceCode: Date.now().toString(),
        Errors: [{
          AttemptedValue: productId,
          CustomState: null,
          ErrorMessage: 'Invalid product ID provided',
          PropertyName: 'productId'
        }]
      }, { status: 400 });
    }

    // Fetch the Gooten catalog (since they don't have individual product endpoints)
    const catalogResponse = await fetch(GOOTEN_CONFIG.catalogUrl);
    
    if (!catalogResponse.ok) {
      throw new Error('Failed to fetch Gooten catalog');
    }

    const catalogData = await catalogResponse.json();
    const catalog = catalogData['product-catalog'] || [];

    // Find the product in the catalog
    let foundProduct = null;
    let categoryName = '';

    for (const category of catalog) {
      if (category.items) {
        const product = category.items.find((item: any) => 
          item.product_id.toString() === productId
        );
        if (product) {
          foundProduct = product;
          categoryName = category.name;
          break;
        }
      }
    }

    if (!foundProduct) {
      return NextResponse.json({
        HadError: true,
        ErrorReferenceCode: Date.now().toString(),
        Errors: [{
          AttemptedValue: productId,
          CustomState: null,
          ErrorMessage: 'Product not found in catalog',
          PropertyName: 'productId'
        }]
      }, { status: 404 });
    }

    // Generate mock variants based on product type and category
    const variantsData = generateProductVariants(foundProduct, categoryName);

    // Extract unique sizes, colors, and calculate price range
    const sizes = [...new Set(variantsData.map((v: GootenProductVariant) => v.Size).filter(Boolean))];
    const colors = [...new Set(variantsData.map((v: GootenProductVariant) => v.Color).filter(Boolean))];
    const prices = variantsData.map((v: GootenProductVariant) => v.Price).filter((p: number) => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 25;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 25;

    // Get product images from variants and product
    const productImages = [
      ...new Set([
        foundProduct.url,
        ...variantsData.map((v: GootenProductVariant) => v.ProductImage).filter(Boolean)
      ])
    ].filter(Boolean);

    const transformedProduct: GootenProductDetail = {
      Id: foundProduct.product_id,
      UId: `gooten-${foundProduct.product_id}`,
      Name: foundProduct.name || 'Custom Product',
      ShortDescription: foundProduct.meta_description || '',
      Description: foundProduct.meta_description || 'High-quality print-on-demand product from Gooten.',
      HasAvailableProductVariants: variantsData.length > 0,
      HasProductTemplates: true, // Most Gooten products support customization
      ProductVariants: variantsData,
      ProductTemplates: [], // Templates would need separate API call in real implementation
      ProductImages: productImages,
      BasePrice: minPrice,
      MinPrice: minPrice,
      MaxPrice: maxPrice
    };

    return NextResponse.json({
      HadError: false,
      Result: transformedProduct
    });

  } catch (error) {
    console.error('Error fetching Gooten product details:', error);
    
    return NextResponse.json({
      HadError: true,
      ErrorReferenceCode: Date.now().toString(),
      Errors: [{
        AttemptedValue: 'product-lookup',
        CustomState: null,
        ErrorMessage: error instanceof Error ? error.message : 'Failed to fetch product details',
        PropertyName: 'api.product.details'
      }]
    }, { status: 500 });
  }
}

// Generate product preview images (mock implementation for demo)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId: rawProductId } = await params;
    const productId = rawProductId.replace('gooten-', '');
    const body = await request.json();
    
    // Validate required fields for preview generation
    if (!body.sku) {
      return NextResponse.json({
        HadError: true,
        ErrorReferenceCode: Date.now().toString(),
        Errors: [{
          AttemptedValue: JSON.stringify(body),
          CustomState: null,
          ErrorMessage: 'SKU is required for preview generation',
          PropertyName: 'preview.request'
        }]
      }, { status: 400 });
    }

    // For demo purposes, return a mock preview URL
    // In a real implementation, this would integrate with Gooten's preview API
    const mockPreviewUrl = `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop&preview=${body.sku}`;

    return NextResponse.json({
      HadError: false,
      Result: {
        PreviewUrl: mockPreviewUrl,
        ProductPreviewId: `preview-${productId}-${Date.now()}`
      }
    });

  } catch (error) {
    console.error('Error generating product preview:', error);
    
    return NextResponse.json({
      HadError: true,
      ErrorReferenceCode: Date.now().toString(),
      Errors: [{
        AttemptedValue: 'preview-generation',
        CustomState: null,
        ErrorMessage: error instanceof Error ? error.message : 'Failed to generate product preview',
        PropertyName: 'api.product.preview'
      }]
    }, { status: 500 });
  }
} 