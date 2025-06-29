import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // or host: '0.0.0.0'
    // port: 3000, // Optional
  },
   resolve: {
    alias: {
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@components': path.resolve(__dirname, 'components'),
    },
  },
})









// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
