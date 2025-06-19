<template>
  <div class="image-zoom-container">
    <!-- Main Image -->
    <div 
      class="main-image-wrapper"
      @mousemove="handleMouseMove"
      @mouseenter="showZoom = true"
      @mouseleave="hideZoom"
      @click="openLightbox"
      ref="imageContainer"
    >
      <img 
        :src="currentImage" 
        :alt="alt"
        class="main-image"
        ref="mainImage"
        @load="onImageLoad"
      />
      
      <!-- Zoom lens -->
      <div 
        v-if="showZoom && !isMobile"
        class="zoom-lens"
        :style="lensStyle"
      ></div>
      
      <!-- Zoom indicator -->
      <div v-if="!isMobile" class="zoom-indicator">
        <i class="bi bi-zoom-in"></i>
        <span>Hover để zoom</span>
      </div>
      
      <!-- Mobile zoom indicator -->
      <div v-if="isMobile" class="mobile-zoom-indicator">
        <i class="bi bi-arrows-fullscreen"></i>
        <span>Chạm để xem toàn màn hình</span>
      </div>
      
      <!-- Image loading spinner -->
      <div v-if="!imageLoaded" class="image-loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    
    <!-- Zoomed Image (Desktop) -->
    <div 
      v-if="showZoom && !isMobile"
      class="zoom-preview"
      :style="zoomStyle"
    ></div>
    
    <!-- Thumbnail Images -->
    <div class="thumbnail-container" v-if="images.length > 1">
      <div class="thumbnail-scroll">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="thumbnail-item"
          :class="{ active: currentImage === image }"
          @click="setCurrentImage(image, index)"
        >
          <img :src="image" :alt="`${alt} ${index + 1}`" class="thumbnail-image" />
        </div>
      </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div 
      v-if="lightboxOpen" 
      class="lightbox-overlay"
      @click="closeLightbox"
    >
      <div class="lightbox-container" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">
          <i class="bi bi-x-lg"></i>
        </button>
        
        <!-- Navigation arrows -->
        <button 
          v-if="images.length > 1"
          class="lightbox-nav lightbox-prev"
          @click="previousImage"
          :disabled="currentImageIndex === 0"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        
        <button 
          v-if="images.length > 1"
          class="lightbox-nav lightbox-next"
          @click="nextImage"
          :disabled="currentImageIndex === images.length - 1"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
        
        <!-- Lightbox Image -->
        <div class="lightbox-image-container">
          <img 
            :src="currentImage" 
            :alt="alt"
            class="lightbox-image"
            ref="lightboxImage"
          />
        </div>
        
        <!-- Image Counter -->
        <div v-if="images.length > 1" class="lightbox-counter">
          {{ currentImageIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  images: string[]
  alt: string
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})

// Reactive state
const currentImageIndex = ref(props.initialIndex)
const showZoom = ref(false)
const lightboxOpen = ref(false)
const imageContainer = ref<HTMLElement>()
const mainImage = ref<HTMLImageElement>()
const lightboxImage = ref<HTMLImageElement>()
const imageLoaded = ref(false)

// Mouse position for zoom
const mouseX = ref(0)
const mouseY = ref(0)

// Computed properties
const currentImage = computed(() => props.images[currentImageIndex.value] || props.images[0])

const isMobile = computed(() => {
  return window.innerWidth <= 768
})

const lensStyle = computed(() => {
  const lensSize = 100
  return {
    left: `${mouseX.value - lensSize / 2}px`,
    top: `${mouseY.value - lensSize / 2}px`,
    width: `${lensSize}px`,
    height: `${lensSize}px`
  }
})

const zoomStyle = computed(() => {
  if (!imageContainer.value || !mainImage.value || !imageLoaded.value) {
    return { display: 'none' }
  }
  
  const containerRect = imageContainer.value.getBoundingClientRect()
  const imgRect = mainImage.value.getBoundingClientRect()
  
  // Calculate zoom position
  const zoomFactor = 2.5
  const backgroundX = -(mouseX.value * zoomFactor - 200)
  const backgroundY = -(mouseY.value * zoomFactor - 200)
  
  return {
    backgroundImage: `url(${currentImage.value})`,
    backgroundPosition: `${backgroundX}px ${backgroundY}px`,
    backgroundSize: `${imgRect.width * zoomFactor}px ${imgRect.height * zoomFactor}px`,
    left: `${containerRect.right + 20}px`,
    top: `${containerRect.top}px`
  }
})

// Methods
const handleMouseMove = (event: MouseEvent) => {
  if (!imageContainer.value) return
  
  const rect = imageContainer.value.getBoundingClientRect()
  mouseX.value = event.clientX - rect.left
  mouseY.value = event.clientY - rect.top
}

const hideZoom = () => {
  showZoom.value = false
}

const setCurrentImage = (image: string, index: number) => {
  if (currentImageIndex.value !== index) {
    imageLoaded.value = false
    currentImageIndex.value = index
  }
}

const openLightbox = () => {
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (currentImageIndex.value < props.images.length - 1) {
    imageLoaded.value = false
    currentImageIndex.value++
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    imageLoaded.value = false
    currentImageIndex.value--
  }
}

const onImageLoad = () => {
  imageLoaded.value = true
}

// Keyboard navigation
const handleKeyPress = (event: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.image-zoom-container {
  position: relative;
}

.main-image-wrapper {
  position: relative;
  cursor: zoom-in;
  overflow: hidden;
  border-radius: 12px;
  background: #f8f9fa;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image-wrapper:hover .main-image {
  transform: scale(1.02);
}

.zoom-lens {
  position: absolute;
  border: 2px solid #007bff;
  background: rgba(0, 123, 255, 0.1);
  pointer-events: none;
  border-radius: 50%;
  z-index: 10;
}

.zoom-preview {
  position: fixed;
  width: 400px;
  height: 400px;
  border: 2px solid #dee2e6;
  border-radius: 12px;
  background-repeat: no-repeat;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  z-index: 1000;
  pointer-events: none;
}

.zoom-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: opacity 0.3s ease;
}

.mobile-zoom-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.thumbnail-container {
  margin-top: 15px;
}

.thumbnail-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 5px 0;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thumbnail-item:hover {
  border-color: #007bff;
  transform: translateY(-2px);
}

.thumbnail-item.active {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.lightbox-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  animation: scaleIn 0.3s ease;
}

.lightbox-close {
  position: absolute;
  top: -50px;
  right: -10px;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(255,255,255,0.3);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px;
}

.lightbox-nav:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lightbox-prev {
  left: -70px;
}

.lightbox-next {
  right: -70px;
}

.lightbox-counter {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-image {
    height: 300px;
  }
  
  .zoom-preview {
    display: none !important;
  }
  
  .zoom-indicator {
    display: none;
  }
  
  .lightbox-nav {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .lightbox-prev {
    left: -50px;
  }
  
  .lightbox-next {
    right: -50px;
  }
  
  .lightbox-close {
    top: -40px;
    right: -5px;
    width: 35px;
    height: 35px;
  }
}

/* Scroll bar styling for thumbnails */
.thumbnail-scroll::-webkit-scrollbar {
  height: 6px;
}

.thumbnail-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.thumbnail-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.thumbnail-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
