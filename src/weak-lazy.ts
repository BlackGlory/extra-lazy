import { isntUndefined } from 'extra-utils'

export function weakLazy<T extends object>(getter: () => T): () => T {
  let ref: WeakRef<T> | undefined

  return function () {
    if (ref) {
      const value = ref.deref()
      if (isntUndefined(value)) {
        return value
      } else {
        return getValue()
      }
    } else {
      return getValue()
    }
  }

  function getValue(): T {
    const value = getter()
    ref = new WeakRef(value)
    return value
  }
}
