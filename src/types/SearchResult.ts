import { isNull, isUndefined } from '@sindresorhus/is'
import type { ISimpleSelectableDTO } from './baseModels'

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
  type?: string
  itemList: IFacetItem[]
  isTree?: boolean
}

// export interface IFacetResult {
//     key: string,
//     facetGroups: ISimpleSelectableDTO[]
// }
export interface ISearchResultTabBoxItem {
  id: number
  title: string
  content: ISimpleSelectableDTO<number>[]

}
export interface ISearchResultTabBox extends Record<string, any> {
  id: number
  content: ISearchResultTabBoxItem[]
}

export class SearchResultTabBoxModel implements ISearchResultTabBox {
  id: number = 0
  content: SearchResultTabBoxItemModel[] = []
}
export class SearchResultTabBoxItemModel implements ISearchResultTabBoxItem {
  id: number = 0
  title: string = ''
  content: ISimpleSelectableDTO<number>[] = []
}
