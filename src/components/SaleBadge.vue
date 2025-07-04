<template>
  <div 
    v-if="showBadge"
    class="sale-badge"
    :class="[variant, size]"
  >
    <template v-if="variant === 'discount'">
      -{{ discountPercentage }}%
    </template>
    <template v-else-if="variant === 'sale'">
      SALE
    </template>
    <template v-else-if="variant === 'hot'">
      HOT
    </template>
    <template v-else-if="variant === 'new'">
      NEW
    </template>
    <template v-else>
      {{ customText }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'discount' | 'sale' | 'hot' | 'new' | 'custom'
  size?: 'small' | 'medium' | 'large'
  discountPercentage?: number
  customText?: string
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'sale',
  size: 'medium',
  discountPercentage: 0,
  customText: '',
  show: true
})

const showBadge = computed(() => {
  if (!props.show) return false
  if (props.variant === 'discount' && props.discountPercentage <= 0) return false
  if (props.variant === 'custom' && !props.customText) return false
  return true
})
</script>

<style scoped>
.sale-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  border-radius: 6px;
  position: absolute;
  z-index: 10;
  background-color: #ef4444;
  font-size: 12px;
  padding: 4px 8px;
  top: 8px;
  left: 8px;
}

.sale-badge.small {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.sale-badge.medium {
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 6px;
}

.sale-badge.large {
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 8px;
}

.sale-badge.discount {
  background-color: #ef4444;
}

.sale-badge.sale {
  background-color: #f97316;
}

.sale-badge.hot {
  background-color: #ec4899;
}

.sale-badge.new {
  background-color: #22c55e;
}

.sale-badge.custom {
  background-color: #3b82f6;
}
</style>
