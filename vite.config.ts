import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite"
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@src": path.resolve(__dirname, "./src"),
        "@editor-document": path.resolve(__dirname, "./packages/editor-document"),
        "@editor-datasheet": path.resolve(__dirname, "./packages/editor-datasheet"),
        "@editor-spreadsheet": path.resolve(__dirname, "./packages/editor-spreadsheet"),
        "@components": path.resolve(__dirname, "./packages/components"),
      },
    },
  }
})
