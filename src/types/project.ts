import { baseDataTableModel } from "./baseModels";



export interface IProject extends baseDataTableModel {
    id: number;
    title: string;
    createDate: string;
    isActive: boolean;
    description: string;
}

export class ProjectModel implements IProject {
    [x: string]: any;
    id: number = 0;
    title: string = "";
    createDate: string = "";
    isActive: boolean = false;
    description: string = "";
    isSelected: boolean = false;
    isLoading: boolean = false;
    selectable: boolean = false;
    disabled: boolean = false;



}
