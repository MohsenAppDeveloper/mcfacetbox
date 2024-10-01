

export const paginationMeta = <T extends { page: number; itemsPerPage: number }>(options: T, total: number, showingmsg: string, tomsg: string, ofmsg: string, entriesmsg: string) => {
  const start = (options.page - 1) * options.itemsPerPage + 1
  const end = Math.min(options.page * options.itemsPerPage, total)

  return `${showingmsg} ${total === 0 ? 0 : start} ${tomsg} ${end} ${ofmsg} ${total} ${entriesmsg}`
}
