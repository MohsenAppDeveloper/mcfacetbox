import { createFetch } from '@vueuse/core'

import { destr } from 'destr'

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
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
  },
})

// export const resolveServiceResponseMessage = (responseData: Record<string, any> | undefined, itemskey: string) => {
//     if (isUndefined(responseData[itemskey] ?? undefined)) {
//         toast.error(t('probleminGetInformation'))
//     }
//     if (responseData[itemskey].length <= 0)
//         toast.info(t('resultNotFound'))
// }
