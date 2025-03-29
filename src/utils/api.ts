import { FetchError, ofetch } from 'ofetch'
import { useLoginState } from '@/store/baseStore'
import { LoginState } from '@/types/baseModels'

export class CustomFetchError extends FetchError {
  public code: number
  public response?: Response
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'CustomError'
  }
}

export const handleFetchError = async (responseData: any, statusCode: number) => {
//   if (HttpStatusCodesWasHandled.includes(response.status, 0)) {
  if (statusCode === 401) {
    const loginState = useLoginState()

    loginState.Loginstate.value = LoginState.MustLogin

    return
  }
  if (responseData && responseData.error && responseData.error.code && responseData.error.code === 'Encyclopedia.ErrorCode:010017' && statusCode === 403) {
    setTimeout(() => {
      const loginState = useLoginState()

      loginState.Loginstate.value = LoginState.MustLogout
    }, 4000)
  }
  if (responseData && responseData.error && responseData.error.message)
    throw new CustomFetchError(2, responseData.error.message)
  else
    throw new CustomFetchError(0, 'Error Not Handled')

  // else
  //   throw new CustomFetchError(response.status, 'Error Was Handled', response)
//   }
//   else { throw new CustomFetchError(0, 'Error Not Handled', response) }
}

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 6000,
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value

    options.headers = {
      ...options.headers,
      'Accept-Language': 'fa-IR',
    }
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Accept-Language': 'fa-IR',
        'Authorization': `Bearer ${accessToken}`,
      }
    }
  },

  async onResponse({ response }) {
    if (!response.ok)
      await handleFetchError(response._data, response.status)
  },
  async onResponseError({ response }) {
    if (!response.ok)
      await handleFetchError(response._data, response.status)
  },
})

export const $apiFake = ofetch.create({
  baseURL: '/api',
  timeout: 6000,
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value

    options.headers = {
      ...options.headers,
      'Accept-Language': 'fa-IR',
    }
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Accept-Language': 'fa-IR',
        'Authorization': `Bearer ${accessToken}`,
      }
    }
  },

  async onResponse({ response }) {
    if (!response.ok)
      await handleFetchError(response._data, response.status)
  },
  async onResponseError({ response }) {
    if (!response.ok)
      await handleFetchError(response._data, response.status)
  },
})
