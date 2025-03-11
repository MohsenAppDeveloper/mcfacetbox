<!-- ❗Errors in the form are set on line 60 -->
<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)

const route = useRoute()
const router = useRouter()

const ability = useAbility()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

const refVForm = ref<VForm>()

const credentials = ref({
  email: 'admin@demo.com',
  password: 'admin',
})

const rememberMe = ref(false)

const login = async () => {
  try {
    const res = await $api()('/auth/login', {
      method: 'POST',
      body: {
        email: credentials.value.email,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })

    const { accessToken, userData, userAbilityRules } = res

    useCookie('userAbilityRules').value = userAbilityRules
    ability.update(userAbilityRules)

    // console.log('ability', ability.can('read', 'Report'), userAbilityRules);

    useCookie('userData').value = userData
    useCookie('accessToken').value = accessToken

    // Redirect to `to` query if exist or redirect to index route
    // ❗ nextTick is required to wait for DOM updates and later redirect
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
  }
  catch (err) {
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        login()
    })
}
</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow no-gutters class="auth-wrapper bg-surface">
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

    <VCol cols="12" md="12" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">
            خوش آمدید <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
          </h4>
          <p class="mb-0">
            وارد اکانت خود شوید و پژوهش را شروع کنید
          </p>
        </VCardText>
        <VCardText>
          <VAlert color="primary" variant="tonal">
            <p class="text-sm mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-sm mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText>
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.email" label="پست الکترونیکی" placeholder="johndoe@email.com" type="email"
                  autofocus :rules="[requiredValidator, emailValidator]" :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password" label="کلمه عبور" placeholder="············"
                  :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                  <VCheckbox v-model="rememberMe" label="به خاطر بسپار" />
                  <RouterLink class="text-primary ms-2 mb-1" :to="{ name: 'forgot-password' }">
                    فراموشی رمز عبور
                  </RouterLink>
                </div>

                <VBtn block type="submit">
                  ورود
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center">
                <span>جدید هستید؟</span>
                <RouterLink class="text-primary ms-1" :to="{ name: 'register' }">
                  ساخت اکانت
                </RouterLink>
              </VCol>
              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol cols="12" class="text-center">
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
