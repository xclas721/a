interface ImportMetaEnv {
  readonly VITE_API_TIMEOUT: string
  // Add other variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
