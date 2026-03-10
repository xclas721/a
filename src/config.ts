// src/config.ts
// Only public variables can be set here, do not place secrets
// Mainly used to package this into an image and behave differently based on env vars

export type PublicConfigNames =
  | 'API_BASE_URL'
  | 'FRONTEND_CONTEXT_PATH'
  | 'FRONTEND_PORT'
  | 'BACKEND_API_TIMEOUT'
  | 'PAGE_SIZE'
  | 'STAGE'
  | 'SYSTEM_ID'
  | 'BACKEND_CONTEXT_PATH'

export type PublicConfig = Record<PublicConfigNames, any>

// (optional) type the global bootstrap object
declare global {
  interface Window {
    __APP_CONFIG__?: Partial<PublicConfig>
  }
}

const R = (window as any).__APP_CONFIG__ ?? {}

export const appConfig: PublicConfig = {
  API_BASE_URL:
    R.API_BASE_URL ??
    import.meta.env.VITE_API_BASE_URL ?? // dev fallback
    'http://localhost:8080/threedsserver-admin',
  FRONTEND_CONTEXT_PATH: R.FRONTEND_CONTEXT_PATH ?? import.meta.env.VITE_FRONTEND_CONTEXT_PATH ?? '/',
  FRONTEND_PORT: R.FRONTEND_PORT ?? import.meta.env.VITE_FRONTEND_PORT ?? '8081',
  BACKEND_API_TIMEOUT: Number(R.BACKEND_API_TIMEOUT ?? import.meta.env.VITE_BACKEND_API_TIMEOUT ?? 60000),
  PAGE_SIZE: Number(R.PAGE_SIZE ?? import.meta.env.VITE_PAGE_SIZE ?? 10),
  //PAGE_SIZE: Number(R.PAGE_SIZE ?? 10),
  STAGE: R.STAGE ?? import.meta.env.MODE ?? 'dev',
  SYSTEM_ID: R.SYSTEM_ID ?? import.meta.env.VITE_SYSTEM_ID ?? 'HiTRUST3DS',
  BACKEND_CONTEXT_PATH: R.BACKEND_CONTEXT_PATH ?? import.meta.env.VITE_BACKEND_CONTEXT_PATH ?? ''
}

// # Frontend application running port
// VITE_FRONTEND_PORT=8081
// # Frontend application context path (base path when deployed)
// VITE_FRONTEND_CONTEXT_PATH=/threedsserver-admin/
// # Base URL for frontend calling backend API (may be used for AJAX requests)
// VITE_API_BASE_URL=http://localhost:8081/threedsserver-admin
// # Backend API server address (used for proxy or direct backend request)
// VITE_BACKEND_API_URL='http://127.0.0.1:8060/threedsserver-admin-backend'
// # Backend API request timeout (unit: ms, 240000 ms = 4 minutes)
// VITE_BACKEND_API_TIMEOUT=240000
// # Default number of items per page for frontend pagination
// VITE_PAGE_SIZE=5
