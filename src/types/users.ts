import type { ISimpleDTO, baseDataTableModel } from './baseModels'

export interface IUser extends baseDataTableModel {
  id: number
  fullName: string
  role: ISimpleDTO[]
  contact: string
  email: string
  createDate: string
  isActive: boolean
  avatar: string
  expireDate: string
  description: string
}
export interface IUserBase {
  id: string
  fullName: string
  phoneNumber: string
  email: string
}
export class UserBaseModel implements IUserBase {
  id: string = ''
  fullName: string = ''
  phoneNumber: string = ''
  email: string = ''
}
export interface IProfile extends IUserBase {
  userName: string
  email: string
  name: string
  surName: string
  fullName: string
  phoneNumber: string
  phoneNumberVerified: boolean
  avatarUrl: string
}

export interface IToken {
  token: string
  refreshToken: string
  expireDate: number
}

export interface ITokenProfile extends IToken {
  profile: IProfile | null
  gates: ISimpleDTO[]
  permissions: string[]
}

export class UserModel implements IUser {
  [x: string]: any;
  isSelected = false
  isLoading: boolean = false
  selectable: boolean = false
  disabled: boolean = false
  id: number = 0
  fullName: string = ''
  role: ISimpleDTO[] = []
  contact: string = ''
  email: string = ''
  createDate: string = ''
  isActive: boolean = false
  avatar: string = ''
  expireDate: string = ''
  description: string = ''
}
