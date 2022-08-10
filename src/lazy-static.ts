interface IStaticCache {
  value: unknown
  deps: unknown[]
}

interface IContext {
  cache: IStaticCache[]
  index: number
}

const contexts: IContext[] = []

/**
 * @param fn
 * The function must satisfy the following conditions, it's like React hooks very much:
 * - The function should not be an async function,
 *   it is impossible to ensure that `lazyStatic` works correctly in asynchronous flows.
 * - `lazyStatic` calls should not be in loops or branches.
 */
export function withLazyStatic<
  Result
, Args extends any[]
>(fn: (...args: Args) => PromiseLike<Result>): never
export function withLazyStatic<
  Result
, Args extends any[]
>(fn: (...args: Args) => Result): (...args: Args) => Result
export function withLazyStatic<
  Result
, Args extends any[]
>(fn: (...args: Args) => Result): (...args: Args) => Result {
  const cache: IStaticCache[] = []

  return (...args) => {
    contexts.push({ cache, index: 0 })
    try {
      return fn(...args)
    } finally {
      contexts.pop()
    }
  }
}

export function lazyStatic<T>(getter: () => T, deps: unknown[] = []): T {
  if (contexts.length) {
    const context = contexts[contexts.length - 1]

    if (context.index === context.cache.length) {
      // 首次运行
      updateCache()
    } else {
      // 非首次运行
      const oldDeps = context.cache[context.index].deps
      if (deps.length === oldDeps.length) {
        if (deps.some((x, i) => x !== oldDeps[i])) {
          updateCache()
        }
      } else {
        updateCache()
      }
    }

    const result = context.cache[context.index].value as T
    context.index++
    return result

    function updateCache() {
      context.cache[context.index] = {
        value: getter()
      , deps: Array.from(deps)
      }
    }
  } else {
    throw new Error('lazyStatic can only be called in the function wrapped by withlazyStatic.')
  }
}
