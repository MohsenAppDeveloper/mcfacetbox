import { baseDataTableModel, ISimpleDTO, ISimpleTree } from "./baseModels";


export function createTreeIndex(tree: ISimpleTree[]): Record<number, ISimpleTree> {
    const index: Record<number, ISimpleTree> = {};

    function populateIndex(nodes: ISimpleTree[]) {
        for (const node of nodes) {
            index[node.id] = node;  // ذخیره نود با id
            if (node.children) {
                populateIndex(node.children);  // جستجوی در فرزندان
            }
        }
    }

    populateIndex(tree);
    return index;
}

export interface ITreeTitle extends baseDataTableModel {
    id: number;
    title: string;
    book: ISimpleDTO[];
    createDate: string;
    isActive: boolean;
    description: string;
}

export class TreeTitleModel implements ITreeTitle {
    [x: string]: any;
    id: number = 0;
    title: string = "";
    book: ISimpleDTO[] = [];
    createDate: string = "";
    isActive: boolean = false;
    description: string = "";
    isSelected: boolean = false;
    isLoading: boolean = false;
    selectable: boolean = false;
    disabled: boolean = false;

}
