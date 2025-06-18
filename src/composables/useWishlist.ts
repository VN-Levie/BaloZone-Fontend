import { useWishlistStore } from '@/stores/wishlist'
import { computed } from 'vue'
import type { Product } from '@/types'

export const useWishlist = () => {
  const wishlistStore = useWishlistStore()

  return {
    // State from store - wrapped in computed to ensure reactivity
    wishlistItems: computed(() => wishlistStore.items),
    wishlistCount: computed(() => wishlistStore.wishlistCount),
    isEmpty: computed(() => wishlistStore.isEmpty),
    
    // Actions from store
    addToWishlist: wishlistStore.addToWishlist,
    removeFromWishlist: wishlistStore.removeFromWishlist,
    toggleWishlist: wishlistStore.toggleWishlist,
    clearWishlist: wishlistStore.clearWishlist,
    isInWishlist: wishlistStore.isInWishlist
  }
}
