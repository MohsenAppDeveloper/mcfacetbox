<script setup lang="ts">
import AppSearchHeaderBg from '@images/pages/app-search-header-bg.png'

interface Props {
  title?: string
  subtitle?: string
  customClass?: string
  placeholder?: string
  density?: 'comfortable' | 'compact' | 'default'
  isReverse?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  density: 'comfortable',
  isReverse: false,
})
</script>

<template>
  <!-- 👉 Search Banner  -->
  <VCard
    flat
    class="text-center search-header"
    :class="props.customClass"
    :style="`background: url(${AppSearchHeaderBg});`"
  >
    <VCardText>
      <slot name="title">
        <h4 class="text-h4 mb-2 font-weight-medium">
          {{ props.title }}
        </h4>
      </slot>
      <div
        class="d-flex"
        :class="isReverse ? 'flex-column' : 'flex-column-reverse' "
      >
        <p class="mb-0">
          {{ props.subtitle }}
        </p>
        <!-- 👉 Search Input -->
        <div>
          <AppTextField
            v-bind="$attrs"
            class="search-header-input mx-auto my-4"
            :placeholder="props.placeholder"
            :density="props.density"
            prepend-inner-icon="tabler-search"
          />
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.search-header {
  padding: 4rem !important;
  background-size: cover !important;
}

// search input
.search-header-input {
  border-radius: 0.375rem !important;
  background-color: rgb(var(--v-theme-surface));
  max-inline-size: 28.125rem !important;
}

@media (max-width: 37.5rem) {
  .search-header {
    padding: 1.5rem !important;
  }
}
</style>
