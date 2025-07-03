'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface OrderStatus {
  orderId: string
  status: 'processing' | 'in_production' | 'shipped' | 'delivered'
  createdAt: string
  items: Array<{
    name: string
    quantity: number
    price: number
    size?: string
    color?: string
  }>
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  total: number
}

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus()
    }
  }, [orderId])

  const fetchOrderStatus = async () => {
    try {
      // In a real implementation, this would call your order tracking API
      // For now, we'll simulate order status
      const mockOrder: OrderStatus = {
        orderId: orderId,
        status: 'in_production',
        createdAt: new Date().toISOString(),
        items: [
          {
            name: 'Florida Surf Break Poster',
            quantity: 1,
            price: 29.99,
            size: '16x20',
            color: 'Framed'
          }
        ],
        shippingAddress: {
          name: 'John Doe',
          address: '123 Ocean Ave',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101'
        },
        total: 37.98,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      }
      
      setOrder(mockOrder)
    } catch (err) {
      setError('Failed to load order status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'in_production':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-green-500" />
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Order Processing'
      case 'in_production':
        return 'In Production'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      default:
        return 'Unknown Status'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-florida-green-500 mx-auto mb-4"></div>
            <p className="text-florida-green-600">Loading order status...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-florida-display font-semibold text-florida-green-800 mb-4">
              Order Not Found
            </h1>
            <p className="text-florida-green-600 mb-8">
              {error || 'The order you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Button variant="florida" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-florida-sand-50/30">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-florida-green-600 hover:text-florida-green-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-florida-display font-semibold text-florida-green-800">
            Order Tracking
          </h1>
          <p className="text-florida-green-600 mt-2">
            Order #{order.orderId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-florida-green-800">
                  {getStatusIcon(order.status)}
                  <span className="ml-3">{getStatusText(order.status)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-florida-green-600">Order Date:</span>
                    <span className="text-florida-green-800 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {order.estimatedDelivery && (
                    <div className="flex justify-between items-center">
                      <span className="text-florida-green-600">Estimated Delivery:</span>
                      <span className="text-florida-green-800 font-medium">
                        {order.estimatedDelivery}
                      </span>
                    </div>
                  )}
                  
                  {order.trackingNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-florida-green-600">Tracking Number:</span>
                      <span className="text-florida-green-800 font-medium">
                        {order.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-florida-green-800">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-florida-sand-200 last:border-b-0">
                      <div>
                        <h4 className="font-medium text-florida-green-800">{item.name}</h4>
                        <p className="text-sm text-florida-green-600">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </p>
                        <p className="text-sm text-florida-green-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-florida-green-800">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-florida-green-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-florida-green-600">Total</span>
                    <span className="font-semibold text-florida-green-800">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-florida-green-800">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-florida-green-600">
                  <p className="font-medium text-florida-green-800">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-florida-green-800">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-florida-green-600 mb-4">
                  Questions about your order? Contact our support team.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 