import { IProject } from '@/types/project'

interface DB {
    roles: IProject[]
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


        }
        ,
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


        }
    ]
}
