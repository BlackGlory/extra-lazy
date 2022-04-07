import { lazy } from './lazy'

export function lazyAsyncFunction<Result, Args extends any[]>(
  getter: () => PromiseLike<(...args: Args) => Result>
): (...args: Args) => Promise<Result> {
  const getFn = lazy(getter)
  return async (...args) => {
    const fn = await getFn()
    return fn(...args)
  }
}
