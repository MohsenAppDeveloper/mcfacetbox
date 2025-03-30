export class GridResult<T> implements Record<string, any> {
  [x: string]: any;
  page = 0
  totalCount = 0
  items: T[] = []
}

export interface ISelectable {
  selectable?: boolean
  selected?: boolean
}

export interface IServiceValidationDetails {
  message: string
  members: string[]
}
export interface IRootServiceError {
  error: IServiceError
}
export interface IServiceError {
  code: string
  details: string
  message: string
  validationErrors: IServiceValidationDetails[]
}

type stringNumber = number | string

export interface ISimpleDTO<T extends stringNumber> {
  id: T
  title: string
}

export interface ISimpleSelectableDTO<T extends stringNumber> extends ISimpleDTO<T>, baseItemState, baseItemAction {
  title: string
  editing?: boolean
  loading?: boolean
  selected?: boolean
  tempData?: any
  selectable?: boolean
  disabled?: boolean

}

export interface ISimpleTree extends baseItemState {
  id: number
  title: string
  children?: ISimpleTree[] | null
}

export interface ISimpleTreeActionable extends ISimpleTree, baseItemAction {
  parentId: number
  priority: number
}

export class SimpleDTOModel<T extends stringNumber> implements ISimpleDTO<T> {
  id: T
  title: string = ''
  constructor(id: T, title: string) {
    this.id = id
    this.title = title
  }
}
export class SimpleTreeAcionableModel implements ISimpleTreeActionable {
  priority: number = 0
  parentId: number = -1
  id: number = -1
  title: string = ''
  children?: ISimpleTree[] | undefined
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
export interface baseItemState {
  editing?: boolean
  loading?: boolean
  selected?: boolean
  tempData?: any
}
export interface baseItemAction {
  selectable?: boolean
  disabled?: boolean
}
export interface baseDataTableModel extends Record<string, any> {
  id: number
  isSelected: boolean
  isLoading: boolean
  selectable: boolean
  disabled: boolean
}

export class SimpleSelectableDTOModel<T extends stringNumber> implements ISimpleSelectableDTO<T> {
  id: T
  title: string = ''
  selectable?: boolean | undefined = false
  selected?: boolean | undefined = false
  constructor(id: T, title: string) {
    this.id = id
    this.title = title
  }
}

export class SimpleTreeModel implements ISimpleTree {
  [x: string]: any;
  title: string = ''
  children?: ISimpleTree[] | undefined
  id: number = 0
  selected?: boolean | undefined = false
}

export enum SelectAllState {
  Select = 0,
  Deselect = 1,
  Combine = 2,
}

export enum SelectionType {
  Single = 0,
  Multiple = 1,
}

export enum LoginState {
  Login = 0,
  Logout = 1,
  MustLogout = 2,
  MustLogin = 3,

}
