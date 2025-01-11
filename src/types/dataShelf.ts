import { ISimpleDTO } from "./baseModels";

//NOTE - بازای هر تغییری در محتوای جعبه داده باید یک نسخه ثبت گردد و قابلیت آندو داشته باشد
export interface IDataBoxItem {
    id: number,
    text: string,
    //NOTE - فقط یک نود متصل رو اینجا ذخیره می کنیم که چسنچو راحت تر باشه، بعد میشه از طریق شناسه، اتصالات یک جعبه داده به چند نود را استخراج کرد
    connectedTreeNode: ISimpleDTO,
    //NOTE - مشخص کننده، حدیث، متن، آیه و یا لغت
    contentType: number,
    order: number,
    //NOTE - برای پاورقی یک تگ اچ تی ام ال با شناسه پاورقی در محتوای جعبه داده درج میشود و باید بررسی گردد که اگر در ویرایش کاربر این تگ حذف شد در پاورقی هم حذف شود
    footnote: ISimpleDTO[],
    //NOTE - شناسه جعبه داده ای که به این جعبه داده وصل شده و باید با آن حرکت کند
    pinnedItem: number,
    createdDate: string
    creator: ISimpleDTO,
    tags: ISimpleDTO[],
    comment: string,
    //NOTE - شناسه سایتی که محتوا از آن دریافت شده مثلا شناسه حدیث، آیه یا لغت
    refrenceId: number
}


