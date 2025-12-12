import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      insertTypesEntry: true,
      copyDtsFiles: true,
      include: ['src'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MCFacetBox',
      fileName: format => `mcfacetbox.${format === 'umd' ? 'umd.cjs' : 'es.js'}`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'vuetify', 'vuetify/labs/VTreeview'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify',
          VTreeview: 'VTreeview',
        },
      },
    },
    sourcemap: true,
    target: 'es2018',
    emptyOutDir: true,
  },
})
