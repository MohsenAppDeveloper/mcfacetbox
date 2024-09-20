import { HttpResponse, http } from 'msw'
import { db } from '@db/pages/help-center/db'

export const handlerPagesHelpCenter = [
  http.get(('/api/pages/help-center'), () => {
    return HttpResponse.json(
      { allArticles: db.allArticles, popularArticles: db.popularArticles, keepLearning: db.keepLearning },
      { status: 200 },
    )
  }),

  http.get(('/api/pages/help-center/article'), () => {
    return HttpResponse.json(db.articleData,
      { status: 200 })
  },
  ),
]
