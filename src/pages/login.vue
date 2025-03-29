<!-- ❗Errors in the form are set on line 60 -->
<script setup lang="ts">
import { useLoginState } from '@/store/baseStore'
import { LoginState } from '@/types/baseModels'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'

import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const loginState = useLoginState()

loginState.Loginstate.value = LoginState.Logout
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
</script>

<template>
  <div class="welcome-msg-container">
    <h2>{{ $t('youareloggedout') }}</h2>
    <VIcon icon="tabler-login" size="44" class="mb-3" color="primary" />
    <VBtn
      class="mb-11"
      :to="`/auth${$route.query.to ? `?to=${String($route.query.to)}` : ''}`"
    >
      {{ $t('login') }}
    </VBtn>
    <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
  </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";
</style>
