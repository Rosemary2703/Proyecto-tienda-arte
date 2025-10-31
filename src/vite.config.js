import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Aseguramos que las variables se carguen desde la raíz, aunque es el comportamiento por defecto
  envDir: './', 
});
