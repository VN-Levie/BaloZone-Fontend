import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {createBootstrap} from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// Import từng component
import {
  BNavbar,
  BNavbarNav,
  BNavbarBrand,
  BNavbarToggle,
  BCollapse,
  BNavItem
} from 'bootstrap-vue-next'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createBootstrap())
app.component('BNavbar', BNavbar)
app.component('BNavbarNav', BNavbarNav)
app.component('BNavbarBrand', BNavbarBrand)
app.component('BNavbarToggle', BNavbarToggle)
app.component('BCollapse', BCollapse)
app.component('BNavItem', BNavItem)
app.mount('#app')
