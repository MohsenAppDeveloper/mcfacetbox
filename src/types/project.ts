import { Replace } from 'type-fest'
import type { baseItemState } from './baseModels'

export interface IProject extends baseItemState, Record<string, any> {
  id: number
  title: string
  trees: number[]
  createDate: string
  isActive: boolean
  description: string
}

export class ProjectModel implements IProject {
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  tempData: any
  [x: string]: any;
  id: number = 0
  title: string = ''
  trees: number[] = []
  createDate: string = ''
  isActive: boolean = false
  description: string = ''
}
