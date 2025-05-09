import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/contentScript.js', // desde src
          dest: '.' // copiar directo a dist/
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'index.html'),
        results: path.resolve(__dirname, 'results.html')
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});