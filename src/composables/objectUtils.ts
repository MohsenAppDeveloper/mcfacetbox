import { ISimpleDTO, ISimpleTree } from "@/types/baseModels";
import { isNull, isUndefined } from "@sindresorhus/is";
import { UseClonedReturn } from "@vueuse/core";

//👉 - مقادیر اعضاء یک شیء را به شیء دیگری شامل همان اعضاء انتقال میدهد
//NOTE - پارامتر دوم نوع مقدار بازگشت از تابع useclones میبشاد
//NOTE - در کتابخانه useapi
export const objectMap = (newObject: Record<string, any>, oldObject: UseClonedReturn<Record<string, any>>) => {
    for (const key in oldObject.cloned.value) {
        if (oldObject.cloned.value.hasOwnProperty(key) && newObject.hasOwnProperty(key)) {
            newObject[key] = oldObject.cloned.value[key]
        }
    }
}
//👉 - Convert Array of SimplTree To Array of Simple Dto for Search
export function convertSimpleTreeToSimpleDtoArray(tree: ISimpleTree[]): ISimpleDTO[] {
    return tree.flatMap(node => {
        const currentEntry = [{ id: node.id, title: node.title }];
        const childrenEntries = node.children ? convertTreeToArray(node.children) : [];
        return [...currentEntry, ...childrenEntries];
    });
}

//👉 -  تابع نرمالسازی متن
export function normalizeText(text: string): string {
    return text.toLowerCase().trim();
}

//👉 - جستجو در فیلد دلخواه متنی از یک شیء
export function searchItems<T>(items: T[], searchText: string, field: keyof T): T[] {
    if (isUndefined(searchText) || isNull(searchText))
        searchText = ""
    const normalizedSearchText = normalizeText(searchText);
    console.log('searchtext', normalizedSearchText, searchText);

    return items.filter(item =>
        normalizeText(item[field]?.toString() || '').includes(normalizedSearchText)
    );
}
