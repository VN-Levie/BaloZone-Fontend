import { ref, computed } from 'vue'
import type { Product } from '@/types'

const wishlistItems = ref<Product[]>([])

export const useWishlist = () => {
  const addToWishlist = (product: Product) => {
    const exists = wishlistItems.value.find(item => item.id === product.id)
    if (!exists) {
      wishlistItems.value.push(product)
    }
  }

  const removeFromWishlist = (productId: number) => {
    const index = wishlistItems.value.findIndex(item => item.id === productId)
    if (index > -1) {
      wishlistItems.value.splice(index, 1)
    }
  }

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const clearWishlist = () => {
    wishlistItems.value = []
  }

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.value.some(item => item.id === productId)
  }

  const wishlistCount = computed(() => wishlistItems.value.length)

  return {
    wishlistItems: computed(() => wishlistItems.value),
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist
  }
}
