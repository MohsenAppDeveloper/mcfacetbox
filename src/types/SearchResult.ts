import { isNull, isUndefined } from '@sindresorhus/is'
import type { FacetType, ISimpleSelectableDTO } from './baseModels'
import { joinWithDots } from '@/utils/stringUtils'

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

export interface IqaelItem {
  id: number
  roleId: number
  title: string
  roleTitle: string
}
export interface ISearchResultItem {
  [x: string]: any
  highLight: string[]
  readonly highlightText: string
  id: number
  text: string
  shortText: string
}
export interface IHadithSearchResultItem extends ISearchResultItem {
  qaelTitleList: string
  noorLibLink: string
  qaelList: IqaelItem[]
  bookTitle: string
  bookTitleShort: string
  pageNum: number
  sourceId: number
  vol: number
}
export class HadithSearchResultItemModel implements IHadithSearchResultItem {
  highLight: string[] = []
  get highlightText(): string {
    return joinWithDots(this.highLight, {
      separator: ' ... ',
      maxItems: 30,
      ellipsisText: '',
    })
  }

  id: number = 0
  qaelTitleList: string = ''
  noorLibLink: string = ''
  qaelList: IqaelItem[] = []
  bookTitle: string = ''
  bookTitleShort: string = ''
  pageNum: number = 0
  sourceId: number = 0
  vol: number = 0
  constructor(highlight: string[] = [], id: number = 0, qaelTitleList: string = '', noorLibLink: string = '', qaelList: IqaelItem[] = [], bookTitle: string = '', bookTitleShort: string = '', sourceId: number = 0, pageNum: number = 0, vol: number = 0) {
    this.highLight = highlight
    this.id = id
    this.qaelTitleList = qaelTitleList
    this.noorLibLink = noorLibLink
    this.qaelList = qaelList
    this.bookTitle = bookTitle
    this.bookTitleShort = bookTitleShort
    this.pageNum = pageNum
    this.sourceId = sourceId
    this.vol = vol
  }

  [x: string]: any
  text: string = ''
  shortText: string = ''
}

export class SearchResultItemModel implements ISearchResultItem {
  [x: string]: any
  highLight: string[] = []
  highlightText: string = ''
  id: number = 0
  text: string = ''
  shortText: string = ''
  constructor(highlight: string[] = [], id: number = 0, shortText = '', text = '') {
    this.highLight = highlight
    this.id = id
    this.shortText = shortText
    this.text = text
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

// export const qaelSearchResultItemSchema = z.object({
//   id: z.number(),
//   roleId: z.number(),
//   title: z.string(),
//   roleTitle: z.string(),
// })

// export const hadithSearchResultItemSchema = z.object({
//   highLight: z.array(z.string()),
//   id: z.number(),
//   qaelTitleList: z.string(),
//   noorLibLink: z.string(),

//   qaelList: z.object(qaelSearchResultItemSchema),
//   bookTitle: z.string(),
//   bookTitleShort: z.string(),
//   pageNum: z.number(),
//   sourceId: z.number(),
//   vol: z.number(),
// })
