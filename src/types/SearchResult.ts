import { isNull, isUndefined } from "@sindresorhus/is";
import { ISimpleSelectableDTO } from "./baseModels";

export function convertFacetItemToFacetTree(items: IFacetItem[]): IFacetTreeItem[] {

    console.log('befortree', items);
    const map = new Map<string, IFacetTreeItem>();
    items.forEach(item => {
        const treeItem: IFacetTreeItem = {
            orderIndex: item.orderIndex,
            facetCount: item.facetCount,
            isSelected: item.isSelected,
            facetKey: item.facetKey,
            title: item.title,
        };
        map.set(item.facetKey, treeItem);
    });

    const result: IFacetTreeItem[] = [];

    items.forEach(item => {
        console.log('parenttrack', item);

        if (item.parent) {
            const parentTreeItem = map.get(item.parent.toString());
            console.log('parent', parentTreeItem, item.parent.toString());
            if (parentTreeItem) {
                if (isUndefined(parentTreeItem.children) || isNull(parentTreeItem.children)) {
                    parentTreeItem.children = []
                }
                parentTreeItem.children.push(map.get(item.facetKey)!);

            }
        } else {
            result.push(map.get(item.facetKey)!);
        }
    });
    console.log('tree', result);

    return result;
}

export interface IFacetItem {
    orderIndex?: string,
    facetCount: number,
    isSelected?: boolean,
    facetKey: string,
    parent?: string,
    title: string,
}
export interface IFacetTreeItem {
    orderIndex?: string,
    facetCount: number,
    isSelected?: boolean,
    facetKey: string,
    children?: IFacetTreeItem[],
    title: string,
}
export interface IFacetBox {
    hasSearchBox: boolean,
    facetboxKey: string,
    scrollSize: number,
    title: string,
    facetBoxType?: string,
    itemList: IFacetItem[],
    isTree?: boolean
}

// export interface IFacetResult {
//     key: string,
//     facetGroups: ISimpleSelectableDTO[]
// }
export interface ISearchResultTabBoxItem {
    id: number;
    title: string;
    content: ISimpleSelectableDTO[];

}
export interface ISearchResultTabBox extends Record<string, any> {
    id: number;
    content: ISearchResultTabBoxItem[]
}

export class SearchResultTabBoxModel implements ISearchResultTabBox {
    id: number = 0;
    content: SearchResultTabBoxItemModel[] = [];
}
export class SearchResultTabBoxItemModel implements ISearchResultTabBoxItem {
    id: number = 0;
    title: string = '';
    content: ISimpleSelectableDTO[] = [];

}
