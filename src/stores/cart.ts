import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/types'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])

  // Getters
  const cartItemsCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalAmount = computed(() =>
    items.value.reduce((total, item) => {
      const price = item.product.originalPrice || item.product.price
      return total + (price * item.quantity)
    }, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const addToCart = (product: Product, quantity: number = 1, options?: { size?: string }) => {
    const existingItemIndex = items.value.findIndex(item => 
      item.product.id === product.id &&
      item.selectedSize === options?.size
    )

    if (existingItemIndex > -1) {
      items.value[existingItemIndex].quantity += quantity
    } else {
      items.value.push({
        product,
        quantity,
        selectedSize: options?.size
      })
    }

    // Persist to localStorage
    saveToStorage()
  }

  const removeFromCart = (productId: number, size?: string) => {
    const index = items.value.findIndex(item => 
      item.product.id === productId &&
      item.selectedSize === size
    )
    
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  const updateQuantity = (productId: number, quantity: number, size?: string) => {
    const item = items.value.find(item => 
      item.product.id === productId &&
      item.selectedSize === size
    )
    
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId, size)
      } else {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    saveToStorage()
  }

  const isInCart = (productId: number, size?: string) => {
    return items.value.some(item => 
      item.product.id === productId &&
      item.selectedSize === size
    )
  }

  const getCartItem = (productId: number, size?: string) => {
    return items.value.find(item => 
      item.product.id === productId &&
      item.selectedSize === size
    )
  }

  const saveToStorage = () => {
    localStorage.setItem('cart_items', JSON.stringify(items.value))
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('cart_items')
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error)
      items.value = []
    }
  }

  // Initialize from localStorage
  loadFromStorage()

  return {
    // State
    items: computed(() => items.value),
    
    // Getters
    cartItemsCount,
    totalAmount,
    isEmpty,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
    loadFromStorage
  }
})
