import is from '@sindresorhus/is'
import destr from 'destr'
import { HttpResponse, http } from 'msw'
import { db } from '@db/dashboard/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerDashboard = [
  http.get('/api/dashboard/analytics/projects', ({ request }) => {
    const url = new URL(request.url)

    const q = url.searchParams.get('q')
    const sortBy = url.searchParams.get('sortBy')
    const itemsPerPage = url.searchParams.get('itemsPerPage')
    const page = url.searchParams.get('page')
    const orderBy = url.searchParams.get('orderBy')

    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    let filteredProjects = db.analytics.filter(project => ((project.name.toLowerCase().includes(queryLower) || project.leader.toLowerCase().includes(queryLower)) || project.project.toLowerCase().includes(queryLower))).reverse()

    if (sortByLocal) {
      console.log(sortByLocal)
      if (sortByLocal === 'project') {
        filteredProjects = filteredProjects.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.name.localeCompare(b.name)
          else
            return b.name.localeCompare(a.name)
        })
      }

      if (sortByLocal === 'leader') {
        filteredProjects = filteredProjects.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.leader.localeCompare(b.leader)
          else
            return b.leader.localeCompare(a.leader)
        })
      }

      if (sortByLocal === 'progress') {
        filteredProjects = filteredProjects.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.progress - b.progress
          else
            return b.progress - a.progress
        })
      }
    }

    const totalProjects = filteredProjects.length
    const totalPages = Math.ceil(totalProjects / itemsPerPageLocal)

    return HttpResponse.json(
      {
        projects: paginateArray(filteredProjects, itemsPerPageLocal, pageLocal),
        totalPages,
        totalProjects,
        page: pageLocal > Math.ceil(totalProjects / itemsPerPageLocal) ? 1 : page,
      },
      { status: 200 },
    )
  }),
]
