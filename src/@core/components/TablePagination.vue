<script setup lang="ts">
interface Props {
  page: number
  itemsPerPage: number
  totalItems: number
  divider?: boolean
}

interface Emit {
  (e: 'update:page', value: number): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const updatePage = (value: number) => {
  emit('update:page', value)
}
</script>

<template>
  <div>
    <VDivider v-if="props.divider" />

    <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 px-1 py-1">
      <p class="text-disabled mb-0">
        {{ paginationMeta({ page, itemsPerPage }, totalItems, $t("Show"), $t("to"), $t("of"), $t("entries")) }}
      </p>

      <VPagination
        :model-value="page" active-color="primary" :length="Math.ceil(totalItems / itemsPerPage)"
        :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalItems / itemsPerPage), 5)"
        @update:model-value="updatePage"
      />
    </div>
  </div>
</template>
