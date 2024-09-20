import is from '@sindresorhus/is'
import destr from 'destr'
import { HttpResponse, http } from 'msw'
import { db } from '@db/apps/academy/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppsAcademy = [

  // 👉 Course
  http.get(('/api/apps/academy/courses'), ({ request }) => {
    const url = new URL(request.url)

    const q = url.searchParams.get('q')
    const label = url.searchParams.get('label') || 'All Courses'
    const hideCompleted = url.searchParams.get('hideCompleted')
    const page = url.searchParams.get('page')
    const itemsPerPage = url.searchParams.get('itemsPerPage')
    const sortBy = url.searchParams.get('sortBy')
    const orderBy = url.searchParams.get('orderBy')

    const searchQuery = is.string(q) ? q : undefined
    const queryLowered = (searchQuery ?? '').toString().toLowerCase()

    const parsedHideCompleted = destr(hideCompleted)
    const hideCompletedLocal = is.boolean(parsedHideCompleted) ? parsedHideCompleted : false

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    const filteredCourses = db.courses.filter(course => {
      return (
        (
          course.courseTitle.toLowerCase().includes(queryLowered)
                || course.user.toLowerCase().includes(queryLowered)
        )
            && !((course.completedTasks === course.totalTasks) && hideCompletedLocal)
            && (label !== 'All Courses' ? course.tags.toLocaleLowerCase() === label?.toLowerCase() : true)
      )
    })

    if (sortByLocal) {
      if (sortByLocal === 'courseName') {
        filteredCourses.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.courseTitle.localeCompare(b.courseTitle)
          else
            return b.courseTitle.localeCompare(a.courseTitle)
        })
      }
      if (sortByLocal === 'progress') {
        filteredCourses.sort((a, b) => {
          if (orderByLocal === 'asc')
            return (a.completedTasks / a.totalTasks) - (b.completedTasks / b.totalTasks)
          else
            return (b.completedTasks / b.totalTasks) - (a.completedTasks / a.totalTasks)
        })
      }
    }

    return HttpResponse.json({
      totalCourse: filteredCourses,
      courses: paginateArray(filteredCourses, itemsPerPageLocal, pageLocal),
      total: filteredCourses.length,
    },
    { status: 200 })
  }),

  // 👉 Course Details
  http.get(('/api/apps/academy/course-details'), () => {
    return HttpResponse.json(db.courseDetails, { status: 200 })
  }),
]
