import type { ISimpleTreeActionable } from '@/types/baseModels'

interface DB {
  mainTree: ISimpleTreeActionable
}

export const db: DB = {
  mainTree:
 {
   id: 0,
   title: 'درخت خانواده',
   tempData: {},
   parentId: -1,
   children:
    [
      {
        id: 1,
        title: 'رابطه والدین و فرزندان',
        tempData: {},
        editing: false,
        loading: false,
        selected: false,
        parentId: 0,
        children: [
          {
            id: 2,
            title: 'چالش‌های ارتباطی',
            tempData: {},
            editing: false,
            loading: false,
            selected: false,
            parentId: 1,
            children: [
              {
                id: 3,
                title: 'مشکلات گوش دادن',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 2,

              },
              {
                id: 4,
                title: 'فهم متفاوت',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 2,

              },
            ],
          },
          {
            id: 5,
            title: 'روش‌های تربیتی',
            tempData: {},
            editing: false,
            loading: false,
            selected: false,
            parentId: 1,
            children: [
              {
                id: 6,
                title: 'مدیریت رفتار',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 5,

              },
              {
                id: 7,
                title: 'تربیت مثبت',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 5,

              },
            ],
          },
        ],
      },
      {
        id: 8,
        title: 'چالش‌های زندگی زناشویی',
        tempData: {},
        editing: false,
        loading: false,
        selected: false,
        parentId: 0,
        children: [
          {
            id: 9,
            title: 'اختلافات مالی',
            tempData: {},
            editing: false,
            loading: false,
            selected: false,
            parentId: 8,
            children: [
              {
                id: 10,
                title: 'برنامه‌ریزی مالی',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 9,

              },
              {
                id: 11,
                title: 'مدیریت هزینه‌ها',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 9,

              },
            ],
          },
          {
            id: 12,
            title: 'مسائل ارتباطی',
            tempData: {},
            editing: false,
            loading: false,
            selected: false,
            parentId: 8,
            children: [
              {
                id: 13,
                title: 'فهم متقابل',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 12,

              },
              {
                id: 14,
                title: 'تنش‌ها و تضادها',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 12,

              },
            ],
          },
        ],
      },
      {
        id: 15,
        title: 'نقش خانواده در اجتماع',
        tempData: {},
        editing: false,
        loading: false,
        selected: false,
        parentId: 0,
        children: [
          {
            id: 16,
            title: 'تربیت اجتماعی',
            tempData: {},
            editing: false,
            loading: false,
            selected: false,
            parentId: 15,
            children: [
              {
                id: 17,
                title: 'آموزش مهارت‌های اجتماعی',
                tempData: {},
                editing: false,
                loading: false,
                selected: false,
                parentId: 16,

              },
            ],
          },
          {
            id: 18,
            title: 'تاثیر محیط خانواده',
            tempData: {},
            editing: false,
            loading: false,
            selected: false,
            parentId: 15,

          },
        ],
      },
    ],
 },
}
