// Gooten API Configuration
// Add these to your .env.local file:
// GOOTEN_RECIPE_ID=your_recipe_id_here
// GOOTEN_PARTNER_BILLING_KEY=your_partner_billing_key_here

export const GOOTEN_CONFIG = {
  baseUrl: 'https://api.gooten.com',
  catalogUrl: 'https://gtnadminassets.blob.core.windows.net/productdatav3/catalog.json',
  recipeId: process.env.GOOTEN_RECIPE_ID || '',
  partnerBillingKey: process.env.GOOTEN_PARTNER_BILLING_KEY || '',
};

// Gooten API response types following their documentation
export interface GootenErrorResponse {
  ErrorReferenceCode: string;
  Errors: Array<{
    AttemptedValue: string;
    CustomState: any;
    ErrorMessage: string;
    PropertyName: string;
  }>;
  HadError: true;
}

export interface GootenSuccessResponse<T = any> {
  HadError: false;
  Result?: T;
  data?: T;
}

export type GootenApiResponse<T = any> = GootenSuccessResponse<T> | GootenErrorResponse;

// Utility function to make authenticated requests to Gooten API
export async function makeGootenRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<GootenApiResponse<T>> {
  const url = new URL(endpoint, GOOTEN_CONFIG.baseUrl);
  
  // Add RecipeID to all requests as required by Gooten
  url.searchParams.set('recipeId', GOOTEN_CONFIG.recipeId);
  
  try {
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    // Check for Gooten's error format
    if (data.HadError) {
      return data as GootenErrorResponse;
    }
    
    return {
      HadError: false,
      Result: data,
      data: data,
    } as GootenSuccessResponse<T>;
    
  } catch (error) {
    // Format error in Gooten's style
    return {
      ErrorReferenceCode: Date.now().toString(),
      Errors: [{
        AttemptedValue: endpoint,
        CustomState: null,
        ErrorMessage: error instanceof Error ? error.message : 'Unknown error',
        PropertyName: 'api.request',
      }],
      HadError: true,
    } as GootenErrorResponse;
  }
}

// Helper to check if response has error
export function hasGootenError<T>(
  response: GootenApiResponse<T>
): response is GootenErrorResponse {
  return response.HadError === true;
}

// Environment validation
export function validateGootenConfig(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!GOOTEN_CONFIG.recipeId) missing.push('GOOTEN_RECIPE_ID');
  
  return {
    isValid: missing.length === 0,
    missing,
  };
} 