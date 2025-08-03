<template>
  <div class="admin-news-list">
    <h1 class="mb-4">Quản lý Tin Tức</h1>

    <div class="mb-3">
      <b-form-input
        v-model="searchQuery"
        placeholder="Tìm kiếm tin tức..."
        @input="fetchNews"
      />
    </div>

    <b-table :items="newsList" :fields="fields" striped hover>
      <template #cell(actions)="{ item }">
        <b-button size="sm" variant="primary" @click="editNews(item.id)">Sửa</b-button>
        <b-button size="sm" variant="danger" @click="deleteNews(item.id)">Xóa</b-button>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="totalNews"
      :per-page="perPage"
      @change="fetchNews"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminNews } from '@/composables/useAdminNews';

const { newsList, fetchNewsList, deleteNews } = useAdminNews();

const searchQuery = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const totalNews = ref(0);

const fields = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Tiêu đề' },
  { key: 'created_at', label: 'Ngày tạo' },
  { key: 'actions', label: 'Hành động' },
];

const fetchNews = async () => {
  await fetchNewsList({
    search: searchQuery.value,
    page: currentPage.value,
    per_page: perPage.value,
  });
};

const editNews = (id: number) => {
  console.log('Edit news:', id);
};

onMounted(fetchNews);
</script>

<style scoped>
.admin-news-list {
  padding: 20px;
}
</style>
