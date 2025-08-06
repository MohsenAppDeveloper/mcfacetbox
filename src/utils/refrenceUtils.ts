export interface IReference {
  bookTitle: string
  author?: string
  volumeNumber?: string
  pageNumber?: string
  edition?: string
  publisher?: string
  year?: string
  city?: string
}
export interface IAyahReference {
  surahTitle: string
  ayahNumber: string
}
export class BookReferenceModel implements IReference {
  bookTitle: string = ''
  author?: string | undefined = ''
  volumeNumber?: string | undefined = ''
  pageNumber?: string | undefined = ''
  edition?: string | undefined = ''
  publisher?: string | undefined = ''
  year?: string | undefined = ''
  city?: string | undefined = ''
}

export function generateFootnoteRefrence(reference: IReference): string {
  let footnote = ''

  // نویسنده (اگر وجود دارد)
  if (reference.author)
    footnote += `${reference.author}, `

  // عنوان کتاب
  footnote += `"${reference.bookTitle}"`

  // شماره جلد (اگر وجود دارد)
  if (reference.volumeNumber)
    footnote += `, جلد. ${reference.volumeNumber}`

  // شماره صفحه (اگر وجود دارد)
  if (reference.pageNumber)
    footnote += `, صفحه. ${reference.pageNumber}`

  // اطلاعات انتشار (اگر وجود دارد)
  const publicationInfo = []
  if (reference.edition)
    publicationInfo.push(`${reference.edition} ed.`)
  if (reference.publisher)
    publicationInfo.push(reference.publisher)
  if (reference.year)
    publicationInfo.push(reference.year)
  if (reference.city)
    publicationInfo.unshift(reference.city)

  if (publicationInfo.length > 0)
    footnote += ` (${publicationInfo.join(', ')})`

  return footnote
}

export function generateAyahFootnoteRefrence(reference: IAyahReference): string {
  let footnote = ''

  // شماره جلد (اگر وجود دارد)
  if (reference.surahTitle)
    footnote += `${reference.surahTitle}`

  // شماره صفحه (اگر وجود دارد)
  if (reference.ayahNumber)
    footnote += `, آیه ${reference.ayahNumber}`

  return footnote
}
