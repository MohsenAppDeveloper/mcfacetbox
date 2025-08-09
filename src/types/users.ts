import type { ISimpleDTO, baseDataTableModel } from './baseModels'

export const clearUserCookies = () => {
  useCookie('userData').value = null
  useCookie('accessToken').value = null
  useCookie('userAbilityRules').value = null

  // Reset ability to initial ability
//   ability.update([])
}

export interface IUserEdit extends IUserBase {
  roles: string[]
  isActive: boolean
}
export interface IUser extends baseDataTableModel {
  role: ISimpleDTO<string>[]
  createDate: string
  isActive: boolean
  expireDate: string
}
export interface IUserBase {
  id: number | string
  fullName: string
  phoneNumber: string
  email: string
  description: string
  avatarUrl: string
}
export class UserEditModel implements IUserEdit {
  roles: string[] = []
  id: number | string = 0
  fullName: string = ''
  phoneNumber: string = ''
  email: string = ''
  description: string = ''
  isActive: boolean = false
  avatarUrl: string = ''
}
export class UserBaseModel implements IUserBase {
  id: number | string = 0
  fullName: string = ''
  phoneNumber: string = ''
  email: string = ''
  description: string = ''
  avatarUrl: string = ''
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
  gates: ISimpleDTO<number>[]
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
  role: ISimpleDTO<string>[] = []
  contact: string = ''
  email: string = ''
  createDate: string = ''
  isActive: boolean = false
  avatar: string = ''
  expireDate: string = ''
  description: string = ''
}
