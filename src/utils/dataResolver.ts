export const resolveActiveColor = (isActive: Boolean) => {
    if (isActive)
        return 'success'
    else
        return 'error'
}

export const resolveActiveTitle = (isActive: Boolean) => {
    if (isActive)
        return 'active'
    else
        return 'deactive'
}
