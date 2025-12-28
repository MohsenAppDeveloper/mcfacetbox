<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import MCFacetRender from './MCFacetRender.vue'
import { VChip } from 'vuetify/components/VChip'
import type { IFacetBox } from './types'
import { VBtn } from 'vuetify/components'

/* =========================
  TYPES
========================= */

type ActiveFilters = Record<string, string[]>
interface Props {
  dataitems: IFacetBox[]
  selectedItems?: ActiveFilters
  direction?: 'ltr' | 'rtl'
  searchDirection?: 'ltr' | 'rtl'
  searchPlaceholder?: string
  filterTitle?: string
  facetLoading?: Record<string, boolean>
}
interface Emit {
  (e: 'update:selectedItems', selectdItems: ActiveFilters): void,
  (e: 'search', key: string, value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

/* =========================
  STATE
========================= */
// const activeFilters = ref<ActiveFilters>({})

// computed دوطرفه روی کل selectedItems
const activeFilters = computed({
  get: () => props.selectedItems || {},
  set: (val) => emit('update:selectedItems', val)
})


const removeChip = (facetKey: string, value: string) => {
  activeFilters.value[facetKey] =
    activeFilters.value[facetKey]?.filter(v => v !== value) ?? []
}

const handleSearch = async (facetKey: string, searchText: string) => {
  emit('search', facetKey, searchText);
}

function getSelectedFacetItems(response: IFacetBox[], selected: Record<string, string[]>) {
  const result: { title: string; key: string; selectedItems: { key: string; title: string }[] }[] = [];

  for (const key in selected) {
    const facet = response.find(f => f.key === key);
    if (!facet) continue;

    const selectedKeys = selected[key];
    const selectedItems = facet.itemList
      .filter(item => selectedKeys.includes(item.key))
      .map(item => ({ key: item.key, title: item.title }));

    if (selectedItems.length > 0) {
      result.push({
        title: facet.title,
        key: facet.key,
        selectedItems
      });
    }
  }
  return result;
}

function removeFilter(facetKey: string) {
  delete activeFilters.value[facetKey];
}

function removeAllFilter() {
  activeFilters.value = {};
}
</script>

<template>
  <div :dir="direction">
    <!-- =======================
    CHIPS
  ======================== -->

    <div class="remove-filter">

      <div class="row justify-content-between align-items-center">
        <VCardTitle class="filter-title">
         {{ !filterTitle ? 'Applied filters' : filterTitle }}
        </VCardTitle>
        
        <v-btn icon variant="text" @click="removeAllFilter" density="compact">
          <v-icon :size="16">mdi-close</v-icon>
        </v-btn>
      </div>

      <div v-for="facet in getSelectedFacetItems(dataitems, activeFilters)"
        class="row justify-content-between align-items-center">

        <VCardTitle>
          {{ facet.title }}:
        </VCardTitle>

        <div style="width: calc(100% - 30px);">
          <VChip v-for="selectedItem in facet.selectedItems" :key="selectedItem.key" class="mr-1 mb-1" closable
            @click:close="removeChip(facet.key, selectedItem.key)" size="small">
            {{ selectedItem.title }}
          </VChip>
        </div>

        <v-btn icon variant="text" @click="removeFilter(facet.key)" density="compact">
          <v-icon :size="16">mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
    </div>


    <!-- =======================
    DYNAMIC FACETS
  ======================== -->

    <MCFacetRender v-for="facet in dataitems" :key="facet.key" :facettitle="facet.title" :dataitems="facet"
      :facettype="facet.type" v-model:selectedItems="activeFilters[facet.key]" :searchable="facet.hasSearchBox"
      @search="val => handleSearch(facet.key, val)" :isLoading="facetLoading?.[facet.key]" :direction="direction"
      :searchDirection="searchDirection" :searchPlaceholder="searchPlaceholder" />
  </div>
</template>

<style scoped lang="scss">
.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-content: center;
}

.search-container {
  padding-inline: 10px;
}

.remove-filter {
  position: sticky;
  top: 0;
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  z-index: 1000000;
  padding: 4px 8px;

  .v-card-title {
    padding: 0;
  }
}

.filter-title {
  font-weight: bold;
}

.v-card-title {
  font-size: 1em;
  margin-block: 3px;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 10px;
}
</style>
