import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Vite Config Environment:', {
    mode,
    token: env.VITE_GITHUB_TOKEN ? 'present' : 'missing'
  })

  return {
    plugins: [react()],
    base: '/',  // Importante per il routing in produzione
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envDir: './',
    envPrefix: 'VITE_',
    define: {
      'process.env.VITE_GITHUB_TOKEN': JSON.stringify(env.VITE_GITHUB_TOKEN),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    build: {
      sourcemap: true,  // Per debug in produzione
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'leaflet', 'react-leaflet'],
          },
        },
      },
    }
  }
}) 