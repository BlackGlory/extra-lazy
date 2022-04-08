export function lazy<T>(getter: () => T): () => T {
  let resultExists = false
  let result: T

  return function () {
    if (!resultExists) {
      result = getter()
      resultExists = true
    }
    return result
  }
}
