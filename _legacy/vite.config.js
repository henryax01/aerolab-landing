const { resolve } = require('path');
const { defineConfig } = require('vite');
const tailwindcss = require('@tailwindcss/vite').default;

module.exports = defineConfig({
  root: '.',
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        order: resolve(__dirname, 'order.html'),
        contact: resolve(__dirname, 'contact.html'),
        account: resolve(__dirname, 'account.html')
      }
    }
  }
});
