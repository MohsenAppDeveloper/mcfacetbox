import is from '@sindresorhus/is'
import destr from 'destr'
import { HttpResponse, http } from 'msw'
import { db } from '@db/apps/calendar/db'
import { genId } from '@api-utils/genId'

export const handlerAppsCalendar = [

  // 👉 Get Calendar Events
  http.get(('/api/apps/calendar'), ({ request }) => {
    const url = new URL(request.url)

    const queries = url.searchParams.getAll('calendars')

    const parsedCalendars = destr(queries)

    const calendars = is.array(parsedCalendars) ? parsedCalendars : undefined

    const events = db.events.filter(event => calendars?.includes(event.extendedProps.calendar))

    return HttpResponse.json(events, { status: 200 })
  }),

  // 👉 Add Calendar Event
  http.post(('/api/apps/calendar'), async ({ request }) => {
    const event = await request.json() as typeof db.events[0]

    db.events.push({
      ...event,
      id: genId(db.events),
    })

    return HttpResponse.json(event, { status: 201 })
  }),

  // 👉 Update Calendar Event
  http.put(('/api/apps/calendar/:id'), async ({ request, params }) => {
    const updatedEvent = await request.json() as typeof db.events[0]

    updatedEvent.id = Number(updatedEvent.id)

    const eventId = Number(params.id)

    // Find the index of the event in the database
    const currentEvent = db.events.find(e => e.id === eventId)

    // update event
    if (currentEvent) {
      Object.assign(currentEvent, updatedEvent)

      return HttpResponse.json(currentEvent, {
        status: 201,
      })
    }

    return new HttpResponse(
      'Something Went Wrong',
      { status: 400 },
    )
  }),

  // 👉 Delete Calendar Event
  http.delete(('/api/apps/calendar/:id'), ({ params }) => {
    const eventId = Number(params.id)

    const eventIndex = db.events.findIndex(e => e.id === eventId)

    if (eventIndex !== -1) {
      db.events.splice(eventIndex, 1)

      return new HttpResponse(null, {
        status: 204,
      })
    }

    return new HttpResponse(
      'Something Went Wrong',
      { status: 400 },
    )
  }),
]
