# MCFacetBox

A reusable Vue 3 + Vuetify facet box component supporting flat, tree, and switch facets.


## Install

Until it's published on a registry, you can consume it via your monorepo workspace or by building locally:

```sh
# From monorepo root
pnpm -C packages/mcfacetbox build
# Then link or import from workspace
```

If you publish to npm:

```sh
# After publishing to npm (example)
pnpm add mcfacetbox
```

If you publish to GitHub Packages (requires a scoped name like `@<org>/mcfacetbox`):

```sh
# .npmrc
@<YOUR_GITHUB_USERNAME_OR_ORG>:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>

# Install after publishing
pnpm add @<YOUR_GITHUB_USERNAME_OR_ORG>/mcfacetbox
```

## Usage

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// If installed as a plugin
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

- `dataitems: IFacetItem[]`: آرایه‌ی آیتم‌های فست. برای نوع‌های مختلف (flat/tree/switch) استفاده می‌شود. هر آیتم شامل `key`, `title`, `count`, و برای درخت، کلید والد.
- `searchable: boolean`: نمایش ورودی جستجو در بالای فست.
- `facettitle: string`: عنوان باکس فست (برای حالت‌های flat و tree).
- `istree?: boolean`: اگر `true` از ویو درختی استفاده می‌شود؛ در غیر این صورت لیست تخت.
- `scrollItemCount?: number`: حداکثر تعداد آیتم‌های قابل‌اسکرول در نمای لیست تخت.
- `selectedItems?: string[]`: آیتم‌های انتخاب‌شده اولیه. برای سوئیچ یک مقدار `'true'` یا `'false'`، برای لیست/درخت آرایه‌ای از کلیدها.
- `facettype?: FacetType`: تعیین نوع فست. مقادیر: `flat`, `tree`, `switch`. در صورت عدم تعیین، رفتار بر اساس `istree` یا پیش‌فرض تخت است.

نمونه‌ی ساختار `IFacetItem`:

```ts
interface IFacetItem {
  key: string
  title: string
  count: number
  parentKey?: string // برای درخت
}
```

## Emits

- `update:selectedItems: string[]` — هر بار که انتخاب‌ها تغییر کنند، این ایونت با لیست کلیدهای انتخاب‌شده فراخوانی می‌شود.
  - حالت `flat`: کلیدهای آیتم‌های انتخاب‌شده.
  - حالت `tree`: کلیدهای نودهای فعال.
  - حالت `switch`: آرایه‌ای با یک مقدار `'true' | 'false'`.

## مثال (الهام از الگوی mcdialogbookselect)

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

نمونه‌ی درختی:

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

نمونه‌ی سوئیچ:

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
# From repository root
pnpm install
pnpm -C packages/mcfacetbox typecheck
pnpm -C packages/mcfacetbox build
```

## Release via GitHub

Create a tag like `mcfacetbox-v0.1.0` and push it. The provided workflow will build the package and attach the `dist` artifact to the GitHub release.

```powershell
# PowerShell
$version = "0.1.0"
$tag = "mcfacetbox-v$version"
git tag -a $tag -m "Release $tag"; git push origin $tag
```

## Publish only this package to a separate GitHub repo

اگر workspace شما به GitLab متصل است و فقط می‌خواهید پکیج `mcfacetbox` را به GitHub منتقل کنید، از `git subtree` استفاده کنید تا تاریخچه‌ی پوشه‌ی پکیج جدا شود:

```powershell
# ساخت شاخه‌ی جداگانه از زیرپوشه‌ی پکیج
git subtree split --prefix packages/mcfacetbox -b mcfacetbox-publish

# پوش به ریپوی جدید در GitHub (main)
git push https://github.com/<USER_OR_ORG>/mcfacetbox.git mcfacetbox-publish:main -f

# اختیاری: تگ‌گذاری انتشار در ریپوی جدید
$version = "0.1.0"; $tag = "mcfacetbox-v$version"
git push https://github.com/<USER_OR_OR_ORG>/mcfacetbox.git $tag
```

پس از ایجاد ریپوی جداگانه، Workflow انتشار را در آن ریپو نیز اضافه کنید (همین فایل `release-mcfacetbox.yml`) یا از Releases دستی استفاده کنید.

## Links

- Issues: https://github.com/<YOUR_GITHUB_USERNAME_OR_ORG>/mcfacetbox/issues
- Changelog: see GitHub Releases

