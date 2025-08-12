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
  none: { combo: '====', preventDefault: false, keyTitle: '' },
  save: { combo: 'Ctrl+KeyS', preventDefault: true, keyTitle: 'Ctrl+S' },
  nodesearch: { combo: 'Ctrl+KeyF', preventDefault: true, keyTitle: 'Ctrl+F' },
  nodenew: { combo: 'Ctrl+Alt+KeyN', preventDefault: true, keyTitle: 'Ctrl+N' },
  nodemove: { combo: 'Ctrl+KeyM', preventDefault: true, keyTitle: 'Ctrl+M' },
  excerptnew: { combo: 'Ctrl+KeyE', preventDefault: true, keyTitle: 'Ctrl+E' },
}
export interface ShortcutConfig {
  combo: string
  preventDefault?: boolean
  keyTitle: string
}

// export const SHORTCUT_LABELS: Record<ShortcutName, string> = {
//   save: 'ذخیره',
//   search: 'جستجو',
//   new_item: 'آیتم جدید',
//   delete: 'حذف',
//   help: 'راهنما',
// }
