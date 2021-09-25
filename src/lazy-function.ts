import { lazy } from './lazy'

export function lazyFunction<Result, Args extends any[]>(
  getter: () => (...args: Args) => Result
): (...args: Args) => Result {
  const getFn = lazy(getter)
  return (...args) => getFn()(...args)
}
