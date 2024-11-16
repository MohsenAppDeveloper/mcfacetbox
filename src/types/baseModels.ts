export interface ISimpleDTO {
    id: number;
    title: string
}

export interface ISimpleTree extends Record<string, any> {
    id: number;
    title: string;
    children: ISimpleTree[]
}


export interface baseDataTableModel extends Record<string, any> {
    id: number,
    isSelected: boolean,
    isLoading: boolean,
    selectable: boolean,
    disabled: boolean
}
