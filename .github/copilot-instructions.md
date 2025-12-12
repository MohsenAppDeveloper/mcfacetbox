## AI Coding Agent Instructions (Vue 3 + Vite + Vuetify)

### Core Architecture
- Entry: `src/main.ts` registers `no-context-menu`, installs Toast + ContextMenu, then `registerPlugins(app)` from `@core/utils/plugins` (auto-loads `src/plugins/*` and `*/index.ts`). Keep this order.
- Global styles load before mount: `@/assets/fonts`, `@core/scss/template`, `@styles/styles.scss`, plus `mcfacetbox/style.css`.
- Runtime helpers in `@core/initCore.ts`: `_syncAppRtl`, `_handleSkinChanges`, `_syncInitialLoaderTheme`. Extend these instead of duplicating logic.

### Routing & Layouts
- Auto routes via `unplugin-vue-router`; names are PascalCase → kebab-case (see `vite.config.ts:getRouteName`). Place pages in `src/pages/**`.
- Layouts via `vite-plugin-vue-layouts` with files under `src/layouts/**`; select via route meta when needed.

### Auto‑Imports & Aliases
- Auto-imports configured in `vite.config.ts`: Vue, Vue Router, `@vueuse/*`, `vue-i18n`, Pinia and dirs: `src/@core/{utils,composable}`, `src/composables`, `src/utils`, `src/plugins/*/composables/*`.
- `ignore: ['useCookies','useStorage']` → import these manually when used.
- Aliases: `@`, `@core`, `@layouts`, `@themeConfig`, `@store`, `@images`, `@styles`, `@db`, `@api-utils`, `@types`, `@models`.

### State & Virtual Tree Pattern
- Pinia stores use composition API (see `src/store/treeStoreV3.ts`). Storage uses `shallowReactive Map/Set` for O(1) access and `markRaw` objects.
- Compute visible rows via `flatVisibleNodes` using `expandedNodes` + `loadedNodes` for virtual scrolling.
- Always update immutably with `updateNode(...)` and maintain invariants: `hasChildren`, `isDescendant`, and sibling order by `priority`.
- CRUD/move/merge helpers provided by store; UI flags (`editing`, `loading`, `failed`, `highlighted`, `selected`) live on flat nodes.

### Plugins & Globals
- Vuetify configured in `src/plugins/vuetify/**` with SCSS variables at `src/assets/styles/variables/_vuetify.scss`.
- i18n in `src/plugins/i18n/**`; locales loaded by `@intlify/unplugin-vue-i18n` from `src/plugins/i18n/locales/**`.
- CASL ability plugin in `src/plugins/casl/**` exposes `useAbility()`; initial rules read from `useCookie('userAbilityRules')`.
- `registerPlugins(app)` auto-loads all `src/plugins/*`; add integrations there, not in components.

### API & Data
- Use `src/composables/useApi.ts` (`@vueuse/core` createFetch wrapper). Base URL `import.meta.env.VITE_API_URL || '/api'`. Adds `Accept-Language` and `Authorization` from `accessToken` cookie; handles 401/403.
- Fake API helpers aliased as `@db` and `@api-utils` under `src/plugins/fake-api/**` when mocking.

### Build, Lint, Preview
- Install and run:
	- `pnpm install`
	- `pnpm dev` (Vite dev server)
	- `pnpm build` (production build); `pnpm preview --port 5050`
	- `pnpm typecheck` (vue-tsc), `pnpm lint` (uses `eslint-internal-rules/`)
- `postinstall` runs `pnpm build:icons` to generate icon sets.

### Workspace & Local Package
- Monorepo with `packages/mcfacetbox` (local dependency via `workspace:*`). Rebuild with: `pnpm -C packages/mcfacetbox run build`.
- Component auto-import scans `src/@core/components`, `src/views/demos`, `src/components` and resolves `VueApexCharts` automatically.

### Theming & i18n
- Skins override Vuetify colors via `_handleSkinChanges`; define `skin-{name}-background|surface` tokens.
- Language persisted via `cookieRef('language')`; `_syncAppRtl` updates `<html lang>` and `isAppRTL` based on `themeConfig.app.i18n.langConfig`.

### Icons & Assets
- Icons: `pnpm build:icons` runs `src/plugins/iconify/build-icons.ts`. Re-run after adding sets under `src/plugins/iconify/**`.
- SVGs via `vite-svg-loader`; prefer `public/images/svg` or `src/assets/images/svg` for shared assets.

### Troubleshooting
- Auto-import missing? Check `AutoImport.dirs` and the `ignore` list in `vite.config.ts`.
- Styles not applying? Ensure globals live in `src/assets/styles/**` and are imported in `src/main.ts`.
- Chunk size warnings (>5000 KB) are allowed, but prefer route-level code-splitting for heavy modules.

Feedback: If plugin boot order, store patterns, or mocking paths feel unclear, tell me which area to expand and I’ll refine this guide.
