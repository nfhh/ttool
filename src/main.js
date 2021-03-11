import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import DKToast from 'vue-dk-toast'

createApp(App).use(store).use(router).use(DKToast).mount('#app')
