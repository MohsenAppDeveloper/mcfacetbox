import { ISelectable } from "./baseModels";
import { IFacetBox } from "./SearchResult";

export interface IBookCreator {
    id: number,
    isMain: boolean,
    name: string,
    role: string
}
export interface IBookLanguage {
    id: number,
    name: string,
    isoCode: string
}
export interface IBookPublishYear {
    calendarTitle: string,
    calendarType: string,
    year: string
}
export interface IBookPublisher {
    id: number,
    place: string,
    isoCode: string
}
export interface IBookInfo extends IBook {
    creatorList: IBookCreator[],
    publisherList: IBookPublisher[],
    languageList: IBookLanguage[],
    publishYearList: IBookPublishYear[],
    thumbnailUrl: string,
    link: string,
}

export interface IBook {
    id: number;
    title: string;
}
export interface IBookSearchResult {
    facetList: IFacetBox[],
    resultList: ISelectableBookInfo[],
    resultListTotalCount: number,
    pageNumber: number,
    pageSize: number,
}

export interface ISelectableBookInfo extends ISelectable, IBookInfo {

}
export class selectableBookInfo implements ISelectable, IBookInfo {
    creatorList: IBookCreator[] = [];
    publisherList: IBookPublisher[] = [];
    languageList: IBookLanguage[] = [];
    publishYearList: IBookPublishYear[] = [];
    thumbnailUrl: string = '';
    link: string = '';
    id: number = 0;
    title: string = '';
    selectable?: boolean | undefined = true;
    selected?: boolean | undefined = false;
}

export class BookSearchRequestModel {
    language: string = 'fa';
    page_size: number = 20;
    page_number: number = 1;
    sort: string = 'title-asc';
    origin: string = 'noorlib.web.app';
    query: string = '';
}
