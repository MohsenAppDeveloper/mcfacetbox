import is from '@sindresorhus/is'
import { destr } from 'destr'
import { HttpResponse, http } from 'msw'
import { db } from '@db/apps/logistics/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppLogistics = [
  http.get(('/api/apps/logistics/vehicles'), ({ request }) => {
    const url = new URL(request.url)
    const sortBy = url.searchParams.get('sortBy')
    const page = url.searchParams.get('page') ?? 1
    const itemsPerPage = url.searchParams.get('itemsPerPage') ?? 10
    const orderBy = url.searchParams.get('orderBy')

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    // Sorting Vehicles
    let vehicles = [...db.vehicles]

    if (sortBy) {
      if (sortByLocal === 'location') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.location - b.location

          return b.location - a.location
        })
      }

      if (sortByLocal === 'startRoute') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.startCity.localeCompare(b.startCity)

          return b.startCity.localeCompare(a.startCity)
        })
      }

      if (sortByLocal === 'endRoute') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.endCity.localeCompare(b.endCity)

          return b.endCity.localeCompare(a.endCity)
        })
      }

      if (sortByLocal === 'warnings') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.warnings.localeCompare(b.warnings)

          return b.warnings.localeCompare(a.warnings)
        })
      }

      if (sortByLocal === 'progress') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.progress - b.progress

          return b.progress - a.progress
        })
      }
    }

    return HttpResponse.json(
      {
        vehicles: paginateArray(vehicles, itemsPerPageLocal, pageLocal),
        totalVehicles: vehicles.length,
      },
      { status: 200 },
    )
  }),
]
