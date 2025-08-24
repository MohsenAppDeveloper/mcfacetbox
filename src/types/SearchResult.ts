import { isNull, isUndefined } from '@sindresorhus/is'
import { DataBoxType } from './baseModels'
import type { FacetType } from './baseModels'
import { joinWithDots } from '@/utils/stringUtils'
import type { IReference } from '@/utils/refrenceUtils'
import { FirstPageDefaultNumber, PageDefaultSize } from '@/utils/constants'

export function convertFacetItemToFacetTree(items: IFacetItem[]): IFacetTreeItem[] {
  const map = new Map<string, IFacetTreeItem>()

  items.forEach(item => {
    const treeItem: IFacetTreeItem = {
      orderIndex: item.orderIndex,
      facetCount: item.count,
      isSelected: item.isSelected,
      facetKey: item.key,
      title: item.title,
    }

    map.set(item.key, treeItem)
  })

  const result: IFacetTreeItem[] = []

  items.forEach(item => {
    if (item.parent) {
      const parentTreeItem = map.get(useToString(item.parent).value)
      if (parentTreeItem) {
        if (isUndefined(parentTreeItem.children) || isNull(parentTreeItem.children))
          parentTreeItem.children = []

        parentTreeItem.children.push(map.get(item.key)!)
      }
    }
    else {
      result.push(map.get(item.key)!)
    }
  })

  return result
}

export interface IFacetItem {
  orderIndex?: string
  count: number
  isSelected?: boolean
  key: string
  parent?: number
  title: string
}
export interface IFacetTreeItem {
  orderIndex?: string
  facetCount: number
  isSelected?: boolean
  facetKey: string
  children?: IFacetTreeItem[]
  title: string
}
export interface IFacetBox {
  hasSearchBox: boolean
  key: string
  scrollSize: number
  title: string
  type?: FacetType
  itemList: IFacetItem[]
  isTree?: boolean
}
export class FacetBoxModel implements IFacetBox {
  hasSearchBox: boolean
  key: string
  scrollSize: number
  title: string
  type?: FacetType
  itemList: IFacetItem[]
  isTree?: boolean

  constructor(raw: any) {
    this.hasSearchBox = raw.hasSearchBox
    this.key = String(raw.key)
    this.scrollSize = raw.scrollSize
    this.title = raw.title
    this.type = raw.type
    this.isTree = raw.isTree
    this.itemList = (raw.itemList ?? []).map((item: any) => ({
      ...item,
      key: String(item.key),
    }))
  }
}

// export interface IFacetResult {
//     key: string,
//     facetGroups: ISimpleSelectableDTO[]
// }
// export interface ISearchResultTabBoxItem {
//   id: number
//   title: string
//   content: ISimpleSelectableDTO<number>[]

// }
// export interface ISearchResultTabBox extends Record<string, any> {
//   id: number
//   content: ISearchResultTabBoxItem[]
// }

// export class SearchResultTabBoxModel implements ISearchResultTabBox {
//   id: number = 0
//   content: SearchResultTabBoxItemModel[] = []
// }
// export class SearchResultTabBoxItemModel implements ISearchResultTabBoxItem {
//   id: number = 0
//   title: string = ''
//   content: ISimpleSelectableDTO<number>[] = []
// }

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
