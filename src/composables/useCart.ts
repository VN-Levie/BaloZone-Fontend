import { ref, computed } from 'vue'
import type { Product } from '@/types'

export interface CartItem {
  id: number
  product: Product
  quantity: number
}

const cartItems = ref<CartItem[]>([])

export const useCart = () => {
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.value.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        id: Date.now(),
        product,
        quantity
      })
    }
  }

  const removeFromCart = (itemId: number) => {
    const index = cartItems.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    const item = cartItems.value.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const cartItemsCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  })

  const isInCart = (productId: number): boolean => {
    return cartItems.value.some(item => item.product.id === productId)
  }

  const getCartItemByProductId = (productId: number): CartItem | undefined => {
    return cartItems.value.find(item => item.product.id === productId)
  }

  return {
    cartItems: computed(() => cartItems.value),
    cartItemsCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemByProductId
  }
}
