import { ActionDates } from './baseModels'
import type { ISimpleDTO, ISimpleTree, baseItemAction, baseItemState, stringnumber } from './baseModels'
import type { IDataShelfBoxView, IExerptSupervisionStat } from './dataShelf'

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

/**
 * اینترفیس برای ایجاد یک نو
 */
export interface ISingleNodeNew {
  treeId: number
  selectedId: number
  title: string
}

/**
 * مدل برای ایجاد یک نود
 */
export class SingleNodeNewModel implements ISingleNodeNew {
  treeId: number = 0
  selectedId: number = 0
  title: string = ''
  constructor(treeid: number, selectedid: number, title: string) {
    this.title = title
    this.treeId = treeid
    this.selectedId = selectedid
  }
}

/**
 * اینترفیس برای دریافت جزییات یک نود
 */
export interface ISingleNodeView {
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

/**
 * اینترفیس برای تعریف یک عنوان درخت و ویژگیهای آن
 */
export interface ITreeTitle extends Record<string, any>, baseItemState {
  id: number
  title: string

  //   book: ISimpleDTO[]
  isActive: boolean
  projectsCount: number
  description: string
}

/**
 * مدل برای تعریف یک عنوان درخت و ویژگیهای آن
 */
export class TreeTitleModel implements ITreeTitle {
  projectsCount: number = 0
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  creationTime: string = ''
  wordCreationTime: string = ''
  tempData: any
  [x: string]: any;
  id: number = 0
  title: string = ''
  isActive: boolean = false
  description: string = ''
}

/**
 *  اینترفیس ساختار تو در تو یک نود در حالت ساده با پشتیبانی از فیلد های وضعیت و اکشن
 */
export interface ISimpleNestedNodeActionable extends baseItemAction, baseItemState {
  id: number
  title: string
  children?: ISimpleNestedNodeActionable[] | null
  parentId: number
  priority: number
  hasDescription?: boolean
  relationCount?: number
  referenceCount?: number
}

/**
 * اینترفیس ساختار تو در تو یک نود به همراه فیش های آن در حالت ساده با پشتیبانی از فیلد های وضعیت و اکشن
 */
export interface ISimpleNestedNodeExcerptActionable extends baseItemAction, baseItemState {
  id: number
  title: string
  children?: ISimpleNestedNodeExcerptActionable[] | null
  parentId: number
  priority: number
  excerptCount: IExerptSupervisionStat | null
  excerpts: IDataShelfBoxView[] | null
  hasDescription?: boolean
}
export interface INodeRelation<T extends stringnumber> extends ISimpleDTO<T>, baseItemState {

  parentId: number
  parentTitle: string
  nodeId: number
}

/**
 * مدل ساختار تو در تو یک نود در حالت ساده با پشتیبانی از فیلد های وضعیت و اکشن
 */
export class SimpleNestedNodeAcionableModel implements ISimpleNestedNodeActionable {
  priority: number = 0
  parentId: number = -1
  id: number = -1
  title: string = ''
  children?: ISimpleNestedNodeActionable[] | undefined
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  tempData: any = null
  selectable?: boolean | undefined = false
  disabled?: boolean | undefined = false
  constructor(id: number = 0, title: string = '', parentid: number = 0) {
    this.id = id
    this.title = title
    this.parentId = parentid
  }
}

export class SimpleNestedNodeExcerptAcionableModel implements ISimpleNestedNodeExcerptActionable {
  priority: number = 0
  parentId: number = -1
  id: number = -1
  title: string = ''
  children?: ISimpleNestedNodeExcerptActionable[] | undefined
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  tempData: any = null
  selectable?: boolean | undefined = false
  disabled?: boolean | undefined = false
  excerptCount: IExerptSupervisionStat | null = null
  excerpts: IDataShelfBoxView[] | null = []
  hasDescription?: boolean | undefined
  failed?: boolean | null | undefined

  constructor(id: number = 0, title: string = '', parentid: number = 0) {
    this.id = id
    this.title = title
    this.parentId = parentid
  }
}

/**
 * نقش کاربر در یک درخت
 */
export class TreeUserRoleModel extends ActionDates {
  id: number | string = 0
  fullName: string = ''
  avatarUrl: string = ''
  lastLoginDate: string = ''
  userId: string = ''
  bookCount: number = 0
  roles: ISimpleDTO<string>[] = []
}

/**
 * اینترفیس یک درخت به همراه نودها
 */
export interface ITree {
  id: number
  title: string
  nodes: ISimpleNestedNodeActionable[]
}

/**
 * اینترفیس یک درخت به همراه نودها و فیش های نود
 */
export interface ITreeExcerpt extends ITree {
  id: number
  title: string
  excerptCount: IExerptSupervisionStat | null
  nodes: ISimpleNestedNodeExcerptActionable[]
}

export enum NodeRelationType {
  relation = 1,
  reference = 2,
}
