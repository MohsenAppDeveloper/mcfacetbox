import { DirectiveBinding } from 'vue';

const noContextMenu = {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
        const preventContextMenu = (event: MouseEvent) => {
            event.preventDefault(); // جلوگیری از نمایش منوی راست‌کلیک
        };

        el.addEventListener('contextmenu', preventContextMenu);

        // ذخیره لیسنر برای استفاده در unmounted
        (el as any).__preventContextMenu__ = preventContextMenu;
    },
    unmounted(el: HTMLElement) {
        // حذف لیسنر
        el.removeEventListener('contextmenu', el.__preventContextMenu__);
        delete el.__preventContextMenu__; // حذف مرجع لیسنر
    }
};

export default noContextMenu;
