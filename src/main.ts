import './registerServiceWorker'
import router from './router'
import store from './store'
import { createApp } from './client'

const { app } = createApp()
app.use(store).use(router).mount('#app')
