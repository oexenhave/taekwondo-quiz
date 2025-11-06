import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages: set base to '/repository-name/'
  // For custom domain or root: set base to '/'
  base: process.env.NODE_ENV === 'production' ? '/taekwondo-quiz/' : '/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Seung Li Quiz',
        short_name: 'Seung Li Quiz',
        description: 'Øv Taekwondo teori og terminologi',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './',
        icons: [
          {
            src: './icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png}']
      }
    })
  ],
})
