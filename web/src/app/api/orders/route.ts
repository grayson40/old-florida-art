import { NextRequest, NextResponse } from 'next/server';
import { makeGootenRequest, hasGootenError, GOOTEN_CONFIG, validateGootenConfig } from '@/lib/gooten-config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderItem {
  Sku: string;
  Quantity: number;
  ProductId: string;
  ProductName: string;
  Price: number;
  Size?: string;
  Color?: string;
}

export interface OrderAddress {
  FirstName: string;
  LastName: string;
  Line1: string;
  Line2?: string;
  City: string;
  State: string;
  PostalCode: string;
  CountryCode: string;
  Email?: string;
  Phone?: string;
}

export interface OrderRequest {
  ShipToAddress: OrderAddress;
  BillingAddress?: OrderAddress;
  Items: OrderItem[];
  ShippingMethodId?: string;
  CurrencyCode?: string;
  PaymentId?: string; // Stripe payment intent ID
  CustomerEmail: string;
  CustomerPhone?: string;
}

export interface GootenOrderRequest {
  ShipToAddress: OrderAddress;
  BillingAddress?: OrderAddress;
  Items: {
    SKU: string;
    Quantity: number;
    ShipType?: string;
    Images?: {
      Url: string;
      SpaceId?: string;
      Index?: number;
      ThumbnailUrl?: string;
    }[];
    SourceId?: string;
    Meta?: Record<string, any>;
  }[];
  Payment: {
    PartnerBillingKey: string;
  };
  IsInTestMode?: boolean;
  SourceId?: string;
  IsPartnerSourceIdUnique?: boolean;
  Meta?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json();
    
    // Validate required fields
    if (!body.ShipToAddress || !body.Items || body.Items.length === 0 || !body.CustomerEmail) {
      return NextResponse.json({
        error: 'ShipToAddress, Items, and CustomerEmail are required',
        success: false
      }, { status: 400 });
    }

    // Generate order ID
    const orderId = `FL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // TESTING MODE: Bypass Gooten fulfillment for now
    console.log('🧪 TEST MODE: Skipping Gooten order submission');
    console.log('📝 To enable real fulfillment: Uncomment the Gooten section in /api/orders/route.ts');
    console.log('Order would be submitted to Gooten:', {
      orderId,
      items: body.Items.length,
      customer: body.CustomerEmail,
      total: body.Items.reduce((sum, item) => sum + (item.Price * item.Quantity), 0)
    });

    /* 
    // PRODUCTION: Uncomment this section when ready to use Gooten fulfillment
    
    // Validate Gooten configuration
    const gootenValidation = validateGootenConfig();
    if (!gootenValidation.isValid) {
      return NextResponse.json({
        error: 'Gooten is not properly configured',
        success: false,
        details: `Missing environment variables: ${gootenValidation.missing.join(', ')}`
      }, { status: 500 });
    }

    // Prepare Gooten order request according to official API documentation
    const gootenOrderRequest: GootenOrderRequest = {
      ShipToAddress: body.ShipToAddress,
      BillingAddress: body.BillingAddress || body.ShipToAddress,
      Items: body.Items.map(item => ({
        SKU: item.Sku,
        Quantity: item.Quantity,
        ShipType: 'standard',
        SourceId: item.ProductId,
        Meta: {
          ProductName: item.ProductName,
          Size: item.Size,
          Color: item.Color
        }
      })),
      Payment: {
        PartnerBillingKey: GOOTEN_CONFIG.partnerBillingKey
      },
      IsInTestMode: process.env.NODE_ENV !== 'production',
      SourceId: orderId,
      IsPartnerSourceIdUnique: true,
      Meta: {
        Source: 'FL-Shop',
        OrderId: orderId,
        CustomerEmail: body.CustomerEmail
      }
    };

    // Submit order to Gooten
    const gootenResponse = await makeGootenRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(gootenOrderRequest),
    });

    if (hasGootenError(gootenResponse)) {
      console.error('Gooten order error:', gootenResponse);
      return NextResponse.json({
        error: 'Failed to submit order to fulfillment service',
        success: false,
        details: gootenResponse.Errors
      }, { status: 400 });
    }
    */

    // Calculate totals
    const subtotal = body.Items.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
    const shipping = subtotal >= 75 ? 0 : 8.99;
    const tax = subtotal * 0.07;
    const total = subtotal + shipping + tax;

    // Send confirmation email
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'no-reply@oldflorida.art',
        to: body.CustomerEmail,
        subject: `🧪 TEST Order Confirmation - ${orderId}`,
        html: generateOrderConfirmationEmail({
          orderId,
          customerName: `${body.ShipToAddress.FirstName} ${body.ShipToAddress.LastName}`,
          items: body.Items,
          shippingAddress: body.ShipToAddress,
          subtotal,
          shipping,
          tax,
          total
        })
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      gootenOrderId: 'TEST-MODE-NO-GOOTEN', // Will be real Gooten order ID when uncommented
      message: 'Order submitted successfully (TEST MODE - no fulfillment)'
    });

  } catch (error) {
    console.error('Order processing error:', error);
    
    return NextResponse.json({
      error: 'Failed to process order',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateOrderConfirmationEmail(orderData: {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  const { orderId, customerName, items, shippingAddress, subtotal, shipping, tax, total } = orderData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2d5c2f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .item:last-child { border-bottom: none; }
        .totals { background: #f0f8f0; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div class="content">
          <h2>Hi ${customerName},</h2>
          <p>Your order has been received and is being processed. Here are the details:</p>
          
          <div class="order-details">
            <h3>Order #${orderId}</h3>
            
            <h4>Items Ordered:</h4>
            ${items.map(item => `
              <div class="item">
                <strong>${item.ProductName}</strong><br>
                ${item.Size ? `Size: ${item.Size}` : ''}
                ${item.Color ? ` • Color: ${item.Color}` : ''}<br>
                Quantity: ${item.Quantity} • Price: $${item.Price.toFixed(2)}
              </div>
            `).join('')}
            
            <div class="totals">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Tax:</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>
            
            <h4>Shipping Address:</h4>
            <p>
              ${shippingAddress.FirstName} ${shippingAddress.LastName}<br>
              ${shippingAddress.Line1}<br>
              ${shippingAddress.Line2 ? `${shippingAddress.Line2}<br>` : ''}
              ${shippingAddress.City}, ${shippingAddress.State} ${shippingAddress.PostalCode}<br>
              ${shippingAddress.CountryCode}
            </p>
          </div>
          
          <p><strong>🧪 TEST MODE:</strong> This is a test order. No actual printing or shipping will occur. In production mode, your order would be sent to our fulfillment partner and shipped within 3-5 business days.</p>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at orders@oldflorida.art</p>
          <p>© ${new Date().getFullYear()} Old Florida Art Co., LLC</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 