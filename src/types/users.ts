import { baseDataTableModel } from "./baseDataTable";

export interface IUser extends baseDataTableModel {
    id: number;
    fullName: string;
    role: Array<number>;
    contact: string;
    email: string;
    createDate: string;
    isActive: boolean;
    avatar: string;
    expireDate: string;
    description: string;
}

export class UserModel implements IUser {
    [x: string]: any;
    isSelected = false;
    isLoading: boolean = false;
    selectable: boolean = false;
    disabled: boolean = false;
    id: number = 0;
    fullName: string = '';
    role: Array<number> = [];
    contact: string = '';
    email: string = '';
    createDate: string = '';
    isActive: boolean = false;
    avatar: string = '';
    expireDate: string = '';
    description: string = '';

} 
