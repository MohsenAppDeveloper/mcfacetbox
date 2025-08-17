import type { ISelectable } from './baseModels'
import type { IFacetBox } from './SearchResult'

export interface IBookCreator {
  id: number
  isMain: boolean
  name: string
  role: string
}
export interface IBookLanguage {
  id: number
  name: string
  isoCode: string
}
export interface IBookPublishYear {
  calendarTitle: string
  calendarType: string
  year: string
}
export interface IBookPublisher {
  id: number
  place: string
  isoCode: string
}
export interface IBookInfo extends IBook {
  creatorList: IBookCreator[]
  publisherList: IBookPublisher[]
  languageList: IBookLanguage[]
  publishYearList: IBookPublishYear[]
  thumbnailUrl: string
  link: string
}

export interface IBook {
  bookId: number
  title: string
}
export interface IBookSearchResult {
  facetList: IFacetBox[]
  resultList: ISelectableBookInfo[]
  resultListTotalCount: number
  pageNumber: number
  pageSize: number
}

export interface ISelectableBookInfo extends ISelectable, IBookInfo {

}
export class SelectableBookInfo implements ISelectable, IBookInfo {
  bookId: number = 0
  creatorList: IBookCreator[] = []
  publisherList: IBookPublisher[] = []
  languageList: IBookLanguage[] = []
  publishYearList: IBookPublishYear[] = []
  thumbnailUrl: string = ''
  link: string = ''
  id: number = 0
  title: string = ''
  selectable?: boolean | undefined = true
  selected?: boolean | undefined = false
  constructor(bookid: number, booktitle: string, itemselected: boolean) {
    this.bookId = bookid
    this.title = booktitle
    this.selected = itemselected
  }
}

export class BookSearchRequestModel implements Record<string, any> {
  [x: string]: any;
  language: string = 'fa'
  page_size: number = 10
  page_number: number = 1
  sort: string = 'title-asc'
  origin: string = 'noorlib.web.app'
  query: string = ''
}
