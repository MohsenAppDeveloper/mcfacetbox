# MCFacetBox

Faceted filter UI for search results in Vue 3 + Vuetify. MCFacetBox provides three facet modes — flat list, tree view, and a boolean switch — to help users narrow down search results quickly and intuitively.

## Installation

```sh
# Using pnpm or npm
pnpm add mcfacetbox
npm install mcfacetbox

```

> Note: The package bundles Vuetify base styles and MDI icons internally — you do not need to configure icon sets or import `@mdi/font` in your app.

## Quick Start

Install as a plugin:

```ts
// main.ts
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import App from "./App.vue";
import MCFacetBoxPlugin from "mcfacetbox";
import "mcfacetbox/style.css";

const app = createApp(App);
// Important: register Vuetify in your app
const vuetify = createVuetify();
app.use(vuetify);

// Register MCFacetBox plugin (globally registers the component)
app.use(MCFacetBoxPlugin);
app.mount("#app");
```

Or import the component directly:

```vue
<script setup lang="ts">
import { MCFacetBox } from "mcfacetbox";
import "mcfacetbox/style.css";
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

- `dataitems: IFacetBox[]`: List of facet groups to render. Defaults to `[]`.
- `selectedItems: Record<string, string[]>`: Selected values grouped by facet key. Use with `v-model:selectedItems`.
- `direction?: 'ltr' | 'rtl'`: Layout direction for the whole facet box.
- `searchDirection?: 'ltr' | 'rtl'`: Direction for search input text.
- `searchPlaceholder?: string`: Placeholder text for each facet search input.
- `filterTitle?: string`: Optional title text for the selected-filters area.
- `facetLoading?: Record<string, boolean>`: Loading state per facet key, usually while server-side filtering is running.
- `serverFilterable?: boolean`: Emits `search` instead of filtering facet items locally.
- `filterTags?: boolean`: Shows selected filter chips when `true`. Defaults to `true`.
- `facetState?: Record<string, { errorMessage?: string }>`: Error state per facet key.
- `openPanels?: string[]`: Open expansion-panel keys. Defaults to `[]`. Use with `v-model:openPanels`.

Type signature:

```ts
type ActiveFilters = Record<string, string[]>;

enum FacetType {
  flat = 1,
  tree = 2,
  switch = 3,
}

interface IFacetItem {
  orderIndex?: string;
  count: number;
  isSelected?: boolean;
  key: string;
  parent?: number | string | null;
  title: string;
}

interface IFacetBox {
  hasSearchBox: boolean;
  key: string;
  scrollSize: number;
  title: string;
  type?: FacetType;
  itemList: IFacetItem[];
  isTree?: boolean;
}
```

## Emits

- `update:selectedItems: Record<string, string[]>`: Emitted whenever a facet selection changes.
- `update:openPanels: string[]`: Emitted whenever open panels change.
- `search: (key: string, value: string)`: Emitted when `serverFilterable` is enabled and a facet search changes.

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

Basic usage with multiple facet groups:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MCFacetBox } from "mcfacetbox";
import { FacetType, type IFacetBox } from "mcfacetbox";

const selected = ref<Record<string, string[]>>({});
const openPanels = ref<string[]>(["category"]);

const facets: IFacetBox[] = [
  {
    key: "category",
    title: "Categories",
    hasSearchBox: true,
    scrollSize: 8,
    type: FacetType.flat,
    itemList: [
      {
        key: "550e8400-e29b-41d4-a716-446655440000",
        title: "History",
        count: 42,
      },
      {
        key: "7b9e4f3a-52d1-4d7f-bb6f-4c3d78e67a10",
        title: "Science",
        count: 17,
      },
    ],
  },
  {
    key: "subject",
    title: "Subjects",
    hasSearchBox: true,
    scrollSize: 8,
    type: FacetType.tree,
    isTree: true,
    itemList: [
      { key: "2d931510-d99f-494a-8c67-87feb05e1594", title: "All", count: 59 },
      {
        key: "8c5b9d37-7e9a-4b2f-a3f5-7422e5b92c71",
        title: "History",
        parent: "2d931510-d99f-494a-8c67-87feb05e1594",
        count: 42,
      },
      {
        key: "afcc7d41-0f36-4d97-b14d-9c7114909b87",
        title: "Science",
        parent: "2d931510-d99f-494a-8c67-87feb05e1594",
        count: 17,
      },
    ],
  },
  {
    key: "availability",
    title: "Availability",
    hasSearchBox: false,
    scrollSize: 1,
    type: FacetType.switch,
    itemList: [{ key: "true", title: "Only Available", count: 23 }],
  },
];

function searchFacet(key: string, value: string) {
  // Fetch new items for this facet from your API.
}
</script>

<template>
  <MCFacetBox
    v-model:selectedItems="selected"
    v-model:openPanels="openPanels"
    :dataitems="facets"
    direction="rtl"
    search-direction="rtl"
    search-placeholder="Search facets"
    :server-filterable="true"
    :facet-loading="{ category: false, subject: false }"
    :facet-state="{ category: { errorMessage: '' } }"
    @search="searchFacet"
  />
  <div>Selected: {{ selected }}</div>
</template>
```

## Apply Selected Filters

Combine MCFacetBox with your search logic by watching `selected` and querying your backend accordingly:

`filters` contains the selected item `key` values. If your item keys are UUIDs, the selected values are UUIDs too:

```ts
{
  category: ["550e8400-e29b-41d4-a716-446655440000"],
  subject: ["8c5b9d37-7e9a-4b2f-a3f5-7422e5b92c71"],
  availability: ["true"],
}
```

```ts
watch(selected, (filters) => {
  // Example: build query params and call your API
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([facetKey, values]) => {
    values.forEach((uuid) => params.append(facetKey, uuid));
  });

  fetch(`/api/search?${params.toString()}`);
});
```

## Development

```sh
pnpm install
pnpm -C packages/mcfacetbox typecheck
pnpm -C packages/mcfacetbox build
```

## License

MIT
