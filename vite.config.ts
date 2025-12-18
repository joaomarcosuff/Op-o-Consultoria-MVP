import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Explicitly importing process from node:process fixes the error: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Isso permite que o código use process.env.API_KEY no navegador
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
