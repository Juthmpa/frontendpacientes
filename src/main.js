import { createApp, h } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import RolesProvider from './components/RolesProvider.vue'

createApp({
    render() {
        return h(RolesProvider, null, {
            default: () => h(App)
        })
    }
})
.use(router)
.mount('#app')


