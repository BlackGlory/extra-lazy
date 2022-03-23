import once from 'lodash/once'

export function lazy<T>(getter: () => T): () => T {
  return once(getter)
}
