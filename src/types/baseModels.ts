export class GridResult<T> {
  page = 0
  totalPages = 0
  totalItems = 0
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

export interface ISimpleSelectableDTO {
  id: number
  text: string
  selectable?: boolean
  selected?: boolean

}

export interface ISimpleTree extends Record<string, any> {
  id: number
  title: string
  selected?: boolean
  children?: ISimpleTree[]
}

export interface ISimpleTreeActionable extends baseItemAction, baseItemState {
  id: number
  title: string
  children?: ISimpleTreeActionable[]
}
export interface baseItemState {
  editing?: boolean
  loading?: boolean
  selected?: boolean
  tempData: any
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
  text: string = ''
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
