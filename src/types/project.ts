import type { ISimpleDTO, baseItemState } from './baseModels'

export interface IProjectBase {
  id: number
  title: string
  isActive: boolean
  description: string
}

export interface IProjectEdit extends IProjectBase {
  gateId: number
  trees: number[]
}
export interface IProjectView extends baseItemState, IProjectBase {
  trees: ISimpleDTO<number>[]
  createDate: string
}
export class ProjectEditModel implements IProjectEdit {
  gateId: number = 0
  trees: number[] = []
  id: number = 0
  title: string = ''
  isActive: boolean = false
  description: string = ''
}
export class ProjectViewModel implements IProjectView {
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  tempData: any

  //   [x: string]: any;
  id: number = 0
  title: string = ''
  trees: ISimpleDTO<number>[] = []
  createDate: string = ''
  isActive: boolean = false
  description: string = ''
}
