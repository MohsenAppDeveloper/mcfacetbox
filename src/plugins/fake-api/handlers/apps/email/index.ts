import { destr } from 'destr'
import { HttpResponse, http } from 'msw'
import { db } from '@db/apps/email/db'
import type { Email, EmailLabel } from '@db/apps/email/types'

export const handlerAppsEmail = [
  // 👉 Get Email List
  http.get(('/api/apps/email'), ({ request }) => {
    const url = new URL(request.url)

    const q = url.searchParams.get('q') || ''
    const filter = url.searchParams.get('filter') || 'inbox'
    const label = url.searchParams.get('label') || ''

    const queryLowered = q.toLowerCase()

    function isInFolder(email: Email) {
      if (filter === 'trashed')
        return email.isDeleted
      if (filter === 'starred')
        return email.isStarred && !email.isDeleted

      return email.folder === (filter || email.folder) && !email.isDeleted
    }

    const filteredData = db.emails.filter(
      email =>
        (email.from.name.toLowerCase().includes(queryLowered) || email.subject.toLowerCase().includes(queryLowered))
            && isInFolder(email as Email)
            && (label ? email.labels.includes(label as EmailLabel) : true),
    )

    // ------------------------------------------------
    // Email Meta
    // ------------------------------------------------
    const emailsMeta = {
      inbox: db.emails.filter(email => !email.isDeleted && !email.isRead && email.folder === 'inbox').length,
      draft: db.emails.filter(email => !email.isDeleted && email.folder === 'draft').length,
      spam: db.emails.filter(email => !email.isDeleted && !email.isRead && email.folder === 'spam').length,
      star: db.emails.filter(email => !email.isDeleted && email.isStarred).length,
    }

    return HttpResponse.json({ emails: filteredData, emailsMeta }, { status: 200 })
  }),

  // 👉 Update Email Meta
  http.post(('/api/apps/email'), async ({ request }) => {
    const { ids, data, label } = await request.json() as { ids: Email['id'] | Email['id'][]; data: Partial<Email>; label: EmailLabel }

    const labelLocal = destr(label)

    if (!labelLocal) {
      const emailIdsLocal = destr(ids) as unknown as Email['id'][]

      function updateMailData(email: Email) {
        Object.assign(email, data)
      }

      db.emails.forEach((email: Email) => {
        if (emailIdsLocal.includes(email.id))
          updateMailData(email)
      })

      return new HttpResponse(null, { status: 201 })
    }
    else {
      function updateMailLabels(email: Email) {
        const labelIndex = email.labels.indexOf(label)

        if (labelIndex === -1)
          email.labels.push(label)
        else email.labels.splice(labelIndex, 1)
      }

      db.emails.forEach(email => {
        if (Array.isArray(ids) ? ids.includes(email.id) : ids === email.id)
          updateMailLabels(email)
      })

      return new HttpResponse(null, { status: 201 })
    }
  }),

]
