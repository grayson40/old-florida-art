'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/cart-context'
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Environment variable must be NEXT_PUBLIC_ prefixed for client-side access
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

function PaymentForm({ 
  total, 
  orderData, 
  onSuccess, 
  onError 
}: { 
  total: number; 
  orderData: any; 
  onSuccess: (orderId: string) => void; 
  onError: (error: string) => void; 
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create payment intent when component mounts and orderData is available
    if (orderData && orderData.Items && orderData.Items.length > 0 && orderData.CustomerEmail) {
      createPaymentIntent()
    }
  }, [orderData])

  const createPaymentIntent = async () => {
    try {
      const paymentData = {
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        orderData: orderData,
      }

      console.log('Creating payment intent with data:', paymentData);

      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()
      console.log('Payment intent response:', result);
      
      if (result.success) {
        setClientSecret(result.clientSecret)
        console.log('Payment intent created successfully, client secret set');
      } else {
        console.error('Payment intent error:', result)
        onError(result.error || 'Failed to initialize payment')
      }
    } catch (error) {
      console.error('Payment intent fetch error:', error)
      onError('Failed to initialize payment')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      onError('Card element not found')
      setIsProcessing(false)
      return
    }

    try {
      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${orderData.ShipToAddress.FirstName} ${orderData.ShipToAddress.LastName}`,
            email: orderData.CustomerEmail,
          },
        },
      })

      if (error) {
        onError(error.message || 'Payment failed')
        setIsProcessing(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        // Submit order to backend
        await submitOrder(paymentIntent.id)
      }
    } catch (error) {
      onError('Payment processing failed')
      setIsProcessing(false)
    }
  }

  const submitOrder = async (paymentId: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          PaymentId: paymentId,
        }),
      })

      const result = await response.json()
      if (result.success) {
        onSuccess(result.orderId)
      } else {
        onError(result.error || 'Order submission failed')
      }
    } catch (error) {
      onError('Order submission failed')
    } finally {
      setIsProcessing(false)
    }
  }

  console.log('PaymentForm render:', { stripe: !!stripe, clientSecret: !!clientSecret, isProcessing });

  if (!clientSecret) {
    return (
      <div className="space-y-6">
        <div className="p-4 border border-florida-sand-200 rounded-lg bg-florida-sand-50">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-florida-green-500 mr-2"></div>
            <span className="text-sm text-florida-green-600">Initializing payment...</span>
          </div>
        </div>
        <Button
          disabled
          className="w-full bg-gray-400 cursor-not-allowed"
        >
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-florida-sand-200 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full bg-florida-green-600 hover:bg-florida-green-700"
      >
        {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  )
}

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    sameAsShipping: true
  })

  const subtotal = state.total
  const shipping = subtotal >= 75 ? 0 : 8.99
  const tax = subtotal * 0.07 // 7% tax
  const total = subtotal + shipping + tax

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleBillingChange = (field: string, value: string | boolean) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentSuccess = (newOrderId: string) => {
    setOrderId(newOrderId)
    setOrderComplete(true)
    dispatch({ type: 'CLEAR_CART' })
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const orderData = {
    ShipToAddress: {
      FirstName: shippingInfo.firstName,
      LastName: shippingInfo.lastName,
      Line1: shippingInfo.address,
      City: shippingInfo.city,
      State: shippingInfo.state,
      PostalCode: shippingInfo.zipCode,
      CountryCode: shippingInfo.country === 'United States' ? 'US' : shippingInfo.country,
      Email: shippingInfo.email,
      Phone: shippingInfo.phone,
    },
    Items: state.items.map(item => ({
      Sku: `${item.id}-${item.size}-${item.frame}`,
      Quantity: item.quantity,
      ProductId: item.id,
      ProductName: item.title,
      Price: item.price,
      Size: item.size,
      Color: item.frame,
    })),
    CustomerEmail: shippingInfo.email,
    CustomerPhone: shippingInfo.phone,
    CurrencyCode: 'USD',
  }

  if (state.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-florida-display font-semibold text-florida-green-800 mb-4">
              Your cart is empty
            </h1>
            <p className="text-florida-green-600 mb-8">
              Add some beautiful prints to your cart before checking out.
            </p>
            <Button variant="florida" asChild>
              <Link href="/prints">
                Browse Prints
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CheckCircle2 className="h-16 w-16 text-florida-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-florida-display font-semibold text-florida-green-800 mb-4">
              Order Complete!
            </h1>
            <p className="text-lg text-florida-green-600 mb-2">
              Thank you for your purchase!
            </p>
            <p className="text-florida-green-600 mb-2">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
            <p className="text-florida-green-600 mb-8">
              Your order confirmation has been sent to {shippingInfo.email}
            </p>
            <div className="space-y-4">
              <Button variant="florida" asChild>
                <Link href={`/orders/${orderId}`}>
                  Track Your Order
                </Link>
              </Button>
              <div className="flex space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/prints">
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    Return Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-florida-sand-50/30">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/prints" 
            className="inline-flex items-center text-florida-green-600 hover:text-florida-green-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-florida-display font-semibold text-florida-green-800">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-florida-green-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <div className="relative w-16 h-20 rounded-md overflow-hidden bg-florida-sand-50">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute -top-1 -right-1 bg-florida-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-medium text-florida-green-800 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-florida-green-600">
                          {item.size} • {item.frame}
                        </p>
                        <p className="text-sm font-semibold text-florida-green-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="border-t border-florida-sand-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-florida-green-600">Subtotal</span>
                    <span className="text-florida-green-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-florida-green-600">Shipping</span>
                    <span className="text-florida-green-800">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-florida-green-600">Tax</span>
                    <span className="text-florida-green-800">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-florida-sand-200 pt-2">
                    <span className="text-florida-green-800">Total</span>
                    <span className="text-florida-green-800">${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="bg-florida-green-50 border border-florida-green-200 rounded-md p-3">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-florida-green-600 mr-2" />
                      <span className="text-sm text-florida-green-700 font-medium">
                        Free shipping included!
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="space-y-8">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-florida-green-800">
                    <span className="bg-florida-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-florida-green-800 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => handleShippingChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-florida-green-800 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => handleShippingChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-florida-green-800 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-florida-green-800 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-florida-green-800 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-florida-green-800 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-florida-green-800 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-florida-green-800 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-florida-green-800">
                    <span className="bg-florida-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  )}
                  
                  {(() => {
                    const isShippingComplete = shippingInfo.firstName && shippingInfo.lastName && shippingInfo.email && shippingInfo.address && shippingInfo.city && shippingInfo.state && shippingInfo.zipCode;
                    
                    const missingFields = [];
                    if (!shippingInfo.firstName) missingFields.push('First Name');
                    if (!shippingInfo.lastName) missingFields.push('Last Name');
                    if (!shippingInfo.email) missingFields.push('Email');
                    if (!shippingInfo.address) missingFields.push('Address');
                    if (!shippingInfo.city) missingFields.push('City');
                    if (!shippingInfo.state) missingFields.push('State');
                    if (!shippingInfo.zipCode) missingFields.push('ZIP Code');
                    
                    console.log('Shipping Info Debug:', {
                      isShippingComplete,
                      missingFields,
                      shippingInfo
                    });
                    
                                         if (isShippingComplete) {
                       if (!stripePromise) {
                         return (
                           <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                             <p className="text-sm text-red-800 text-center mb-2">
                               Payment system is not configured.
                             </p>
                             <p className="text-xs text-red-700 text-center">
                               Missing Stripe publishable key. Please check your environment variables.
                             </p>
                           </div>
                         );
                       }
                       
                       return (
                         <Elements stripe={stripePromise}>
                           <PaymentForm 
                             total={total}
                             orderData={orderData}
                             onSuccess={handlePaymentSuccess}
                             onError={handlePaymentError}
                           />
                         </Elements>
                       );
                    } else {
                      return (
                        <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                          <p className="text-sm text-yellow-800 text-center mb-2">
                            Please complete the shipping information above to continue with payment.
                          </p>
                          {missingFields.length > 0 && (
                            <p className="text-xs text-yellow-700 text-center">
                              Missing: {missingFields.join(', ')}
                            </p>
                          )}
                        </div>
                      );
                    }
                  })()}

                  <div className="bg-florida-blue-50 border border-florida-blue-200 rounded-md p-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-florida-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-florida-blue-800">
                          Secure Payment
                        </p>
                        <p className="text-xs text-florida-blue-600">
                          Your payment information is encrypted and secure
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-center text-florida-green-600">
                    By completing your order, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 