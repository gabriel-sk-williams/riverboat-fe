import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      include: [''],
      globals: {
        Buffer: true,
        global: false,
        process: false
      }
    }),
    react()
  ],
})
