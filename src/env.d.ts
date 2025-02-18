/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string
  // altre variabili d'ambiente se necessarie
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_GITHUB_TOKEN: string
    // altre variabili d'ambiente se necessarie
  }
} 