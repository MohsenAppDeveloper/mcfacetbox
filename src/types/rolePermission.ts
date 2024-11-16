import { baseDataTableModel, ISimpleTree } from "./baseModels";



export interface IRole extends baseDataTableModel {
    id: number;
    title: string;
    permissions: ISimpleTree[];
    projects: ISimpleTree[];
    createDate: string;
    isActive: boolean;
    description: string;
}

export class RoleModel implements IRole {
    [x: string]: any;
    id: number = 0;
    title: string = "";
    permissions: ISimpleTree[] = [];
    projects: ISimpleTree[] = [];
    createDate: string = "";
    isActive: boolean = false;
    description: string = "";
    isSelected: boolean = false;
    isLoading: boolean = false;
    selectable: boolean = false;
    disabled: boolean = false;



} 
