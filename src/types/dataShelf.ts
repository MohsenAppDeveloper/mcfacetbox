import type { ISimpleDTO, baseItemState } from './baseModels'

// NOTE - بازای هر تغییری در محتوای جعبه داده باید یک نسخه ثبت گردد و قابلیت آندو داشته باشد
export interface IDataShelfBox {
  id: number
  text: string

  // NOTE - فقط یک نود متصل رو اینجا ذخیره می کنیم که چسنچو راحت تر باشه، بعد میشه از طریق شناسه، اتصالات یک جعبه داده به چند نود را استخراج کرد
  connectedTreeNode?: ISimpleDTO<number>

  // NOTE - مشخص کننده، حدیث، متن، آیه و یا لغت
  contentType: number
  order: number

  // NOTE - برای پاورقی یک تگ اچ تی ام ال با شناسه پاورقی در محتوای جعبه داده درج میشود و باید بررسی گردد که اگر در ویرایش کاربر این تگ حذف شد در پاورقی هم حذف شود
  footnotes: IFootNote[]

  // NOTE - شناسه جعبه داده ای که به این جعبه داده وصل شده و باید با آن حرکت کند
  pinnedItem?: number
  createdDate: string
  creator?: ISimpleDTO<number>
  selected?: boolean
  tags?: ISimpleDTO<number>[]
  comment?: string

  // NOTE - شناسه سایتی که محتوا از آن دریافت شده مثلا شناسه حدیث، آیه یا لغت
  refrenceId: number
}

export class DataShelfBoxModel implements IDataShelfBox {
  id: number = 0
  text: string = ''
  connectedTreeNode?: ISimpleDTO<number> | undefined
  contentType: number = 0
  order: number = 0
  footnotes: IFootNote[] = []
  pinnedItem?: number | undefined
  createdDate: string = ''
  creator?: ISimpleDTO<number> | undefined
  tags?: ISimpleDTO<number>[] | undefined
  selected?: boolean = false
  comment?: string | undefined
  refrenceId: number = 0
}

export interface IFootNote extends ISimpleDTO<number>, baseItemState {
  index: number
}
