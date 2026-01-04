// vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///D:/projects/metaDataSearch/node_modules/.pnpm/vite@5.1.4_@types+node@20.11.24_sass@1.71.1/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/projects/metaDataSearch/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.4_vue@3.5.0/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///D:/projects/metaDataSearch/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.11.24_typescript@5.3.3_vite@5.1.4/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\projects\\metaDataSearch\\packages\\mcfacetbox";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: "src",
      outDir: "dist",
      insertTypesEntry: true,
      copyDtsFiles: true,
      include: ["src"]
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "MCFacetBox",
      fileName: (format) => `mcfacetbox.${format === "umd" ? "umd.cjs" : "es.js"}`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["vue", "vuetify"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          vuetify: "Vuetify"
        }
      }
    },
    sourcemap: true,
    target: "es2018",
    emptyOutDir: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxtZXRhRGF0YVNlYXJjaFxcXFxwYWNrYWdlc1xcXFxtY2ZhY2V0Ym94XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxtZXRhRGF0YVNlYXJjaFxcXFxwYWNrYWdlc1xcXFxtY2ZhY2V0Ym94XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9wcm9qZWN0cy9tZXRhRGF0YVNlYXJjaC9wYWNrYWdlcy9tY2ZhY2V0Ym94L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgZHRzKHtcclxuICAgICAgZW50cnlSb290OiAnc3JjJyxcclxuICAgICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXHJcbiAgICAgIGNvcHlEdHNGaWxlczogdHJ1ZSxcclxuICAgICAgaW5jbHVkZTogWydzcmMnXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxyXG4gICAgICBuYW1lOiAnTUNGYWNldEJveCcsXHJcbiAgICAgIGZpbGVOYW1lOiBmb3JtYXQgPT4gYG1jZmFjZXRib3guJHtmb3JtYXQgPT09ICd1bWQnID8gJ3VtZC5janMnIDogJ2VzLmpzJ31gLFxyXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ3VtZCddLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFsndnVlJywgJ3Z1ZXRpZnknXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZXhwb3J0czogJ25hbWVkJyxcclxuICAgICAgICBnbG9iYWxzOiB7XHJcbiAgICAgICAgICB2dWU6ICdWdWUnLFxyXG4gICAgICAgICAgdnVldGlmeTogJ1Z1ZXRpZnknLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgdGFyZ2V0OiAnZXMyMDE4JyxcclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1UsT0FBTyxVQUFVO0FBQ3ZWLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFNBQVM7QUFIaEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osSUFBSTtBQUFBLE1BQ0YsV0FBVztBQUFBLE1BQ1gsUUFBUTtBQUFBLE1BQ1Isa0JBQWtCO0FBQUEsTUFDbEIsY0FBYztBQUFBLE1BQ2QsU0FBUyxDQUFDLEtBQUs7QUFBQSxJQUNqQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQzdDLE1BQU07QUFBQSxNQUNOLFVBQVUsWUFBVSxjQUFjLFdBQVcsUUFBUSxZQUFZLE9BQU87QUFBQSxNQUN4RSxTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsSUFDdkI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxPQUFPLFNBQVM7QUFBQSxNQUMzQixRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUEsVUFDTCxTQUFTO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsRUFDZjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
