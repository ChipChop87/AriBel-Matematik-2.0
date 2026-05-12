import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'AriBel-Matematik 2.0',
        short_name: 'AriBel-Math',
        description: 'Matematik-app för Ariel & Belle',
        theme_color: '#3b82f6',
        icons: [
          {
            src: 'icons.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'icons.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
