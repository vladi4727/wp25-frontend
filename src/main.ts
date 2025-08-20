import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
  unstyled: true,
})

app.use(pinia)
app.use(router)

app.mount('#app')
