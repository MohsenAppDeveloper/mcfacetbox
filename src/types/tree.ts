import { ActionDates } from './baseModels'
import type { ISimpleDTO, ISimpleTree, baseItemAction, baseItemState, stringnumber } from './baseModels'
import type { IDataShelfBoxView, IExerptSupervisionStat } from './dataShelf'
import { ExcerptSupervisionStat } from './dataShelf'

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
export interface INodeChangePriority {
  id: number
  priority: number
}
export enum NodeLocationType {
  Sibling = 2,
  Children = 1,
  SiblingAfter = 3,
  SiblingBefore = 4,
}
export function getNodeTypeNameSpace(nodetype: NodeLocationType) {
  if (nodetype === NodeLocationType.Children)
    return 'children'

  else if (nodetype === NodeLocationType.SiblingAfter)
    return 'after'

  else if (nodetype === NodeLocationType.SiblingBefore)
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
  parentId: number | null
  priority: number
  excerptCount: ExcerptSupervisionStat | null
  hasDescription?: boolean
  relationCount?: number
  referenceCount?: number
}

export interface ISimpleFlatNodeActionable extends baseItemAction, baseItemState {
  id: number
  title: string
  parentId: number | null
  priority: number
  hasDescription?: boolean
  relationCount?: number
  referenceCount?: number
  hasChildren: boolean
  excerptCount: ExcerptSupervisionStat | null
  depth: number
  isExpanded: boolean
  isLoaded: boolean
  highlighted?: boolean
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
  excerptCount: ExcerptSupervisionStat | null
  excerpts: IDataShelfBoxView[] | null
  hasDescription?: boolean
}
export interface INodeRelation<T extends stringnumber> extends ISimpleDTO<T>, baseItemState {

  parentId: number
  parentTitle: string
  nodeId: number
}

/**
 * مدل ساختار تک سطحی درخت با پشتیبانی از فیلدهای مورد نیاز
 */
export class SimpleFlatNodeActionable implements ISimpleFlatNodeActionable {
  priority: number = 0
  parentId: number | null
  id: number = -1
  title: string = ''
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  tempData: any = null
  selectable?: boolean | undefined = false
  disabled?: boolean | undefined = false
  constructor(id: number = 0, title: string = '', parentid: number | null) {
    this.id = id
    this.title = title
    this.parentId = parentid
  }

  excerptCount: ExcerptSupervisionStat | null = new ExcerptSupervisionStat(0)

  hasDescription?: boolean | undefined
  relationCount?: number | undefined
  referenceCount?: number | undefined
  hasChildren: boolean = false
  depth: number = 0
  isExpanded: boolean = false
  isLoaded: boolean = false
  highlighted?: boolean | undefined
  failed?: boolean | null | undefined
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

  excerptCount: ExcerptSupervisionStat | null = new ExcerptSupervisionStat(0)

  hasDescription?: boolean | undefined
  relationCount?: number | undefined
  referenceCount?: number | undefined
  failed?: boolean | null | undefined
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
  excerptCount: ExcerptSupervisionStat | null = new ExcerptSupervisionStat(0)
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

export interface ITreeFlat {
  id: number
  title: string
  nodes: ISimpleFlatNodeActionable[]
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

/**
 * ساختار گزارش عملکرد کاربر در درخت
 */
export interface TreeWorkReport {
  fullName: string
  userId: string
  domain: string
  createdCount: number
  updatedCount: number
  deletedCount: number
}
export enum NodeRelationType {
  relation = 1,
  reference = 2,
}

export enum NodeSelectionType {
  highlighted = 1,
  selected = 2,
}
