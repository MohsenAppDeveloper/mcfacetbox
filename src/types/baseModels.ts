export class GridResult<T> {
  page = 0
  totalCount = 0
  items: T[] = []
}

export interface ISelectable {
  selectable?: boolean
  selected?: boolean
}

export interface ISimpleDTO {
  id: number
  title: string
  isEditing?: boolean
}

export interface ISimpleSelectableDTO extends ISimpleDTO, baseItemState, baseItemAction {
  id: number
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
  children?: ISimpleTree[]
}

export interface ISimpleTreeActionable extends ISimpleTree, baseItemAction {
  parentId: number
}

export class SimpleTreeAcionableModel implements ISimpleTreeActionable {
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

export class SimpleSelectableDTOModel implements ISimpleSelectableDTO {
  id: number = 0
  title: string = ''
  selectable?: boolean | undefined = false
  selected?: boolean | undefined = false
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
