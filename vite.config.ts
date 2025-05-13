import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL ?? 'http://localhost:3003'),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'index.html'),
        results: path.resolve(__dirname, 'results.html'),
        contentScript: path.resolve(__dirname, 'src/contentScript.ts')
      },
      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'contentScript') return 'contentScript.js';
          return '[name].js';
        }
      }
    }
  }
});