import type { ISimpleDTO, ISimpleTree, baseDataTableModel, baseItemState } from './baseModels'

export function createTreeIndex(tree: ISimpleTree[]): Record<number, ISimpleTree> {
  const index: Record<number, ISimpleTree> = {}

  function populateIndex(nodes: ISimpleTree[]) {
    for (const node of nodes) {
      index[node.id] = node
      if (node.children)
        populateIndex(node.children)
    }
  }
  populateIndex(tree)

  return index
}

export interface ITreeTitle extends Record<string, any>, baseItemState {
  id: number
  title: string
  book: ISimpleDTO[]
  createDate: string
  isActive: boolean
  description: string
}

export class TreeTitleModel implements ITreeTitle {
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  tempData: any
  [x: string]: any;
  id: number = 0
  title: string = ''
  book: ISimpleDTO[] = []
  createDate: string = ''
  isActive: boolean = false
  description: string = ''
}
