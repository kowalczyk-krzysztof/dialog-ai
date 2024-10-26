export const debounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: T) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
