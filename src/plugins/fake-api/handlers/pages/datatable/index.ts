import { HttpResponse, http } from 'msw'
import { db } from '@db/pages/datatable/db'

export const handlerPagesDatatable = [
  http.get(('/api/pages/datatable'), () => {
    return HttpResponse.json(db.salesDetails,
      { status: 200 })
  }),
]
