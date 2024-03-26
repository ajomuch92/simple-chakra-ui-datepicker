import react from '@vitejs/plugin-react';
import { resolve } from 'path'
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    server: {
      port: 5172
    },
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    build: {
        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'simple-chakra-ui-datepicker',
          formats: ['es', 'umd'],
          fileName: (format) => `simple-chakra-ui-datepicker.${format}.js`,
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
    },
});