<template>
  <div class="contacts-stats">
    <div class="row g-3">
      <div class="col-md-3">
        <AdminStatsCard
          label="Tổng liên hệ"
          :value="stats.total"
          icon="bi-envelope"
          color="primary"
          format="number"
        />
      </div>
      <div class="col-md-3">
        <AdminStatsCard
          label="Chờ xử lý"
          :value="stats.pending"
          icon="bi-clock"
          color="warning"
          format="number"
        />
      </div>
      <div class="col-md-3">
        <AdminStatsCard
          label="Đã giải quyết"
          :value="stats.resolved"
          icon="bi-check-circle"
          color="success"
          format="number"
        />
      </div>
      <div class="col-md-3">
        <AdminStatsCard
          label="Hôm nay"
          :value="stats.today"
          icon="bi-calendar-day"
          color="info"
          format="number"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AdminStatsCard from './AdminStatsCard.vue'

interface ContactStats {
  total: number
  pending: number
  resolved: number
  today: number
}

interface Props {
  contacts: any[]
}

const props = defineProps<Props>()

const stats = computed((): ContactStats => {
  const today = new Date().toDateString()

  return {
    total: props.contacts.length,
    pending: props.contacts.filter(c => c.status === 'pending').length,
    resolved: props.contacts.filter(c => c.status === 'resolved').length,
    today: props.contacts.filter(c => {
      const contactDate = new Date(c.created_at).toDateString()
      return contactDate === today
    }).length
  }
})
</script>

<style scoped>
.contacts-stats {
  margin-bottom: 1.5rem;
}
</style>
