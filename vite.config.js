import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Sport Calendar',
        short_name: 'Calendario',
        description: 'Mi Calendario de Entrenamientos y Partidos',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone', // <-- ¡CLAVE! Hace que abra a pantalla completa como app nativa
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa.jpeg',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa.jpeg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})