export interface baseDataTableModel extends Record<string, any> {
    id: number,
    isSelected: boolean,
    isLoading: boolean,
    selectable: boolean,
    disabled: boolean
}
