import { NextRequest, NextResponse } from 'next/server';
import { GOOTEN_CONFIG, validateGootenConfig, GootenApiResponse, hasGootenError } from '@/lib/gooten-config';

export interface GootenProduct {
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

export interface GootenCategory {
  name: string;
  type: string;
  meta_title: string;
  meta_description: string;
  description: string;
  items: GootenProduct[];
}

export interface GootenCatalog {
  'product-catalog': GootenCategory[];
}

export async function GET(request: NextRequest) {
  try {
    // Validate Gooten configuration
    const configValidation = validateGootenConfig();
    if (!configValidation.isValid) {
      return NextResponse.json({
        HadError: true,
        ErrorReferenceCode: Date.now().toString(),
        Errors: [{
          AttemptedValue: '',
          CustomState: null,
          ErrorMessage: `Missing required environment variables: ${configValidation.missing.join(', ')}`,
          PropertyName: 'configuration'
        }]
      }, { status: 400 });
    }

    // Call the Gooten catalog API (this endpoint doesn't require RecipeID)
    const response = await fetch(GOOTEN_CONFIG.catalogUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Cache for performance
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return NextResponse.json({
        HadError: true,
        ErrorReferenceCode: Date.now().toString(),
        Errors: [{
          AttemptedValue: GOOTEN_CONFIG.catalogUrl,
          CustomState: null,
          ErrorMessage: `Gooten API responded with status: ${response.status}`,
          PropertyName: 'api.catalog'
        }]
      }, { status: response.status });
    }

    const catalog: GootenCatalog = await response.json();

    // Extract query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock') === 'true';
    const maxPrice = searchParams.get('maxPrice');

    let filteredCatalog = catalog['product-catalog'];

    // Filter by category if specified
    if (category) {
      filteredCatalog = filteredCatalog.filter(cat => 
        cat.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter products within categories
    if (inStock || maxPrice) {
      filteredCatalog = filteredCatalog.map(cat => ({
        ...cat,
        items: cat.items.filter(product => {
          let include = true;
          
          // Filter by stock status
          if (inStock && product.out_of_stock) {
            include = false;
          }
          
          // Filter by price
          if (maxPrice && include) {
            const price = parseFloat(product.cheapest_price.replace('$', ''));
            const maxPriceNum = parseFloat(maxPrice);
            if (price > maxPriceNum) {
              include = false;
            }
          }
          
          return include;
        })
      }));
    }

    // Calculate totals for response metadata
    const totalCategories = filteredCatalog.length;
    const totalProducts = filteredCatalog.reduce((sum, cat) => sum + cat.items.length, 0);

    // Return in Gooten's success format
    return NextResponse.json({
      HadError: false,
      Result: {
        catalog: filteredCatalog,
        metadata: {
          totalCategories,
          totalProducts,
          filters: {
            category: category || null,
            inStock: inStock || null,
            maxPrice: maxPrice || null
          },
          recipeId: GOOTEN_CONFIG.recipeId || 'not_configured'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching Gooten products:', error);
    
    // Return error in Gooten's format
    return NextResponse.json({
      HadError: true,
      ErrorReferenceCode: Date.now().toString(),
      Errors: [{
        AttemptedValue: request.url,
        CustomState: null,
        ErrorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        PropertyName: 'api.prints'
      }]
    }, { status: 500 });
  }
}

// CORS support
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
