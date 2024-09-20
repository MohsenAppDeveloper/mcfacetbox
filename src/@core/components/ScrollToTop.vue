<script setup lang="ts">
const { y } = useWindowScroll()

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <Transition
    name="app-transition-zoom-fade"
    style="transform-origin: center;"
  >
    <VBtn
      v-show="y > 200"
      icon
      density="comfortable"
      class="scroll-to-top d-print-none"
      @click="scrollToTop"
    >
      <VIcon
        size="22"
        icon="tabler-arrow-up"
      />
    </VBtn>
  </Transition>
</template>

<style lang="scss">
.scroll-to-top {
  position: fixed !important;

  // To keep button on top of v-layout. E.g. Email app
  z-index: 999;
  inset-block-end: 5%;
  inset-inline-end: 25px;
}
</style>
