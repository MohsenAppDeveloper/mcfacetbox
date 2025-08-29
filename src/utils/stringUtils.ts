export interface JoinWithDotsOptions {
  separator?: string
  maxItems?: number
  ellipsisText?: string
}

export function joinWithDots(
  parts: (string | null | undefined)[],
  options?: JoinWithDotsOptions,
): string {
  const {
    separator = '',
    maxItems,
    ellipsisText = ' [...]',
  } = options || {}

  const cleaned = parts
    .filter(Boolean)
    .map(p => (p ?? '').replace('...', '').trim())
    .filter(p => p.length > 0)

  const limited
      = typeof maxItems === 'number' && cleaned.length > maxItems
        ? cleaned.slice(0, maxItems).concat(ellipsisText)
        : cleaned

  return limited.join(separator)
}

export const convertToEnglishNumbers = (input: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

  let output = input

  persianNumbers.forEach((persianNum, index) => {
    output = output.replace(new RegExp(persianNum, 'g'), index.toString())
  })

  arabicNumbers.forEach((arabicNum, index) => {
    output = output.replace(new RegExp(arabicNum, 'g'), index.toString())
  })

  return output
}
