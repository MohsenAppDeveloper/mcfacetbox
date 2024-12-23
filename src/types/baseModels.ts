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
    selected?: boolean
    children?: ISimpleTree[]
}


export interface baseDataTableModel extends Record<string, any> {
    id: number,
    isSelected: boolean,
    isLoading: boolean,
    selectable: boolean,
    disabled: boolean
}

export class SimpleSelectableDTOModel implements ISimpleSelectableDTO {
    id: number = 0;
    text: string = '';
    selectable?: boolean | undefined = false;
    selected?: boolean | undefined = false;
}

export class SimpleTreeModel implements ISimpleTree {
    [x: string]: any;
    title: string = '';
    children?: ISimpleTree[] | undefined;
    id: number = 0;
    selected?: boolean | undefined = false;
}
