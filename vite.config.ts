import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  // Normalize context path to always end with '/'
  const ctx = (env.VITE_FRONTEND_CONTEXT_PATH || '/').replace(/\/?$/, '/')
  const proxyApi = `${ctx}api`

  // 根據環境變數決定是否啟用 HTTPS
  const isHttpsEnabled = env.VITE_HTTPS_ENABLED === 'true'
  const host = env.VITE_HOST || 'localhost'

  // HTTPS 配置
  let httpsConfig = undefined
  if (isHttpsEnabled) {
    // 證書路徑配置
    const certsDir = path.resolve(__dirname, 'certs')
    const certPath = path.join(certsDir, 'cert.pem')
    const keyPath = path.join(certsDir, 'key.pem')
    
    // 檢查證書檔案是否存在
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      httpsConfig = {
        key: fs.readFileSync(keyPath, 'utf8'),
        cert: fs.readFileSync(certPath, 'utf8')
      }
    } else {
      console.warn('HTTPS 证书文件不存在，回退到 HTTP')
    }
  }

  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      mode === 'development' && vueDevTools() // only in dev
    ],
    //進行自動化測試需把vueDevTools()註解，防止爬蟲誤觸
    // plugins: [vue(), vueJsx()],
    server: {
      port: Number(env.VITE_FRONTEND_PORT) || 3000, // Access the VITE_PORT variable
      host: host,
      https: httpsConfig,
      proxy: {
        // Dev-only
        [proxyApi]: {
          target: env.VITE_BACKEND_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(new RegExp(`^${proxyApi}`), '/api')
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~coreui': resolve(__dirname, 'node_modules/@coreui/coreui')
      }
    }
  }
})
