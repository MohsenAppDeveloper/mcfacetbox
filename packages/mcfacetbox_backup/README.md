
# MCFacetBox

A Vue 3 + Vuetify facet box component supporting flat list, tree view, and switch facets.

## Installation (from GitHub)

```sh
# Using pnpm
pnpm add mcfacetbox

# Or if published under a scope (GitHub Packages)

```

```ts
// If using GitHub Packages, configure your .npmrc
// @<org>:registry=https://npm.pkg.github.com/
// //npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>
```

This package is not yet published to npm. Install directly from GitHub:

- Option A — add as a Git dependency (recommended with tags):

```sh
# Use a tagged version for reproducibility (e.g., mcfacetbox-v0.1.0)
pnpm add git+https://github.com/MohsenAppDeveloper/mcfacetbox.git#mcfacetbox-v0.1.0
```

- Option B — install from a Release artifact (tarball):

```sh
# Download the release asset (mcfacetbox-<tag>.tar.gz) from GitHub Releases
# Then install locally
pnpm add file:./mcfacetbox-<tag>.tar.gz
```

- Option C — local clone and link:

```sh
# Clone the repo and build
git clone https://github.com/MohsenAppDeveloper/mcfacetbox.git; cd mcfacetbox
pnpm install; pnpm build

# In your app project
pnpm add ../mcfacetbox  # or "file:../mcfacetbox"
```
```

## Usage

Install as a plugin:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import MCFacetBoxPlugin from 'mcfacetbox'
import 'mcfacetbox/style.css'

const app = createApp(App)
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

## Props

- `dataitems: IFacetItem[]`: Facet items array. Each item includes `key`, `title`, `count`. For tree mode, provide `parentKey`.
- `searchable: boolean`: Shows a search input for filtering.
- `facettitle: string`: Title of the facet box (flat and tree modes).
- `istree?: boolean`: Enables tree view when `true`; otherwise flat list.
- `scrollItemCount?: number`: Max visible rows in flat list before scrolling.
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
  - Flat: selected item keys
  - Tree: activated node keys
  - Switch: `['true']` or `['false']`

## Examples

Flat list:

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

Tree view:

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

Switch facet:

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

## Development

```sh
pnpm install
pnpm -C packages/mcfacetbox typecheck
pnpm -C packages/mcfacetbox build
```

## License

MIT

