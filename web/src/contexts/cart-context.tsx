'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface CartItem {
  id: string
  title: string
  style: string
  price: number
  originalPrice?: number
  image: string
  size: string
  frame: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> & { id: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload
      const existingItemIndex = state.items.findIndex(
        item => item.id === newItem.id && item.size === newItem.size && item.frame === newItem.frame
      )

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      } else {
        // New item, add to cart with unique ID based on product + variants
        const cartItemId = `${newItem.id}-${newItem.size}-${newItem.frame}`
        newItems = [...state.items, { ...newItem, id: cartItemId }]
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
        isOpen: true
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'CLEAR_CART':
      return initialState

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      }

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      }

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 