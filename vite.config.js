import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Two ways to talk to the NestJS backend in dev — pick one:
//
// A) Proxy (recommended, zero CORS setup needed):
//    Leave VITE_API_URL empty/unset. Requests to /auth and /books from
//    the frontend get transparently forwarded to localhost:3000 by Vite
//    itself, so the browser never sees a cross-origin request.
//
// B) Direct (requires backend CORS):
//    Set VITE_API_URL=http://localhost:3000 in a .env file, and add
//    app.enableCors() in your NestJS main.ts. Remove the proxy block
//    below if you go this route — it's harmless to leave either way.

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/books': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
