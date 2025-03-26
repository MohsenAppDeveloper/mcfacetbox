import type { ISimpleDTO, baseDataTableModel, baseItemAction, baseItemState } from './baseModels'
import { type IUserBase, UserBaseModel, UserModel } from './users'

// export interface GateProperties extends Record<string, any>, baseDataTableModel {
//   id: number
//   gateTitle: string
//   contact: string
//   nameFamily: string
//   createDate: string
//   expireDate: string
//   active: boolean
//   email: string
//   userType: string
//   usersavatar: string
//   description: string
// }

export const GatePropMappedToNewItem = (gateProp: GateProperties): IGateNewItem => {
  return {
    description: gateProp.description,
    email: gateProp.manager.email,
    gateTypeId: gateProp.gateType.id,
    id: gateProp.id,
    isActive: gateProp.isActive,
    phoneNumber: gateProp.manager.phoneNumber,
    title: gateProp.title,
    fullName: gateProp.manager.fullName,
  }
}

// NOTE - این مدل برای درج یا ویرایش یک درگاه استفاده میشود
export interface IGateNewItem {
  id: number
  title: string
  phoneNumber: string
  email: string
  isActive: boolean
  gateTypeId: number
  description: string
  fullName: string
}
export class GateNewItemModel implements IGateNewItem {
  id: number = 0
  title: string = ''
  phoneNumber: string = ''
  email: string = ''
  isActive: boolean = false
  gateTypeId: number = 0
  description: string = ''
  fullName: string = ''
}

// NOTE - این مدل برای گرفتن اطلاعات درگاه استفاده میشود
export interface GateProperties {
  id: number
  title: string
  manager: IUserBase
  createDate: string
  expireDate: string
  isActive: boolean
  gateType: ISimpleDTO<number>
  description: string
}

export class GateModel implements GateProperties, baseItemState {
  editing?: boolean | undefined = false
  loading?: boolean | undefined = false
  selected?: boolean | undefined = false
  tempData: any
  id: number = 0
  title: string = ''
  manager: IUserBase = new UserBaseModel()
  createDate: string = ''
  expireDate: string = ''
  isActive: boolean = false
  gateType: ISimpleDTO<number> = { id: 0, title: '' }
  description: string = ''
}
