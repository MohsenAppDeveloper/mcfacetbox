import type { ISimpleDTO, baseItemState } from './baseModels'
import { DataBoxType, SupervisionStatus } from './baseModels'

// NOTE - بازای هر تغییری در محتوای جعبه داده باید یک نسخه ثبت گردد و قابلیت آندو داشته باشد
export interface IDataShelfBoxView {
  id: number
  content: string

  // NOTE - فقط یک نود متصل رو اینجا ذخیره می کنیم که چسنچو راحت تر باشه، بعد میشه از طریق شناسه، اتصالات یک جعبه داده به چند نود را استخراج کرد
  node?: ISimpleDTO<number>
  treeId: number

  // NOTE - مشخص کننده، حدیث، متن، آیه و یا لغت
  excerptType: ISimpleDTO<DataBoxType>
  state: ISimpleDTO<SupervisionStatus>
  order: number
  priority: number

  // NOTE - برای پاورقی یک تگ اچ تی ام ال با شناسه پاورقی در محتوای جعبه داده درج میشود و باید بررسی گردد که اگر در ویرایش کاربر این تگ حذف شد در پاورقی هم حذف شود
  footNotes: IFootNote[]
  description?: string

  // NOTE - شناسه جعبه داده ای که به این جعبه داده وصل شده و باید با آن حرکت کند
  linkId?: number
  hasLink: boolean
  creationTime?: string
  creatorId?: string
  creatorFullName?: string
  lastModifierFullName?: string
  lastModificationTime?: string
  selected?: boolean
  labels: ISimpleDTO<number>[]

  //   tags?: ISimpleDTO<number>[]
  labelCount: number

  //   comment?: string
  hasDescription: boolean

  // NOTE - شناسه سایتی که محتوا از آن دریافت شده مثلا شناسه حدیث، آیه یا لغت
  sourceId: string
}

export interface IOrderChangedResponse {
  id: number
  priority: number
}
export interface IDataShelfBoxNew {
  id: number
  treeId: number
  nodeId: number
  content: string
  description: string
  footNotes: IFootNote[]
  labels: number[]
  sourceId: string
}

export class DataShelfBoxModelNew implements IDataShelfBoxNew {
  id: number = 0
  treeId: number = 0
  nodeId: number = 0
  content: string = ''
  description: string = ''
  footNotes: IFootNote[] = []
  labels: number[] = []
  sourceId: string = ''
  constructor(id: number, treeId: number, nodeId: number, content: string, description: string = '', footNotes: IFootNote[] = [], labels: number[] = [], sourceId: string = '') {
    this.id = id
    this.treeId = treeId
    this.nodeId = nodeId
    this.content = content
    this.description = description
    this.footNotes = footNotes
    this.labels = labels
    this.sourceId = sourceId
  }
}

/**
 * این شیء برای ایجاد مقادیر صفحه بندی و فست قفسه داده در url اصلی برنامه میباشد
 * نام ها کدگذاری شده برای مشخص نبود
 */
export class DataShelfRouteQueryParams {
  /** اندازه صفحه */
  pageSize: number

  /** شماره صفحه */
  pageNumber: number

  selectedFacetItems: Record<string, string[]>

  /** فست ها به شکل یک عبارت رشته ای تک خطی */
  get rawFacets(): string {
    return Object.keys(this.selectedFacetItems)
      .filter(key => this.selectedFacetItems[key].length > 0)
      .map(key => `#${key}=${this.selectedFacetItems[key].join(',')}`)
      .join('')
  }

  constructor(
    pageSize: number = 10,
    pageNumber: number = 1,
    selectedFacetItems: Record<string, string[]> = {},
  ) {
    this.pageSize = pageSize
    this.pageNumber = pageNumber
    this.selectedFacetItems = selectedFacetItems
  }
}
export class DataShelfBoxModelView implements IDataShelfBoxView {
  state: ISimpleDTO<SupervisionStatus> = { id: SupervisionStatus.primary, title: '' }
  supervisionState: ISimpleDTO<SupervisionStatus> = { id: SupervisionStatus.primary, title: '' }
  linkId?: number | undefined = 0
  hasLink: boolean = false
  priority: number = 0
  private _creationTime?: string
  private _lastModificationTime?: string
  private creationTimePersianCache?: string
  private modificationTimePersianCache?: string

  id: number = 0
  content: string = ''
  node?: ISimpleDTO<number> | undefined = { id: 0, title: '' }
  treeId: number = 0
  excerptType: ISimpleDTO<DataBoxType> = { id: DataBoxType.text, title: '' }
  order: number = 0
  footNotes: IFootNote[] = []
  creatorId?: string | undefined = ''
  creatorFullName?: string | undefined = ''
  selected?: boolean | undefined = false
  labelCount: number = 0
  hasDescription: boolean = false
  sourceId: string = ''
  description?: string | undefined
  lastModifierFullName?: string | undefined
  get creationTime(): string | undefined {
    if (!this._creationTime)
      return undefined

    if (!this.creationTimePersianCache)
      this.creationTimePersianCache = usePersianDate(this._creationTime)

    return this.creationTimePersianCache
  }

  set creationTime(value: string | undefined) {
    this._creationTime = value
    this.creationTimePersianCache = undefined
  }

  get lastModificationTime(): string | undefined {
    if (!this._lastModificationTime)
      return undefined

    if (!this.modificationTimePersianCache)
      this.modificationTimePersianCache = usePersianDate(this._lastModificationTime)

    return this.modificationTimePersianCache
  }

  set lastModificationTime(value: string | undefined) {
    this._lastModificationTime = value
    this.modificationTimePersianCache = undefined
  }

  labels: ISimpleDTO<number>[] = []
}

export interface IFootNote extends ISimpleDTO<string>, baseItemState {
  index?: number
  order: number
  isReference: boolean
}

export class LinkDetailModel {
  linkId?: number = 0
  priority: number = 0
  id: number = 0
}

export class UnlinkDataModel {
  split1: LinkDetailModel[] = []
  split2: LinkDetailModel[] = []
}
