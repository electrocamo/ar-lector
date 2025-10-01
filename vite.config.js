import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'ar-lector'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  server: {
    host: true, // o '0.0.0.0' para aceptar todas las IPs externas
    port: 5173,
    strictPort: true, // evita cambiar de puerto automáticamente

    // Opcional: restringe a ciertos hostnames
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok.io', // permite todos los subdominios de ngrok
      '02c2-2800-e2-2880-c54-dc37-f505-a81-9a98.ngrok-free.app', // subdominio específico, si lo prefieres
      '75a2-2800-e2-2880-c54-f84f-1e9-1b24-2be9.ngrok-free.app' 
    ]
  }
})
