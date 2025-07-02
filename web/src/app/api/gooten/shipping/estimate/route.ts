import { NextRequest, NextResponse } from 'next/server';
import { makeGootenRequest, hasGootenError } from '@/lib/gooten-config';

export interface ShippingItem {
  Sku: string;
  Quantity: number;
}

export interface ShippingAddress {
  FirstName: string;
  LastName: string;
  Line1: string;
  Line2?: string;
  City: string;
  State: string;
  PostalCode: string;
  CountryCode: string;
}

export interface ShippingEstimateRequest {
  ShipToAddress: ShippingAddress;
  Items: ShippingItem[];
  CurrencyCode?: string;
}

export interface ShippingOption {
  Id: string;
  Name: string;
  Price: number;
  BusinessDaysInTransit: number;
  IsAvailable: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ShippingEstimateRequest = await request.json();
    
    // Validate required fields
    if (!body.ShipToAddress || !body.Items || body.Items.length === 0) {
      return NextResponse.json({
        HadError: true,
        ErrorReferenceCode: Date.now().toString(),
        Errors: [{
          AttemptedValue: JSON.stringify(body),
          CustomState: null,
          ErrorMessage: 'ShipToAddress and Items are required',
          PropertyName: 'request.body'
        }]
      }, { status: 400 });
    }

    // Set default currency if not provided
    const requestBody = {
      ...body,
      CurrencyCode: body.CurrencyCode || 'USD'
    };

    // Call Gooten shipping estimate API
    const response = await makeGootenRequest<ShippingOption[]>('/shipoptions', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (hasGootenError(response)) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json({
      HadError: false,
      Result: response.Result
    });

  } catch (error) {
    console.error('Error estimating shipping:', error);
    
    return NextResponse.json({
      HadError: true,
      ErrorReferenceCode: Date.now().toString(),
      Errors: [{
        AttemptedValue: request.url,
        CustomState: null,
        ErrorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        PropertyName: 'api.shipping.estimate'
      }]
    }, { status: 500 });
  }
}

// Price estimate endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skus = searchParams.get('skus')?.split(',') || [];
    const quantities = searchParams.get('quantities')?.split(',').map(Number) || [];
    const currencyCode = searchParams.get('currencyCode') || 'USD';

    if (skus.length === 0 || skus.length !== quantities.length) {
      return NextResponse.json({
        HadError: true,
        ErrorReferenceCode: Date.now().toString(),
        Errors: [{
          AttemptedValue: `skus: ${skus.join(',')}, quantities: ${quantities.join(',')}`,
          CustomState: null,
          ErrorMessage: 'Valid SKUs and quantities are required, and must be equal in length',
          PropertyName: 'query.parameters'
        }]
      }, { status: 400 });
    }

    const items = skus.map((sku, index) => ({
      Sku: sku,
      Quantity: quantities[index]
    }));

    const requestBody = {
      Items: items,
      CurrencyCode: currencyCode
    };

    // Call Gooten price estimate API
    const response = await makeGootenRequest('/priceestimate', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (hasGootenError(response)) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json({
      HadError: false,
      Result: response.Result
    });

  } catch (error) {
    console.error('Error estimating price:', error);
    
    return NextResponse.json({
      HadError: true,
      ErrorReferenceCode: Date.now().toString(),
      Errors: [{
        AttemptedValue: request.url,
        CustomState: null,
        ErrorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        PropertyName: 'api.price.estimate'
      }]
    }, { status: 500 });
  }
} 