import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@components': fileURLToPath(
        new URL('./src/lib/components', import.meta.url)
      ),
      '@stores': fileURLToPath(new URL('./src/lib/stores', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/lib/utils', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },

  server: {
    open: './src/popup/',
  },

  build: {
    rollupOptions: {
      input: {
        popup: fileURLToPath(
          new URL('./src/popup/index.html', import.meta.url)
        ),
        offscreen: fileURLToPath(
          new URL('./src/offscreen/index.html', import.meta.url)
        ),
      },
    },
  },
})
