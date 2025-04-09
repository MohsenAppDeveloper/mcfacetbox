import type { ISimpleTree, baseItemState } from './baseModels'

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
export enum NodeType {
  Sibling = 2,
  Children = 1,
  SiblingAfter = 3,
  SiblingBefore = 4,
}
export function getNodeTypeNameSpace(nodetype: NodeType) {
  if (nodetype === NodeType.Children)
    return 'children'

  else if (nodetype === NodeType.SiblingAfter)
    return 'after'

  else if (nodetype === NodeType.SiblingBefore)
    return 'before'

  else
    return 'sibling'
}

export interface INodeNew {
  treeId: number
  selectedId: number
  type: number
  title: string
}
export class NodeNewModel implements INodeNew {
  treeId: number = 0
  selectedId: number = 0
  type: NodeType = NodeType.Sibling
  title: string = ''
  constructor(treeid: number, selectedid: number, type: NodeType, title: string) {
    this.title = title
    this.treeId = treeid
    this.selectedId = selectedid
    this.type = type
  }
}
export interface INodeView {
  id: number
  isDeleted: boolean
  isActive: boolean
  creationTime: string
  creatorId: string
  creatorFullName: string
  lastModificationTime: string
  lastModifierId: string
  lastModifierFullName: string
  title: string
  treeId: number
  description: string
  priority: number
  pathOrder: string
  parentId: number
}
export interface ITreeTitle extends Record<string, any>, baseItemState {
  id: number
  title: string

  //   book: ISimpleDTO[]
  createDate: string
  isActive: boolean
  projectsCount: number
  description: string
}

export class TreeTitleModel implements ITreeTitle {
  projectsCount: number = 0
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  tempData: any
  [x: string]: any;
  id: number = 0
  title: string = ''

  //   book: ISimpleDTO[] = []
  createDate: string = ''
  isActive: boolean = false
  description: string = ''
}
