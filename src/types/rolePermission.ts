export interface IRoleBase {
  id: string
  name: string
  isActive: boolean
  description: string
}
export interface IRoleEdit extends IRoleBase {
  gateId: number
  permissions: string[]
}

export interface IRoleView extends IRoleBase {
  trees: IBasePermissionTree[]
  permissions: IBasePermissionTree[]

}

export class RoleViewModel implements IRoleView {
  trees: IBasePermissionTree[] = []
  permissions: IBasePermissionTree[] = []
  id: string = '0'
  name: string = ''
  isActive: boolean = false
  description: string = ''
}

// export interface IRole extends baseDataTableModel {
//   id: number
//   title: string
//   permissions: ISimpleDTO[]
//   projects: ISimpleDTO[]
//   createDate: string
//   isActive: boolean
//   description: string
// }

export interface IBasePermissionTree {

  //   id: number
  name: string
  title: string
  parentName: string
  children?: IBasePermissionTree[]
}

export class RoleEditModel implements IRoleEdit {
  gateId: number = 0
  permissions: string[] = []
  id: string = '0'
  name: string = ''
  isActive: boolean = false
  description: string = ''
}

// export class RoleModel implements IRole {
//   [x: string]: any;
//   id: number = 0
//   title: string = ''
//   permissions: ISimpleDTO[] = []
//   projects: ISimpleDTO[] = []
//   createDate: string = ''
//   isActive: boolean = false
//   description: string = ''
//   isSelected: boolean = false
//   isLoading: boolean = false
//   selectable: boolean = false
//   disabled: boolean = false
// }
