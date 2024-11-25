import { paginateArray } from '@api-utils/paginateArray'
import { db } from '@db/apps/roles/db'
import is from '@sindresorhus/is'
import destr from 'destr'
import type { PathParams } from 'msw'
import { HttpResponse, http } from 'msw'

export const handlerAppsProjects = [
    // Get Users Details
    http.get(('/api/apps/projects'), ({ request }) => {
        const url = new URL(request.url)

        const q = url.searchParams.get('q')
        const role = url.searchParams.get('role')
        const plan = url.searchParams.get('plan')
        const status = url.searchParams.get('status')
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

        // filter users
        let filteredRols = db.roles.filter(role => ((role.title.toLowerCase().includes(queryLower) || role.createDate === (plan || role.createDate) && role.isActive === (status || role.isActive)))).reverse()

        // sort users
        if (sortByLocal) {
            if (sortByLocal === 'title') {
                filteredRols = filteredRols.sort((a, b) => {
                    if (orderByLocal === 'asc')
                        return a.title.localeCompare(b.title)
                    else
                        return b.title.localeCompare(a.title)
                })
            }
            if (sortByLocal === 'createDate') {
                filteredRols = filteredRols.sort((a, b) => {
                    if (orderByLocal === 'asc')
                        return a.createDate.localeCompare(b.createDate)
                    else
                        return b.createDate.localeCompare(a.createDate)
                })
            }
        }

        const totalItems = filteredRols.length

        // total pages
        const totalPages = Math.ceil(totalItems / itemsPerPageLocal)

        return HttpResponse.json(
            {
                items: paginateArray(filteredRols, itemsPerPageLocal, pageLocal),
                totalPages,
                totalItems,
                page: pageLocal > Math.ceil(totalItems / itemsPerPageLocal) ? 1 : page,
            },
            { status: 200 },
        )
    }),

    // Get Single User Detail
    http.get<PathParams>(('/api/apps/projects/:id'), ({ params }) => {
        const roleId = Number(params.id)

        const role = db.roles.find(e => e.id === roleId)

        if (!role) {
            return HttpResponse.json({ message: 'User not found' }, { status: 404 })
        }
        else {
            return HttpResponse.json(
                {
                    ...role,
                    ...{
                        taskDone: 1230,
                        projectDone: 568,
                        taxId: 'Tax-8894',
                        language: 'English',
                    },
                },
                { status: 200 },
            )
        }
    }),

    // Delete User
    http.delete(('/api/apps/projects/:id'), ({ params }) => {
        const roleId = Number(params.id)

        const userIndex = db.roles.findIndex(e => e.id === roleId)

        if (userIndex === -1) {
            return HttpResponse.json('User not found', { status: 404 })
        }
        else {
            db.roles.splice(userIndex, 1)

            return new HttpResponse(null, {
                status: 204,
            })
        }
    }),

    // 👉 Add user
    http.post(('/api/apps/projects'), async ({ request }) => {
        const user = await request.json() as any

        db.roles.push({
            ...user,
            id: db.roles.length + 1,
        })

        return HttpResponse.json(
            { body: user },
            { status: 201 },
        )
    }),
]
