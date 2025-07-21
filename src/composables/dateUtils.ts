export const usePersianDate = (inputdate: string) => {
  return Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(inputdate))
}
