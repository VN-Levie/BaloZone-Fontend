import { ref } from 'vue';
import { adminNewsApi } from '@/services/api';
import type { News, NewsForm } from '@/types';

export function useAdminNews() {
  const newsList = ref<News[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch news list
  const fetchNewsList = async (params: { search?: string; page?: number; per_page?: number }) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await adminNewsApi.getNews(params);
      newsList.value = response.data.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch news list';
    } finally {
      isLoading.value = false;
    }
  };

  // Create news
  const createNews = async (formData: NewsForm) => {
    try {
      const response = await adminNewsApi.createNews(formData);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create news');
    }
  };

  // Update news
  const updateNews = async (id: number, formData: Partial<NewsForm>) => {
    try {
      const response = await adminNewsApi.updateNews(id, formData);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update news');
    }
  };

  // Delete news
  const deleteNews = async (id: number) => {
    try {
      const response = await adminNewsApi.deleteNews(id);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete news');
    }
  };

  return {
    newsList,
    isLoading,
    error,
    fetchNewsList,
    createNews,
    updateNews,
    deleteNews,
  };
}
