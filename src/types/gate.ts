import { baseDataTableModel } from "./baseDataTable"

export interface GateProperties extends Record<string, any>, baseDataTableModel {
    id: number
    gateTitle: string
    contact: string
    nameFamily: string
    createDate: string
    expireDate: string
    active: boolean
    email: string
    userType: string
    usersavatar: string
    description: string
}

export class GateModel implements GateProperties {
    [x: string]: any
    id: number = 0
    gateTitle: string = ''
    contact: string = ''
    nameFamily: string = ''
    createDate: string = ''
    expireDate: string = ''
    active: boolean = false
    email: string = ''
    userType: string = ''
    usersavatar: string = ''
    description: string = ''
    isSelected: boolean = false
    isLoading: boolean = false
    selectable: boolean = false
    disabled: boolean = false

}
