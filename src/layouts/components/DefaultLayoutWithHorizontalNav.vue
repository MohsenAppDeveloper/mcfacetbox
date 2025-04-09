<script lang="ts" setup>
import { researchSoftwareItems, userManagementItems } from '@/navigation/horizontal'

import { themeConfig } from '@themeConfig'

// Components
import { VNodeRenderer } from '@/@layouts/components/VNodeRenderer'

// import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
// import NavSearchBar from '@/layouts/components/NavSearchBar.vue'
// import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'
import { HorizontalNavLayout } from '@layouts'
import type { HorizontalNavItems } from '@/@layouts/types'
import { useSelectedGate } from '@/store/gateStore'
import { useLoginState } from '@/store/baseStore'
import { LoginState } from '@/types/baseModels'
import { clearUserCookies } from '@/types/users'

// import { useGateList } from '@/store/gateStore'

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)
const router = useRouter()

// const gateList = useGateList()
const selectedGate = useSelectedGate()

const navItems = computed<HorizontalNavItems>(() => {
  if (import.meta.env.VITE_APP_TYPE === 'UM')
    return userManagementItems
  else
    return researchSoftwareItems
})

function showGateTitle(): boolean {
  if (selectedGate.value.id > 0 && router.currentRoute.value.name !== 'um-gate' && import.meta.env.VITE_APP_TYPE === 'UM')
    return true
  else
    return false
}
const loginState = useLoginState()

watch(loginState.Loginstate, async newval => {
  if (newval === LoginState.MustLogout) {
    clearUserCookies()
    await nextTick(() => {
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}signout?returnUrl=${import.meta.env.VITE_CLIENT_ADDRESS}login?to=${router.currentRoute.value.path}`

    //   router.replace(`${import.meta.env.VITE_API_BASE_URL}signout?returnUrl=${import.meta.env.VITE_CLIENT_ADDRESS}login&to=${router.currentRoute.value.path}`)
    })
  }
  if (newval === LoginState.MustLogin) {
    clearUserCookies()
    await nextTick(() => {
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}signout?returnUrl=${import.meta.env.VITE_CLIENT_ADDRESS}login?to=${router.currentRoute.value.path}`

    //   router.push('/login')
    })
  }
})

// onMounted(() => {
//   const result = gateList.value.find(item => item.selected)
//   if (result) {
//     selectedGate.value = result.id
//   }
//   else
//     if (gateList.value.length > 0) {
//       selectedGate.value = gateList.value[0].id
//       gateList.value[0].selected = true
//     }
// })

// watch(gateList, () => {
//   if (gateList.value.length > 0)
//     selectedGate.value = gateList.value[0].id
// }, { deep: true })
// watch(() => selectedGate.value, () => {
//   if (!isNumber(selectedGate.value))
//     return

//   if (gateList.value.length > 0) {
//     const result = gateList.value.find(item => item.id === selectedGate.value)
//     if (result) {
//       gateList.value.forEach(item => item.selected = false)
//       result.selected = true
//     }
//   }
// })

// watching if the fallback state is active and the refLoadingIndicator component is available
watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION
</script>

<template>
  <HorizontalNavLayout :nav-items="[...navItems]" :app-logo="themeConfig.app.logo" :app-title="themeConfig.app.title">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink to="/" class="app-logo d-flex align-center gap-x-3">
        <VNodeRenderer :nodes="themeConfig.app.logo" />
        <h2 v-if="showGateTitle()" class="app-title font-weight-bold leading-normal text-md text-capitalize">
          <!-- {{ themeConfig.app.title }} -->
          {{ `${$t('gate.title')} : ${selectedGate.title}` }}
        </h2>
      </RouterLink>

      <VSpacer />

      <!-- <NavSearchBar trigger-btn-class="ms-lg-n3" /> -->
      <!--
        <VCombobox
        v-model:model-value="selectedGate" max-width="300px" :return-object="false" auto-select-first="exact"
        class="ml-2" :items="gateList" item-title="title"
        item-value="id" :label="$t('gate.gateselect')"
        />
      -->
      <NavBarI18n
        v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
        :languages="themeConfig.app.i18n.langConfig"
      />

      <NavbarThemeSwitcher />
      <!-- <NavbarShortcuts /> -->
      <!-- <NavBarNotifications class="me-2" /> -->

      <UserProfile />
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Suspense :timeout="0" @fallback="isFallbackStateActive = true" @resolve="isFallbackStateActive = false">
        <Component :is="Component" />
      </Suspense>
    </RouterView>

    <!-- 👉 Footer -->
    <!--
      <template #footer>
      <Footer />
      </template>
    -->

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </HorizontalNavLayout>
</template>
