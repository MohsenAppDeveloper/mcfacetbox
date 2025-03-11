import { ofetch } from 'ofetch'
import type { RouterTyped } from 'vue-router/auto'

export class CustomFetchError extends Error {
  public code: number
  public response?: Response
  constructor(code: number, message: string, response?: Response) {
    super(message)
    this.code = code
    this.name = 'CustomError'
    this.response = response
  }
}

export const handleFetchError = (response: Response, router?: RouterTyped) => {
  if (HttpStatusCodesWasHandled.includes(response.status, 0)) {
    if (response.status === 403 && router)
      router.push('/login')
    throw new CustomFetchError(response.status, 'Error Was Handled', response)
  }
  else { throw new CustomFetchError(0, 'Error Not Handled', response) }
}

export const $api = (router?: RouterTyped) => {
  return ofetch.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 6000,
    async onRequest({ options }) {
      const accessToken = useCookie('accessToken').value

      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        }
      }
    },
    async onResponse({ response }) {
      if (!response.ok)
        handleFetchError(response, router)
    },
    async onResponseError({ response }) {
      if (!response.ok)
        handleFetchError(response, router)
    },
  })
}
