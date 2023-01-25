export function lazy<T>(getter: () => T): () => T {
  let resultExists = false
  let result: T

  return () => {
    if (!resultExists) {
      result = getter()
      resultExists = true
    }
    return result
  }
}
