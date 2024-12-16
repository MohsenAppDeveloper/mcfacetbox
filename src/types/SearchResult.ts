import { ISimpleDTO, ISimpleSelectableDTO } from "./baseModels";


export interface ISearchResult {
    id: number;
    title: string;
    trees: ISimpleDTO[];
    createDate: string;
    isActive: boolean;
    description: string;
}

export interface IFacetResult {
    key: string,
    facetGroups: ISimpleSelectableDTO[]
}
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
