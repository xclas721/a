import { createApp } from 'vue'

import App from './App.vue'
// Poppins font local import (OFL open source)
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
// Noto Sans SC (OFL open source)
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/600.css'
import '@fontsource/noto-sans-sc/700.css'
// Inter font (OFL open source)
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'simplebar-vue/dist/simplebar.min.css'
import 'simplebar-vue/dist/simplebar-vue.js'
import 'remixicon/fonts/remixicon.css'
import './styles/style.scss'
import '@coreui/icons/css/all.min.css'
import setupPlugins from '@/plugins'

const app = createApp(App)

app.use(setupPlugins)
app.mount('#app')
