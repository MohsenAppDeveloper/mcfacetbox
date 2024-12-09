export class GridResult<T> {
    page = 0
    totalPages = 0
    totalItems = 0
    items: T[] = []
}

export interface ISimpleDTO {
    id: number;
    title: string
}

export interface ISimpleSelectableDTO {
    id: number;
    text: string,
    selectable?: boolean,
    selected?: boolean

}

export interface ISimpleTree extends Record<string, any> {
    id: number;
    title: string;
    children?: ISimpleTree[]
}


export interface baseDataTableModel extends Record<string, any> {
    id: number,
    isSelected: boolean,
    isLoading: boolean,
    selectable: boolean,
    disabled: boolean
}
