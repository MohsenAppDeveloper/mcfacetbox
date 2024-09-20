<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import miscComingSoon from '@images/pages/misc-coming-soon.png'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'

definePage({
  meta: {
    layout: 'blank',
  },
})

const email = ref('')

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <div>
      <!-- 👉 Title and subtitle -->
      <div class="text-center mb-4">
        <h4 class="text-h4 font-weight-medium mb-2">
          We are launching soon 🚀
        </h4>
        <p class="text-body-1 mb-6">
          Our website is opening soon. Please register to get notified when it's ready!
        </p>
      </div>

      <!-- 👉 Email input -->
      <VForm
        class="d-flex flex-wrap align-center justify-center gap-4 misc-form"
        @submit.prevent="() => {}"
      >
        <AppTextField
          v-model="email"
          autofocus
          placeholder="Enter your email or username"
          class="misc-email-input"
        />
        <VBtn type="submit">
          Notify
        </VBtn>
      </VForm>
    </div>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100">
      <VImg
        :src="miscComingSoon"
        alt="Coming Soon"
        :max-height="$vuetify.display.smAndDown ? 350 : 500"
        class="mx-auto"
      />
    </div>

    <img
      class="misc-footer-img d-none d-md-block"
      :src="authThemeMask"
      alt="misc-footer-img"
      height="320"
    >
  </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/misc.scss";

.misc-email-input {
  max-inline-size: 22.75rem;
  min-inline-size: 14.75rem;
}

.misc-form {
  margin-block-end: 4rem;
}

@media screen and (max-width: 575.98px) {
  .misc-form {
    margin-block-end: 3rem;
  }
}
</style>
