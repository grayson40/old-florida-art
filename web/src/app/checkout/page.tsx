'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/cart-context'
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle2 } from 'lucide-react'

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [orderComplete, setOrderComplete] = useState(false)
  
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
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
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

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleCompleteOrder = () => {
    setOrderComplete(true)
    dispatch({ type: 'CLEAR_CART' })
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
              <Link href="/posters">
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
            <p className="text-florida-green-600 mb-8">
              Your order confirmation has been sent to {shippingInfo.email}
            </p>
            <div className="space-y-4">
              <Button variant="florida" asChild>
                <Link href="/posters">
                  Continue Shopping
                </Link>
              </Button>
              <div>
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
            href="/posters" 
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
                  <div>
                    <label className="block text-sm font-medium text-florida-green-800 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-florida-green-800 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                        className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-florida-green-800 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-florida-green-800 mb-1">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                      className="w-full px-3 py-2 border border-florida-sand-300 rounded-md focus:ring-2 focus:ring-florida-green-500 focus:border-transparent"
                    />
                  </div>

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
                </CardContent>
              </Card>

              {/* Complete Order */}
              <div className="space-y-4">
                <Button
                  variant="florida"
                  size="lg"
                  className="w-full text-lg py-6"
                  onClick={handleCompleteOrder}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Complete Order - ${total.toFixed(2)}
                </Button>
                
                <p className="text-xs text-center text-florida-green-600">
                  By completing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 