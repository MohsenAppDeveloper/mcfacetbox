
# MCFacetBox

Faceted filter UI for search results in Vue 3 + Vuetify. MCFacetBox provides three facet modes — flat list, tree view, and a boolean switch — to help users narrow down search results quickly and intuitively.

## Installation

```sh
# Using pnpm or npm
pnpm add mcfacetbox
npm install mcfacetbox

```

> Note: The package bundles Vuetify base styles and MDI icons internally — you do not need to configure icon sets or import `@mdi/font` in your app.
```

## Quick Start

Install as a plugin:

```ts
// main.ts
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import MCFacetBoxPlugin from 'mcfacetbox'
import 'mcfacetbox/style.css'

const app = createApp(App)
// Important: register Vuetify in your app
const vuetify = createVuetify()
app.use(vuetify)

// Register MCFacetBox plugin (globally registers the component)
app.use(MCFacetBoxPlugin)
app.mount('#app')
```

Or import the component directly:

```vue
<script setup lang="ts">
import { MCFacetBox } from 'mcfacetbox'
import 'mcfacetbox/style.css'
</script>

<template>
  <MCFacetBox />
</template>
```

## What It Does

MCFacetBox is designed for faceted filtering in search/result pages. Typical use cases:
- Category filters (flat list) with multi-select and counts
- Hierarchical filters (tree view) with single independent activation
- Availability or flags (switch) for quick true/false toggles

Selections are emitted to the parent so you can apply them to your search query or API call.

## Props

- `dataitems: IFacetItem[]`: Facet items array. Each item includes `key`, `title`, `count`. For tree mode, provide `parentKey`.
- `searchable: boolean`: Shows a search input for filtering.
- `facettitle: string`: Title of the facet box (flat and tree modes).
- `istree?: boolean`: Enables tree view when `true`; otherwise flat list.
- `scrollItemCount?: number`: Max visible rows in flat list before scrolling.
- `scrollItemHeight?: number`: Min height of flat list items; default value is `43`.
- `selectedItems?: string[]`: Initial selection. For switch mode, one value `'true' | 'false'`. For flat/tree, an array of keys.
- `facettype?: FacetType`: Facet mode: `flat`, `tree`, or `switch`. Defaults to flat unless `istree` is true.
- `direction?: 'ltr' | 'rtl'`: Optional layout direction override. If omitted, auto-detects from the page `dir` (defaults to `ltr`).

Type signature:

```ts
interface IFacetItem {
  key: string
  title: string
  count: number
  parentKey?: string // for tree mode
}
```

## Emits

- `update:selectedItems: string[]` — Emitted whenever selection changes.
  - Flat: selected item keys (multi-select)
  - Tree: activated node keys (single-independent)
  - Switch: `['true']` or `['false']`

## Behavior Details
- Search box filters by `title` client-side using a compact text field.
- Direction (`ltr`/`rtl`) auto-detects from document `dir`, unless overridden.
- Tree view uses single-independent activation to avoid selecting parent and child simultaneously.
- List rows show a checkbox on the left and an item `count` on the right.
- Switch mode displays a label from `dataitems[0].title` and toggles `'true'/'false'`.

## Icons & Styles
- No icon configuration required. The library imports Vuetify base CSS and MDI icon font internally.
- App needs Vuetify installed and registered via `app.use(createVuetify())`.

## Examples

Flat list (multi-select):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { MCFacetBox } from 'mcfacetbox'
import type { IFacetItem } from 'mcfacetbox'

const selected = ref<string[]>([])
const items: IFacetItem[] = [
  { key: 'history', title: 'History', count: 42 },
  { key: 'science', title: 'Science', count: 17 },
]
</script>

<template>
  <MCFacetBox
    :dataitems="items"
    :searchable="true"
    facettitle="Categories"
    facettype="flat"
    :selectedItems="selected"
    @update:selectedItems="selected = $event"
  />
  <div>Selected: {{ selected }}</div>
</template>
```

Tree view (single-independent):

```vue
<MCFacetBox
  :dataitems="[
    { key: 'root', title: 'All', count: 59 },
    { key: 'root/history', title: 'History', parentKey: 'root', count: 42 },
    { key: 'root/science', title: 'Science', parentKey: 'root', count: 17 },
  ]"
  facettitle="Subjects"
  :istree="true"
  facettype="tree"
  :selectedItems="selected"
  @update:selectedItems="selected = $event"
/>
```

Switch facet (boolean):

```vue
<MCFacetBox
  :dataitems="[{ key: 'false', title: 'Only Available', count: 23 }]"
  facettype="switch"
  :selectedItems="selected"
  @update:selectedItems="selected = $event"
/>
```

Direction override:

```vue
<MCFacetBox
  :dataitems="items"
  facettitle="Tags"
  facettype="flat"
  direction="rtl"
/>
```

## Apply Selected Filters

Combine MCFacetBox with your search logic by watching `selected` and querying your backend accordingly:

```ts
watch(selected, (keys) => {
  // Example: build query params and call your API
  const params = new URLSearchParams()
  keys.forEach((k) => params.append('facet', k))
  fetch(`/api/search?${params.toString()}`)
})
```

## Development

```sh
pnpm install
pnpm -C packages/mcfacetbox typecheck
pnpm -C packages/mcfacetbox build
```

## License

MIT

