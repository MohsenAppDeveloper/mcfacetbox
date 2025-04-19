<script setup lang="ts">
interface Props {
  page: number
  itemsPerPage: number
  totalItems: number
  divider?: boolean
  fullSize: boolean
}

interface Emit {
  (e: 'update:page', value: number): void
  (e: 'update:itemsPerPage', value: number): void
  (e: 'update:fullSize', value: boolean): void

}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const updatePage = (value: number) => {
  emit('update:page', value)
}

const updatePageSize = (value: number) => {
  console.log('itemperpage', value)

  emit('update:itemsPerPage', value)
}

const updateFullSize = (value: boolean) => {
  emit('update:fullSize', value)
}

function paginationMouseEnter() {
  emit('update:fullSize', true)
}
</script>

<template>
  <div>
    <VBtn
      v-if="props.fullSize" icon size="xsmall" variant="elevated" color="secondary" class="close-btn"
      @click="updateFullSize(false)"
    >
      <VIcon icon="tabler-x" size="16" />
    </VBtn>
    <VDivider v-if="props.divider" />

    <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 px-1 py-1">
      <p class=" mb-0" @mouseenter="paginationMouseEnter">
        {{ paginationMeta({ page, itemsPerPage }, totalItems, $t("Show"), $t("to"), $t("of"), $t("entries")) }}
      </p>
      <VSlideXTransition>
        <div v-if="props.fullSize" class="d-flex align-center">
          <VPagination

            :model-value="page" active-color="primary" :length="Math.ceil(totalItems / itemsPerPage)"
            :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalItems / itemsPerPage), 3)"
            @update:model-value="updatePage"
          />
          <div class="d-flex gap-2 align-center ma-2 ms-auto ">
            <p class="text-body-1 mb-0">
              {{ $t('Show') }}
            </p>
            <AppSelect
              :model-value="itemsPerPage"
              :items="[
                { value: 5, title: '5' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]"
              style="inline-size: 5.5rem;"
              @update:model-value="updatePageSize"
            />
          </div>
        </div>
      </VSlideXTransition>
    </div>
  </div>
</template>
