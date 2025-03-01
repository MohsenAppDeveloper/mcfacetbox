import { ofetch } from 'ofetch'

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

export const handleFetchError = (response: Response) => {
//   const router = useRouter()
  if (HttpStatusCodesWasHandled.includes(response.status, 0)) {
    // if (response.status === 401)
    //   router.push('/auth')
    throw new CustomFetchError(response.status, 'Error Was Handled', response)
  }
  else { throw new CustomFetchError(0, 'Error Not Handled', response) }
}

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
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
      handleFetchError(response)
  },
  async onResponseError({ response }) {
    if (!response.ok)
      handleFetchError(response)
  },
})
