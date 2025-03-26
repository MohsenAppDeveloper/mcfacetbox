<!-- ❗Errors in the form are set on line 60 -->
<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { CustomFetchError } from '@/utils/api'
import type { IProfile, ITokenProfile } from '@/types/users'
import { LoginState } from '@/types/baseModels'
import { useLoginState } from '@/store/baseStore'

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
const toast = useToast()
const ability = useAbility()
const loginfailed = ref(false)

async function sendTokenRequest(systemKey: string) {
  try {
    const result = await $api<ITokenProfile>(`${ServerApiAddress}api/account/token/${systemKey}`, {
      method: 'GET',
    })

    if (result.token) {
      useCookie<IProfile | null>('userData').value = result.profile
      useCookie('accessToken').value = result.token

      //   gatelist.value.splice(0)
      //   gatelist.value.push(...result.gates.map<ISimpleSelectableDTO>(item => ({ id: item.id, title: item.title, tempData: null })))
      //   gatelist.value[0].selected = true
      useCookie('userAbilityRules').value = JSON.stringify([{ action: 'manage', subject: 'all' }])
      ability.update([{ action: 'manage', subject: 'all' }])

      const loginstate = useLoginState()

      loginstate.Loginstate.value = LoginState.Login

      // console.log('ability', ability.can('read', 'Report'), userAbilityRules);
      await nextTick(() => {
        router.replace(route.query.to ? String(route.query.to) : '/')
      })
    }
    else {
      loginfailed.value = true
    }
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code > 0)
      toast.error(error.message)

    //   toast.error(t(`httpstatuscodes.${error.code}`))
    else toast.error(t('httpstatuscodes.0'))
    loginfailed.value = true
  }
}
async function tryLogin() {
  await nextTick(() => {
    window.location.href = `${ServerApiAddress}signin?returnUrl=${import.meta.env.VITE_CLIENT_ADDRESS}auth?key={0}`
  })
}
onMounted(async () => {
  if ((route.query.key?.length ?? 0) > 0) {
    // route.query.key?.toString() ?? ''
    sendTokenRequest(route.query.key?.toString() ?? '')
  }
  else {
    await tryLogin()
  }
})
</script>

<template>
  <!--
    <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
    <VNodeRenderer :nodes="themeConfig.app.logo" />
    <h1 class="auth-title">
    {{ themeConfig.app.title }}
    </h1>
    </div>
    </RouterLink>
  -->

  <div v-if="!loginfailed" class="welcome-msg-container">
    <h2>{{ $t('authenticating') }}</h2>
    <p>{{ $t('authenticatingplzwait') }}</p>
    <div class="loader" />
    <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
  </div>

  <div v-else class="welcome-msg-container">
    <h2>{{ $t('authenticateerror') }}</h2>
    <p>{{ $t('plzretryafewmin') }}</p>
    <VIcon icon="tabler-alert-octagon" size="44" class="mb-3" color="error" />
    <VBtn
      class="mb-11"
      @click="tryLogin"
    >
      {{ $t('retry') }}
    </VBtn>
    <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
  </div>
  <!--
    <VCol md="8" class="d-none d-md-flex">
    <div class="position-relative bg-background w-100 me-0">
    <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 6.25rem;">
    <VImg max-width="613" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
    </div>

    <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
    </div>
    </VCol>
  -->
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
