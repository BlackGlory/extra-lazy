import { lazy } from './lazy.js'

export function lazyFunction<Result, Args extends any[]>(
  getter: () => (...args: Args) => Result
): (...args: Args) => Result {
  const getFunction = lazy(getter)

  return (...args) => {
    const fn = getFunction()
    return fn(...args)
  }
}
