import { lazy } from './lazy.js'

export function lazyAsyncFunction<Result, Args extends any[]>(
  getter: () => PromiseLike<(...args: Args) => Result>
): (...args: Args) => Promise<Result> {
  const getFunction = lazy(getter)

  return async (...args) => {
    const fn = await getFunction()
    return fn(...args)
  }
}
