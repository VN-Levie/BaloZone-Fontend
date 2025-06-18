import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/types'

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const items = ref<Product[]>([])

  // Getters
  const wishlistCount = computed(() => items.value.length)
  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const addToWishlist = (product: Product) => {
    const exists = items.value.find(item => item.id === product.id)
    if (!exists) {
      items.value.push(product)
      saveToStorage()
    }
  }

  const removeFromWishlist = (productId: number) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
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
    items.value = []
    saveToStorage()
  }

  const isInWishlist = (productId: number) => {
    return items.value.some(item => item.id === productId)
  }

  const saveToStorage = () => {
    localStorage.setItem('wishlist_items', JSON.stringify(items.value))
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('wishlist_items')
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load wishlist from storage:', error)
      items.value = []
    }
  }

  // Initialize from localStorage
  loadFromStorage()

  return {
    // State
    items: computed(() => items.value),
    
    // Getters
    wishlistCount,
    isEmpty,
    
    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    loadFromStorage
  }
})
