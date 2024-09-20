import { HttpResponse, http } from 'msw'
import { db } from '@db/pages/profile/db'

export const handlerPagesProfile = [
  // GET /pages/profile
  http.get(('/api/pages/profile'), ({ request }) => {
    const url = new URL(request.url)

    const tab = url.searchParams.get('tab') || ''

    return HttpResponse.json(db.data[tab as keyof typeof db.data],
      { status: 200 })
  }),

  // GET /pages/profile/header
  http.get(('/api/pages/profile/header'), () => {
    return HttpResponse.json(db.data.profileHeader,
      { status: 200 })
  }),
]
