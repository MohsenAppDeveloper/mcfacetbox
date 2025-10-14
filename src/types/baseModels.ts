import type { IFacetBox } from './SearchResult'
import { FirstPageDefaultNumber, PageDefaultSize } from '@/utils/constants'

export class GridResult<T> implements Record<string, any> {
  [x: string]: any;
  page = 0
  totalCount = 0
  items: T[] = []
}
export class GridResultFacet<T> implements Record<string, any> {
  [x: string]: any;
  page = 0
  totalCount = 0
  items: T[] = []
  facets: IFacetBox[] = []
  hasFilter: boolean = false
}
export interface ISelectable {
  selectable?: boolean
  selected?: boolean
}

export interface IServiceValidationDetails {
  message: string
  members: string[]
}
export interface IRootServiceError {
  error: IServiceError
}
export interface IServiceError {
  code: string
  details: string
  message: string
  validationErrors: IServiceValidationDetails[]
}
export class RootServiceErrorModel implements IRootServiceError {
  error: IServiceError = { code: '0', details: '', message: '', validationErrors: [] }
}
type stringNumber = number | string

export interface ISimpleDTO<T extends stringNumber> {
  id: T
  title: string
}

export interface ISimpleSelectableDTO<T extends stringNumber> extends ISimpleDTO<T>, baseItemState, baseItemAction {
  title: string
  parentTitle?: string
  editing?: boolean
  loading?: boolean
  selected?: boolean
  tempData?: any
  selectable?: boolean
  disabled?: boolean

}

export interface ISimpleTree extends baseItemState {
  id: number
  title: string
  children?: ISimpleTree[] | null
}

export class SimpleDTOModel<T extends stringNumber> implements ISimpleDTO<T> {
  id: T
  title: string = ''
  constructor(id: T, title: string) {
    this.id = id
    this.title = title
  }
}

export interface baseItemState {
  editing?: boolean
  loading?: boolean
  selected?: boolean
  failed?: boolean | null
  tempData?: any
}
export interface baseItemAction {
  selectable?: boolean
  disabled?: boolean
}
export interface baseDataTableModel extends Record<string, any> {
  id: number
  isSelected: boolean
  isLoading: boolean
  selectable: boolean
  disabled: boolean
  details: Record<string, any>[]
}
export class ActionDates {
  private _creationTime?: string
  private _lastModificationTime?: string
  private creationTimePersianCache?: string
  private modificationTimePersianCache?: string
  get creationTime(): string | undefined {
    if (!this._creationTime)
      return undefined

    if (!this.creationTimePersianCache)
      this.creationTimePersianCache = Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(this._creationTime))

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
      this.modificationTimePersianCache = Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(this._lastModificationTime))

    return this.modificationTimePersianCache
  }

  set lastModificationTime(value: string | undefined) {
    this._lastModificationTime = value
    this.modificationTimePersianCache = undefined
  }

  creatorFullName: string = ''
  lastModifierFullName: string = ''
}
export class SimpleSelectableDTOModel<T extends stringNumber> implements ISimpleSelectableDTO<T> {
  id: T
  title: string = ''
  selectable?: boolean | undefined = false
  selected?: boolean | undefined = false
  loading?: boolean | undefined = false
  constructor(id: T, title: string) {
    this.id = id
    this.title = title
  }
}

export class SimpleTreeModel implements ISimpleTree {
  [x: string]: any;
  title: string = ''
  children?: ISimpleTree[] | undefined
  id: number = 0
  selected?: boolean | undefined = false
}

/**
 * این تابع کلاس برای ارسال مثادیر فیلتر به api ارسال میشود
 * با توجه به اینکه معمولا لیست ها برای لود شدن به یکسری پارامتر ثابت نیاز دارند انها را در یک شیء نگهداری کردیم
 * مقادر داینامیک هم برای فست ها هستند
 */
export class QueryRequestModel implements Record<string, any> {
  [x: string]: any;
  PageSize: number = PageDefaultSize
  PageNumber: number = FirstPageDefaultNumber
  Sorting: string = ''
  Filter: string = ''
  TreeId: number = 0
  IsFullText: boolean = false
  SearchIn: number = 1
  SearchType: SearchConfig = SearchConfig.OneOrMore
  public resetAll() {
    this.resetDynamicFields()
    this.PageNumber = PageDefaultSize
    this.PageNumber = FirstPageDefaultNumber
    this.Sorting = ''
    this.Filter = ''
    this.TreeId = 0
    this.SearchType = SearchConfig.OneOrMore
  }

  private staticKeys = ['PageSize', 'PageNumber', 'Sorting', 'Filter', 'TreeId', 'SearchType', 'IsFullText', 'SearchIn', 'staticKeys']

  /** کلید های داینامیک شیء را حذف میکنیم تا شیء به حالت اولیه برگردد */
  resetDynamicFields() {
    // لیست کلیدهای اصلی (غیر داینامیک)
    // const staticKeys = ['PageSize', 'PageNumber', 'Sorting', 'Filter', 'TreeId', 'SearchType']

    // تمام کلیدهای شیء فعلی را بررسی می‌کنیم
    Object.keys(this).forEach(key => {
      // اگر کلید جزو کلیدهای اصلی نبود، آن را حذف می‌کنیم
      if (!this.staticKeys.includes(key))
        delete this[key]
    })
  }

  /** دریافت لیست کلیدهای داینامیک */
  getDynamicKeys(): string[] {
    return Object.keys(this).filter(key => !this.staticKeys.includes(key))
  }

  /** دریافت مقادیر داینامیک به صورت آبجکت */
  getDynamicProperties(): Record<string, any> {
    const dynamicProps: Record<string, any> = {}

    Object.keys(this).forEach(key => {
      if (!this.staticKeys.includes(key))
        dynamicProps[key] = this[key]
    })

    return dynamicProps
  }
}

export enum SelectAllState {
  Select = 0,
  Deselect = 1,
  Combine = 2,
}

export enum SelectionType {
  Single = 0,
  Multiple = 1,
}

export enum LoginState {
  Login = 0,
  Logout = 1,
  MustLogout = 2,
  MustLogin = 3,

}

export enum MessageType {
  warning = 0,
  error = 1,
  success = 2,
  info = 4,
}
export enum SizeType {
  XL = 'xl',
  LG = 'lg',
  MD = 'md',
  SM = 'sm',
  XS = 'xs',
}

export enum InfiniteScrollSide {
  start = 'start',
  end = 'end',
  both = 'both',
}

export enum InfiniteScrollStatus {
  error = 'error',
  loading = 'loading',
  empty = 'empty',
  ok = 'ok',
}
export enum DataBoxType {
  hadith = 1,
  quran = 2,
  vocabulary = 3,
  text = 4,
}

export enum FacetType {
  flat = 1,
  tree = 2,
  switch = 3,
}

export enum SupervisionStatus {
  primary = 1,
  ready = 2,
  review = 3,
  correct = 4,
  accept = 5,
}

export enum SearchConfig {
  All = 1,
  OneOrMore = 2,
  Exact = 3,
}
