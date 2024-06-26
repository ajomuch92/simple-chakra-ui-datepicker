import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  server: {
    port: 5172,
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'simple-chakra-ui-datepicker',
      formats: ['es', 'umd'],
      fileName: (format) => `simple-chakra-ui-datepicker.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@chakra-ui/react', '@chakra-ui/icons'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@chakra-ui/react': '@chakra-ui/react',
          '@chakra-ui/icons': '@chakra-ui/icons'
        },
      },
    },
  },
})
