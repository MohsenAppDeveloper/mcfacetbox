export const resolveActiveColor = (isActive: boolean) => {
  if (isActive)
    return 'success'
  else
    return 'error'
}

export const resolveActiveTitle = (isActive: boolean) => {
  if (isActive)
    return 'active'
  else
    return 'deactive'
}
