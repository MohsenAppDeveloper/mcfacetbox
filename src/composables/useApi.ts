import { createFetch } from '@vueuse/core'
import { destr } from 'destr'
import { useLoginState } from '@/store/baseStore'
import type { IRootServiceError } from '@/types/baseModels'
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

      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
      }
      if (response && (response.status === 401)) {
        const loginState = useLoginState()

        loginState.Loginstate.value = LoginState.MustLogin
      }
      if (response && response.status === 403) {
        const result = parsedData as IRootServiceError
        try {
          if (result.error.code && result.error.message === 'Encyclopedia.ErrorCode:010017') {
            setTimeout(() => {
              const loginState = useLoginState()

              loginState.Loginstate.value = LoginState.MustLogout
            }, 5000)
          }
          else { throw (result.error) }
        }
        catch (error) {

        }
      }

      //   console.log('fetcherror', ctx)

      return { data: parsedData, response }
    },
  },
})

export const useApiFake = createFetch({
  baseUrl: '/api',
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

      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
      }

      if (response && (response.status === 401)) {
        const loginState = useLoginState()

        loginState.Loginstate.value = LoginState.MustLogin
      }
      if (response && response.status === 403) {
        const result = parsedData as IRootServiceError
        try {
          if (result.error.code && result.error.message === 'Encyclopedia.ErrorCode:010017') {
            setTimeout(() => {
              const loginState = useLoginState()

              loginState.Loginstate.value = LoginState.MustLogout
            }, 3000)
          }
        }
        catch (error) {

        }
      }

      return { data: parsedData, response }
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
