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
export interface IProfile {
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
  profile: IProfile
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
