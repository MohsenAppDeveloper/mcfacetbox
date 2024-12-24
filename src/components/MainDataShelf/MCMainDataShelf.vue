<script setup lang="ts">
import { useSelectedNode } from '@/store/treeStore'

const selectenode = useSelectedNode()
</script>

<template>
  <VRow no-gutters class="mc-data-shelf">
    <VCol class="">
      <!--
        <VToolbar
        no-gutters class="btn-box data-shelf-toolbar" :title="selectenode.title" height="40"
        dir="rtl"
        >
      -->
      <VRow no-gutters class="btn-box data-shelf-toolbar d-flex">
        <div>
          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-box-multiple" size="22" />
          </VBtn>
          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-search" size="22" />
          </VBtn>
          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-filter" size="22" />
          </VBtn>
          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-list-tree" size="22" />
          </VBtn>
          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-separator-vertical" size="22" />
          </VBtn>
          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-trash-x" size="22" />
          </VBtn>
          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-plug-connected-x" size="22" />
          </VBtn>

          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-square-plus" size="22" />
          </VBtn>
          <VBtn icon size="small" variant="tonal" @click="">
            <VIcon icon="tabler-eye-plus" size="22" />
          </VBtn>
        </div>
        <div class="ms-auto">
          <span class="ma-2">{{ selectenode.title }}</span>
        </div>
      </VRow>
      <!-- </VToolbar> -->
    </VCol>
  </VRow>
</template>
