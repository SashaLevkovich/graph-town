import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), svgr(), tsconfigPaths(), checker({ typescript: true })],
    exclude: ['stats.js'],
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  }
})
