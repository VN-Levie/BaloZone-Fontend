import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

export const useCart = () => {
  const cartStore = useCartStore()

  const addToCart = (product: Product, quantity: number = 1, options?: { size?: string, color?: string }) => {
    cartStore.addToCart(product, quantity, options)
  }

  const removeFromCart = (productId: number, size?: string, color?: string) => {
    cartStore.removeFromCart(productId, size, color)
  }

  const updateQuantity = (productId: number, quantity: number, size?: string, color?: string) => {
    cartStore.updateQuantity(productId, quantity, size, color)
  }

  return {
    // State from store
    cartItems: cartStore.items,
    cartItemsCount: cartStore.cartItemsCount,
    totalAmount: cartStore.totalAmount,
    isEmpty: cartStore.isEmpty,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: cartStore.clearCart,
    isInCart: cartStore.isInCart,
    getCartItem: cartStore.getCartItem
  }
}
