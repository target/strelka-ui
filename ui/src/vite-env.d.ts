/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_DEFAULT_EXCLUDED_SUBMITTERS: string
  readonly VITE_VIRUSTOTAL_API_KEY: string
  readonly VITE_SEARCH_URL: string
  readonly VITE_SEARCH_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
