export function ternary<T>(
  condition: boolean | string | number | undefined | null,
  trulyVal: unknown,
  falsyVal: unknown,
): T {
  return (condition ? trulyVal : falsyVal) as T
}

export function isSameDate(date1?: Date, date2?: Date) {
  return (
    date1?.getDate() === date2?.getDate() &&
    date1?.getMonth() === date2?.getMonth() &&
    date1?.getFullYear() === date2?.getFullYear()
  )
}

export function isGreaterThanDate(date1?: Date, date2?: Date) {
  return !!date1 && !!date2 && date1.getTime() > date2.getTime()
}

export function isLessThanDate(date1?: Date, date2?: Date) {
  return !!date1 && !!date2 && date1.getTime() < date2.getTime()
}
