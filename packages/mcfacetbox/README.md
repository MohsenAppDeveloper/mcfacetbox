
    # MCFacetBox

    A Vue 3 + Vuetify facet box component supporting flat list, tree view, and switch facets.

    ## Installation

    ```sh
    # Using pnpm
    pnpm add mcfacetbox

    # Or if published under a scope (GitHub Packages)
    pnpm add @<org>/mcfacetbox
    ```

    ```ts
    // If using GitHub Packages, configure your .npmrc
    // @<org>:registry=https://npm.pkg.github.com/
    // //npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>
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

    ## Development

    ```sh
    pnpm install
    pnpm -C packages/mcfacetbox typecheck
    pnpm -C packages/mcfacetbox build
    ```

    ## License

    MIT

