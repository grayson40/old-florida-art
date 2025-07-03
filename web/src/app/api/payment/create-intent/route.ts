import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export interface CreatePaymentIntentRequest {
  amount: number; // in cents
  currency?: string;
  orderData: {
    Items: Array<{
      ProductName: string;
      Quantity: number;
      Price: number;
    }>;
    CustomerEmail: string;
    ShipToAddress: {
      FirstName: string;
      LastName: string;
      Line1: string;
      Line2?: string;
      City: string;
      State: string;
      PostalCode: string;
      CountryCode: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentIntentRequest = await request.json();
    
    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({
        error: 'Valid amount is required',
        success: false
      }, { status: 400 });
    }

    if (!body.orderData || !body.orderData.Items || !body.orderData.CustomerEmail || !body.orderData.ShipToAddress) {
      return NextResponse.json({
        error: 'Order data is incomplete',
        success: false
      }, { status: 400 });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(body.amount), // Ensure it's an integer
      currency: body.currency || 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_type: 'fl-shop-order',
        customer_email: body.orderData.CustomerEmail,
        item_count: body.orderData.Items.length.toString(),
      },
      shipping: {
        name: `${body.orderData.ShipToAddress.FirstName} ${body.orderData.ShipToAddress.LastName}`,
        address: {
          line1: body.orderData.ShipToAddress.Line1,
          line2: body.orderData.ShipToAddress.Line2 || undefined,
          city: body.orderData.ShipToAddress.City,
          state: body.orderData.ShipToAddress.State,
          postal_code: body.orderData.ShipToAddress.PostalCode,
          country: body.orderData.ShipToAddress.CountryCode,
        },
      },
      receipt_email: body.orderData.CustomerEmail,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    
    return NextResponse.json({
      error: 'Failed to create payment intent',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent');
    
    if (!paymentIntentId) {
      return NextResponse.json({
        error: 'Payment intent ID is required',
        success: false
      }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
      }
    });

  } catch (error) {
    console.error('Payment intent retrieval error:', error);
    
    return NextResponse.json({
      error: 'Failed to retrieve payment intent',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 