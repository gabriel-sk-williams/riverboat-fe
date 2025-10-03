import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


import svgr from 'vite-plugin-svgr' 

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
    react(),
    svgr({ 
      svgrOptions: {
        // svgr options
      },
    }),
  ],
})
