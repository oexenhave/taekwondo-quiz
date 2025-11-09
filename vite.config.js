import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'

// Read version from package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const majorVersion = pkg.version.split('.')[0]

// Generate build timestamp
const buildTimestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages: set base to '/repository-name/'
  // For custom domain or root: set base to '/'
  base: process.env.NODE_ENV === 'production' ? '/taekwondo-quiz/' : '/',

  // Inject version and build timestamp as global constants
  define: {
    __APP_VERSION__: JSON.stringify(majorVersion),
    __BUILD_DATE__: JSON.stringify(buildTimestamp)
  },

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Seung Li Taekwondo Quiz',
        short_name: 'Seung Li Taekwondo Quiz',
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
