# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript encyclopedia application built with Vuetify 3, focused on managing hierarchical tree structures with data nodes (فیش/excerpts). The application is Persian (RTL) by default with multi-language support. It uses Vite for build tooling and follows a modern Vue composition API pattern with auto-imports.

## Build & Development Commands

```bash
# Development server (default port: 5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking (without emitting files)
npm run typecheck

# Lint and auto-fix
npm run lint

# Build iconify icons (runs automatically on postinstall)
npm run build:icons

# Initialize MSW (Mock Service Worker - runs automatically on postinstall)
npm run msw:init
```

## Environment Configuration

Create a `.env` file in the root directory with these variables:

```bash
VITE_API_BASE_URL='http://your-api-url/'
VITE_API_URL='http://your-api-url/api/'
VITE_CLIENT_ADDRESS='http://localhost:5173/'
VITE_APP_TYPE='RS'  # Application type: RS or UM
```

The API client is configured in `src/utils/api.ts` using `ofetch` with automatic authentication header injection.

## Architecture

### Core Concepts

**Tree-Node-Excerpt Hierarchy**: The application manages a three-level data structure:
1. **Trees** (درخت): Top-level organizational units
2. **Nodes** (نود): Hierarchical tree nodes with parent-child relationships
3. **Excerpts/DataShelf** (فیش): Data boxes attached to nodes containing content

### State Management (Pinia Stores)

Located in `src/store/`:

- **treeStore.ts**: Manages the tree data structure with two reactive stores:
  - `treeData`: Array of root-level nodes
  - `treeIndex`: Object mapping node IDs to node objects for O(1) lookups
  - Key operations: `addNode()`, `deleteNode()`, `mergeNode()`, `transferNode()`
  - The store maintains a dual structure (array + index) for efficient hierarchical operations

- **databoxStore.ts**: Tracks excerpt/datashelf state changes and priority ordering

- **baseStore.ts**: Contains global state for login/authentication

- **gateStore.ts**: Manages gate-related functionality

### Directory Structure

```
src/
├── @core/              # Core utilities and base components
│   ├── components/     # Reusable base components
│   └── utils/          # Core utilities (validators, helpers, formatters)
├── @layouts/           # Layout components
├── assets/             # Static assets (images, styles, fonts)
├── components/         # Application-specific components
│   ├── MainTree/       # Tree management components
│   ├── MainDataShelf/  # Data shelf/excerpt components
│   ├── MainDataCollection/ # Data collection components
│   └── dialogs/        # Dialog components
├── composables/        # Vue composables (auto-imported)
├── layouts/            # Page layouts
├── navigation/         # Navigation configuration
├── pages/              # Route pages (file-based routing)
│   ├── rs/             # Research system pages
│   └── um/             # User management pages
├── plugins/            # Vue plugins (iconify, i18n, vuetify, etc.)
├── services/           # API service layer
├── store/              # Pinia stores
├── types/              # TypeScript type definitions
│   ├── baseModels.ts   # Base interfaces and models
│   ├── tree.ts         # Tree/node type definitions
│   ├── dataShelf.ts    # Excerpt/datashelf types
│   └── ...
├── utils/              # Utility functions
│   ├── api.ts          # API client configuration ($api)
│   ├── alert.ts        # Alert utilities
│   └── ...
└── views/              # View components
```

### Auto-Import System

The project uses `unplugin-auto-import` and `unplugin-vue-components` to automatically import:

- Vue APIs (`ref`, `computed`, `reactive`, etc.)
- Vue Router composables
- VueUse composables (`@vueuse/core`, `@vueuse/math`)
- Pinia store utilities
- Custom composables from `src/composables/`, `src/@core/composable/`, `src/utils/`
- Components from `src/@core/components`, `src/components`, `src/views/demos`

You don't need to manually import these - just use them directly.

### Path Aliases

Configured in `vite.config.ts` and `tsconfig.json`:

```typescript
@/          → src/
@core/      → src/@core/
@layouts/   → src/@layouts/
@images/    → src/assets/images/
@styles/    → src/assets/styles/
@themeConfig → themeConfig.ts
@types/     → src/types/
@models/    → src/models/
@store/     → src/store/
```

### Routing

Uses `unplugin-vue-router` for file-based routing. Pages in `src/pages/` are automatically converted to routes with kebab-case names (e.g., `MyPage.vue` → `/my-page`).

### Type System

Key type definitions in `src/types/`:

- **baseModels.ts**: Base interfaces (`ISimpleDTO`, `ISimpleTree`, `baseItemAction`, `baseItemState`)
- **tree.ts**: Tree/node types (`ISimpleNestedNodeActionable`, `ITreeTitle`, `NodeType` enum)
  - `NodeType` enum: `Children`, `SiblingBefore`, `SiblingAfter` for node positioning
- **dataShelf.ts**: Excerpt/datashelf types

### API Layer

**Base API Client** (`src/utils/api.ts`):
- `$api`: Main API client with automatic Bearer token injection
- `$apiFake`: Fake API client for MSW mocking
- Custom error handling with redirect to login on 401
- Base URL from `VITE_API_URL` environment variable

**Generic Services** (`src/services/genericServices.ts`):
- `serviceAdd<T>(dataModel, serviceUrl)`: POST request
- `serviceUpdate<T>(dataModel, entityId, serviceUrl)`: PUT request
- `serviceDelete(id, serviceUrl)`: DELETE request

### Tree Operations (Important)

The tree store (`src/store/treeStore.ts`) implements complex hierarchical operations:

1. **Adding Nodes**: `addNode(nodeItem, destinationNodeID, newNodeType)`
   - Supports adding as child, sibling before, or sibling after
   - Automatically updates both `treeData` array and `treeIndex` object

2. **Deleting Nodes**: `deleteNode(nodeItem, isRoot)`
   - Recursively deletes children
   - Removes from parent's children array and from `treeIndex`

3. **Merging Nodes**: `mergeNode(sourceNodeID, destinationNodeID)`
   - Moves all children from source to destination
   - Deletes source node after transfer

4. **Transferring Nodes**: `transferNode(sourceNodeID, destinationNodeID, transferType)`
   - Moves a node and its children to a new parent/position

5. **Node Indexing**: `createTreeIndex(tree)`
   - Builds the `treeIndex` lookup table for fast access

### UI Components Prefix

Custom components use the `MC` prefix (e.g., `MCDataTable`, `MCSearchApiTree`, `MCInputDatePicker`).

### Styling

- Vuetify 3 for UI components
- SCSS for custom styles
- RTL support enabled by default (Persian language)
- Theme configuration in `themeConfig.ts`
- Custom Vuetify variables in `src/assets/styles/variables/_vuetify.scss`

### Authentication

- Uses cookie-based authentication (`accessToken` cookie)
- Auto-injected in API requests via `src/utils/api.ts`
- Login state managed in `src/store/baseStore.ts`
- 401 responses trigger `MustLogin` state
- 403 with specific error code triggers `MustLogout` after 4s delay

## Code Comments

Many comments are in Persian (Farsi). The codebase serves a Persian-speaking team.

## Key Libraries

- **Vue 3.4+**: Composition API
- **Vuetify 3.7**: Material Design component framework
- **TypeScript 5.3**: Type safety
- **Pinia**: State management
- **Vue Router 4**: File-based routing
- **ofetch**: HTTP client
- **@vueuse/core**: Composable utilities
- **Iconify**: Icon system (Tabler icons primarily)
- **TipTap**: Rich text editor
- **vue-i18n**: Internationalization (en, fa, fr)
- **Splitpanes**: Resizable split views
- **vue-toastification**: Toast notifications
- **SweetAlert2**: Modal dialogs

## Important Notes

- The application is designed for RTL (right-to-left) layout by default
- Persian (fa-IR) is the primary language and is used in API headers
- Tree operations are complex and maintain dual data structures (array + index) for performance
- Node relations and references are tracked with counters (`relationCount`, `referenceCount`)
- The codebase includes extensive Persian comments explaining business logic