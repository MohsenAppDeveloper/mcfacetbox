<script setup lang="ts">
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <ScrollToTop />
      <!--
        <MCSnackBarGlobal :error-msg="snackbar.message" :snackbar-actions="snackbar.customActions"
        :snackbar-show="snackbar.isOpen" :snackbar-status="snackbar.status"></MCSnackBarGlobal>
      -->
    </VApp>
  </VLocaleProvider>
</template>

<style lang="css">
.Vue-Toastification__toast {
  font-family: "Vazir" !important;
}
</style>
