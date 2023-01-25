export function lazy<T>(getter: () => T): () => T {
  let exists = false
  let value: T

  return () => {
    if (!exists) {
      value = getter()
      exists = true
    }
    return value
  }
}
