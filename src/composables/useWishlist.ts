import { useWishlistStore } from '@/stores/wishlist'
import type { Product } from '@/types'

export const useWishlist = () => {
  const wishlistStore = useWishlistStore()

  return {
    // State from store
    wishlistItems: wishlistStore.items,
    wishlistCount: wishlistStore.wishlistCount,
    isEmpty: wishlistStore.isEmpty,
    
    // Actions from store
    addToWishlist: wishlistStore.addToWishlist,
    removeFromWishlist: wishlistStore.removeFromWishlist,
    toggleWishlist: wishlistStore.toggleWishlist,
    clearWishlist: wishlistStore.clearWishlist,
    isInWishlist: wishlistStore.isInWishlist
  }
}
