import { IRole } from '@/types/rolePermission'

interface DB {
    roles: IRole[]
}

export const db: DB = {
    roles: [
        {
            id: 1,
            createDate: "1403/02/02",
            isActive: true,
            description: "این نقش به صورت تستی ایجاد شده است",
            isSelected: false,
            isLoading: false,
            selectable: false,
            disabled: true,
            title: "مدیر",
            permissions: [{ id: 1, title: "درخت", "children": [{ id: 0, title: "افزودن درخت", "children": [] }] }]
        },
        {
            id: 2,
            createDate: "1403/02/03",
            isActive: true,
            description: "نقش کاربر عادی",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "کاربر",
            permissions: [{ id: 2, title: "محتوا", "children": [{ id: 1, title: "مشاهده محتوا", "children": [] }] }]
        },
        {
            id: 3,
            createDate: "1403/02/04",
            isActive: false,
            description: "نقش مهمان",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: true,
            title: "مهمان",
            permissions: []
        },
        {
            id: 4,
            createDate: "1403/02/05",
            isActive: true,
            description: "نقش مدیر سیستم",
            isSelected: false,
            isLoading: true,
            selectable: false,
            disabled: false,
            title: "مدیر سیستم",
            permissions: [{ id: 3, title: "کاربران", "children": [] }]
        },
        {
            id: 5,
            createDate: "1403/02/06",
            isActive: true,
            description: "نقش توسعه‌دهنده",
            isSelected: true,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "توسعه‌دهنده",
            permissions: [{ id: 4, title: "کد", "children": [{ id: 2, title: "نوشتن کد", "children": [] }] }]
        },
        {
            id: 6,
            createDate: "1403/02/07",
            isActive: true,
            description: "نقش طراح",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "طراح",
            permissions: [{ id: 5, title: "طراحی", "children": [{ id: 3, title: "طراحی UI", "children": [] }] }]
        },
        {
            id: 7,
            createDate: "1403/02/08",
            isActive: true,
            description: "نقش تحلیل‌گر",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "تحلیل‌گر",
            permissions: [{ id: 6, title: "تحلیل", "children": [] }]
        },
        {
            id: 8,
            createDate: "1403/02/09",
            isActive: true,
            description: "نقش بازاریاب",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "بازاریاب",
            permissions: [{ id: 7, title: "بازاریابی", "children": [] }]
        },
        {
            id: 9,
            createDate: "1403/02/10",
            isActive: true,
            description: "نقش پشتیبان",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "پشتیبان",
            permissions: [{ id: 8, title: "پشتیبانی", "children": [] }]
        },
        {
            id: 10,
            createDate: "1403/02/11",
            isActive: true,
            description: "نقش مدیر پروژه",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "مدیر پروژه",
            permissions: [{ id: 9, title: "مدیریت پروژه", "children": [] }]
        },
        {
            id: 11,
            createDate: "1403/02/12",
            isActive: true,
            description: "نقش حسابدار",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "حسابدار",
            permissions: [{ id: 10, title: "حسابداری", "children": [] }]
        },
        {
            id: 12,
            createDate: "1403/02/13",
            isActive: true,
            description: "نقش مسئول منابع انسانی",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "مسئول منابع انسانی",
            permissions: [{ id: 11, title: "مدیریت منابع انسانی", "children": [] }]
        },
        {
            id: 13,
            createDate: "1403/02/14",
            isActive: true,
            description: "نقش مدیر محصول",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "مدیر محصول",
            permissions: [{ id: 12, title: "مدیریت محصول", "children": [] }]
        },
        {
            id: 14,
            createDate: "1403/02/15",
            isActive: true,
            description: "نقش مدیر فروش",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "مدیر فروش",
            permissions: [{ id: 13, title: "فروش", "children": [] }]
        },
        {
            id: 15,
            createDate: "1403/02/16",
            isActive: true,
            description: "نقش مدیر بازاریابی",
            isSelected: true,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "مدیر بازاریابی",
            permissions: [{ id: 14, title: "بازاریابی", "children": [] }]
        },
        {
            id: 16,
            createDate: "1403/02/17",
            isActive: true,
            description: "نقش مدیر فناوری اطلاعات",
            isSelected: false,
            isLoading: false,
            selectable: false,
            disabled: false,
            title: "مدیر فناوری اطلاعات",
            permissions: [{ id: 15, title: "فناوری اطلاعات", "children": [] }]
        },
        {
            id: 17,
            createDate: "1403/02/18",
            isActive: false,
            description: "نقش مدیر امنیت",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: true,
            title: "مدیر امنیت",
            permissions: [{ id: 16, title: "امنیت", "children": [] }]
        },
        {
            id: 18,
            createDate: "1403/02/19",
            isActive: true,
            description: "نقش مدیر شبکه",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "مدیر شبکه",
            permissions: [{ id: 17, title: "شبکه", "children": [] }]
        },
        {
            id: 19,
            createDate: "1403/02/20",
            isActive: true,
            description: "نقش تحلیل‌گر داده",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "تحلیل‌گر داده",
            permissions: [{ id: 18, title: "تحلیل داده", "children": [] }]
        },
        {
            id: 20,
            createDate: "1403/02/21",
            isActive: true,
            description: "نقش سرپرست",
            isSelected: false,
            isLoading: false,
            selectable: true,
            disabled: false,
            title: "سرپرست",
            permissions: [{ id: 19, title: "مدیریت", "children": [] }]
        }
    ]
}
