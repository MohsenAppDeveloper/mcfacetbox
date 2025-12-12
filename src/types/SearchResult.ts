// import type { IFacetBox } from 'mcfacetbox'
import type { IFacetBox } from '../../packages/mcfacetbox/src/types'
import { DataBoxType } from './baseModels'
import { joinWithDots } from '@/utils/stringUtils'
import type { IReference } from '@/utils/refrenceUtils'
import { FirstPageDefaultNumber } from '@/utils/constants'

export interface ISearchResultItem {
  [x: string]: any
  highLight: string[]
  readonly highlightText: string
  id: number | string
  text: string
  shortText: string
  readonly hasShortText: boolean

  readonly refrenceAsString: string
  readonly refrenceAsModel: IReference
  readonly ayahRefrenceAsString: string
}

/**
 * Base class for search result items
 */
export class SearchResultItemModel implements ISearchResultItem {
  highLight: string[] = []
  id: number | string = 0
  text: string = ''
  shortText: string = ''

  constructor(
    highLight: string[] = [],
    id: number | string = 0,
    text: string = '',
    shortText: string = '',
  ) {
    this.highLight = highLight
    this.id = id
    this.text = text
    this.shortText = shortText
  }

  get refrenceAsString(): string { return ' ' }
  get refrenceAsModel(): IReference { return { bookTitle: ' ' } }
  get ayahRefrenceAsString(): string { return ' ' }

  [x: string]: any

  get highlightText(): string {
    return joinWithDots(this.highLight, {
      separator: '',
      maxItems: 30,
      ellipsisText: '',
    })
  }

  get hasShortText(): boolean {
    return !!((this.highLight && this.highLight.some(item => item.includes('...'))) || this.shortText.length > 0)
  }
}

export interface ITabSearchStateResult {
  page: number
  totalItems: number
  facets: IFacetBox[]
  selectedFacets: Record<string, string[]>
  results: ISearchResultItem[]
  loading: boolean
}
export class TabSearchStateResultModel implements ITabSearchStateResult {
  page: number = FirstPageDefaultNumber
  totalItems: number = 0
  facets: IFacetBox[] = []
  selectedFacets: Record<string, string[]> = {}
  results: ISearchResultItem[] = []
  loading: boolean = false

  public resetCollections = () => {
    this.facets.splice(0)
    this.results.splice(0)
    this.loading = false
  }

  public resetPaging = () => {
    this.page = FirstPageDefaultNumber
    this.totalItems = 0
  }

  public resetAll = () => {
    this.resetCollections()

    Object.keys(this.selectedFacets).forEach(key => {
      delete this.selectedFacets[key]
    })
    this.page = FirstPageDefaultNumber
    this.totalItems = 0
  }
}

export interface ISearchResultConfig {
  title: string
  setting: Record<string, string>
  category: string
}

export class SearchResultConfigModel implements ISearchResultConfig {
  title: string = ''
  setting: Record<string, string> = {}
  category: string = DataBoxType.hadith.toString()

  constructor(config: Partial<ISearchResultConfig> = {}) {
    this.title = config.title || ''
    this.category = config.category || DataBoxType.hadith.toString()
    this.setting = config.setting || {}
  }
}
