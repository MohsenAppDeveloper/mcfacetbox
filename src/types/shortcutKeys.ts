export enum ShortcutName {
  none = 'none',
  save = 'save',
  nodesearch = 'nodesearch',
  nodenew = 'nodenew',
  nodemove = 'nodemove',
  excerptnew = 'excerptnew',
}

// NOTE -  لیست کلید های غیر قابل استفاده توسط مرورگ
// Ctrl+N	پنجره جدید
// Ctrl+T	تب جدید
// Ctrl+W	بستن تب
// Ctrl+Tab	تغییر تب‌ها
// Alt+F4	بستن پنجره

export const SHORTCUTKeys: Record<ShortcutName, ShortcutConfig> = {
  none: { combo: '====', preventDefault: false },
  save: { combo: 'Ctrl+S', preventDefault: true },
  nodesearch: { combo: 'Ctrl+F', preventDefault: true },
  nodenew: { combo: 'Ctrl+Alt+N', preventDefault: true },
  nodemove: { combo: 'Ctrl+M', preventDefault: true },
  excerptnew: { combo: 'Ctrl+E', preventDefault: true },
}
export interface ShortcutConfig {
  combo: string
  preventDefault?: boolean
}

// export const SHORTCUT_LABELS: Record<ShortcutName, string> = {
//   save: 'ذخیره',
//   search: 'جستجو',
//   new_item: 'آیتم جدید',
//   delete: 'حذف',
//   help: 'راهنما',
// }
