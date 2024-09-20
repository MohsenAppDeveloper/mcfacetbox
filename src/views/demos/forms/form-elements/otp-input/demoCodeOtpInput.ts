export const basic = {
  ts: `<template>
  <VOtpInput />
</template>
`,
  js: `<template>
  <VOtpInput />
</template>
`,
}

export const finish = {
  ts: `<script setup lang="ts">
const loading = ref(false)
const snackbar = ref(false)
const snackbarColor = ref('default')
const otp = ref('')
const text = ref('')
const expectedOtp = ref('133707')

const onFinish = (rsp: unknown) => {
  loading.value = true

  setTimeout(() => {
    loading.value = false
    snackbarColor.value = (rsp === expectedOtp.value) ? 'success' : 'warning'
    text.value = \`Processed OTP with "\${rsp}" (\${snackbarColor.value})\`
    snackbar.value = true
  }, 3000)
}
</script>

<template>
  <div>
    <VOtpInput
      v-model="otp"
      :loading="loading"
      @finish="onFinish"
    />

    <div>
      Expected value: <span class="font-weight-bold">{{ expectedOtp }}</span>
    </div>

    <VSnackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="2000"
      location="top"
    >
      {{ text }}
    </VSnackbar>
  </div>
</template>
`,
  js: `<script setup>
const loading = ref(false)
const snackbar = ref(false)
const snackbarColor = ref('default')
const otp = ref('')
const text = ref('')
const expectedOtp = ref('133707')

const onFinish = rsp => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    snackbarColor.value = rsp === expectedOtp.value ? 'success' : 'warning'
    text.value = \`Processed OTP with "\${ rsp }" (\${ snackbarColor.value })\`
    snackbar.value = true
  }, 3000)
}
</script>

<template>
  <div>
    <VOtpInput
      v-model="otp"
      :loading="loading"
      @finish="onFinish"
    />

    <div>
      Expected value: <span class="font-weight-bold">{{ expectedOtp }}</span>
    </div>

    <VSnackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="2000"
      location="top"
    >
      {{ text }}
    </VSnackbar>
  </div>
</template>
`,
}

export const hidden = {
  ts: `<script setup lang="ts">
const otp = ref('')
</script>

<template>
  <VOtpInput
    v-model="otp"
    autocomplete="on"
    type="password"
    length="5"
  />
</template>
`,
  js: `<script setup>
const otp = ref('')
</script>

<template>
  <VOtpInput
    v-model="otp"
    autocomplete="on"
    type="password"
    length="5"
  />
</template>
`,
}
