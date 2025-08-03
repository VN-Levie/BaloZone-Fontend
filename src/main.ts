import './assets/main.css'
import './assets/admin-enhanced.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { BButton, BModal, BCard, BRow, BCol, BForm, BFormInput, BFormGroup, BFormTextarea, BFormInvalidFeedback, BFormText, BPagination } from 'bootstrap-vue-next'

import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { setupAuthWatcher } from './utils/authWatcher'
// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// Initialize authentication after Pinia is set up
const authStore = useAuthStore()
authStore.initializeAuth()

// Setup auth watcher for reactive updates
setupAuthWatcher()

app.mount('#app')
