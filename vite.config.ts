import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    base: '/Festa-da-Familia---2026/', // ✅ GitHub Pages (repo pages)
    plugins: [react()],
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV || mode),
    },
  };
});
