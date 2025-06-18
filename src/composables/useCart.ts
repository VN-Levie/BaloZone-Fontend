import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'
import type { Product } from '@/types'

export const useCart = () => {
  const cartStore = useCartStore()

  const addToCart = (product: Product, quantity: number = 1, options?: { size?: string }) => {
    cartStore.addToCart(product, quantity, options)
  }

  const removeFromCart = (productId: number, size?: string) => {
    cartStore.removeFromCart(productId, size)
  }

  const updateQuantity = (productId: number, quantity: number, size?: string) => {
    cartStore.updateQuantity(productId, quantity, size)
  }

  return {
    // State from store - wrapped in computed to ensure reactivity
    cartItems: computed(() => cartStore.items),
    cartItemsCount: computed(() => cartStore.cartItemsCount),
    totalAmount: computed(() => cartStore.totalAmount),
    isEmpty: computed(() => cartStore.isEmpty),
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: cartStore.clearCart,
    isInCart: cartStore.isInCart,
    getCartItem: cartStore.getCartItem
  }
}
