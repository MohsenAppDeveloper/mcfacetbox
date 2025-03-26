import { createFetch } from '@vueuse/core'
import type { RouterTyped } from 'vue-router/auto'

import { destr } from 'destr'
import { useLoginState } from '@/store/baseStore'
import { LoginState } from '@/types/baseModels'

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    // immediate: false,
    updateDataOnError: true,
    refetch: true,
    async beforeFetch({ options }) {
      const accessToken = useCookie('accessToken').value

      options.headers = {
        ...options.headers,
        'Accept-Language': 'fa-IR',
      }
      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,

        }
      }

      return { options }
    },
    afterFetch(ctx) {
      const { data, response } = ctx

      // Parse data if it's JSON

      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
      }

      return { data: parsedData, response }
    },
    onFetchError(ctx) {
      const { response, data } = ctx

      const parsedData = null
      try {
        // parsedData = destr(data)

        // const res = response?.json()

        // console.log('parsedres', res)
        // console.log('parseddata', parsedData)
      }
      catch (error) {
      }

      if (response && (response.status === 401)) {
        const loginState = useLoginState()

        loginState.Loginstate.value = LoginState.MustLogout
      }

      return { data, response }
    },
  },
})

// export const resolveServiceResponseMessage = (responseData: Record<string, any> | undefined, itemskey: string) => {
//     if (isUndefined(responseData[itemskey] ?? undefined)) {
//         toast.error(t('probleminGetInformation'))
//     }
//     if (responseData[itemskey].length <= 0)
//         toast.info(t('resultNotFound'))
// }
