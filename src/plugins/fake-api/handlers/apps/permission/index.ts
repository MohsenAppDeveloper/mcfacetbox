import is from '@sindresorhus/is'
import { destr } from 'destr'
import { HttpResponse, http } from 'msw'
import { db } from '@db/apps/permission/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppsPermission = [
  // 👉 Get Permission List
  http.get(('/api/apps/permissions'), ({ request }) => {
    const url = new URL(request.url)

    const q = url.searchParams.get('q') || ''
    const sortBy = url.searchParams.get('sortBy')
    const page = url.searchParams.get('page') || 1
    const itemsPerPage = url.searchParams.get('itemsPerPage') || 10
    const orderBy = url.searchParams.get('orderBy')

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()

    let filteredPermissions = db.permissions.filter(
      permissions =>
        permissions.name.toLowerCase().includes(queryLower)
        || permissions.createdDate.toLowerCase().includes(queryLower)
        || permissions.assignedTo.some((i: string) => i.toLowerCase().startsWith(queryLower)),
    )

    // Sorting Permissions
    if (sortByLocal && sortByLocal === 'name') {
      filteredPermissions = filteredPermissions.sort((a, b) => {
        if (orderByLocal === 'asc')
          return a.name.localeCompare(b.name)

        return b.name.localeCompare(a.name)
      })
    }

    // return response with paginated data
    return HttpResponse.json(
      {
        permissions: paginateArray(filteredPermissions, itemsPerPageLocal, pageLocal),
        totalPermissions: filteredPermissions.length,
      },
      {
        status: 200,
      },
    )
  }),
]
