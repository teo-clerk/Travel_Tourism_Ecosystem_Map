import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
/**
 * Vite Configuration
 * Configures the build tool and development server.
 * We use the React plugin to handle JSX/TSX transformation.
 */
export default defineConfig({
  plugins: [react()],
})
