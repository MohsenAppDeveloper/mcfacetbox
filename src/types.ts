export enum FacetType {
  flat = 1,
  tree = 2,
  switch = 3,
}

export interface IFacetItem {
  orderIndex?: string
  count: number
  isSelected?: boolean
  key: string
  parent?: number | string | null
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

export function convertFacetItemToFacetTree(items: IFacetItem[]): IFacetTreeItem[] {
  const map = new Map<string, IFacetTreeItem>()

  for (const item of items) {
    const k = String(item.key)

    map.set(k, {
      orderIndex: item.orderIndex,
      facetCount: item.count,
      isSelected: item.isSelected,
      facetKey: k,
      title: item.title,
    })
  }

  const roots: IFacetTreeItem[] = []

  for (const item of items) {
    const parentKey = item.parent == null ? null : String(item.parent)
    const node = map.get(String(item.key))!
    if (parentKey && map.has(parentKey)) {
      const parent = map.get(parentKey)!
      if (!parent.children)
        parent.children = []
      parent.children.push(node)
    }
    else {
      roots.push(node)
    }
  }

  return roots
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

export function normalizeText(text: string): string {
  return text.toLowerCase().trim()
}

export function searchItems<T>(items: T[], searchText: string, field: keyof T): T[] {
  const normalized = normalizeText(String(searchText ?? ''))

  return items.filter(item => normalizeText(String((item as any)[field] ?? '')).includes(normalized))
}
