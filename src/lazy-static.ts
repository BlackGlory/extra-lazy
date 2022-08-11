interface IStaticCache {
  value: unknown
  deps: unknown[]
}

interface IContext {
  cache: Array<IStaticCache | null>
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
    // 自增context.index, 从而确保嵌套在getter里的lazyStatic能够正确工作
    const index = context.index++
    const isFirstRun = index === context.cache.length

    if (isFirstRun) {
      updateCache()
    } else {
      const oldDeps = context.cache[index]!.deps
      if (deps.length === oldDeps.length) {
        if (deps.some((x, i) => x !== oldDeps[i])) {
          updateCache()
        }
      } else {
        updateCache()
      }
    }

    const result = context.cache[index]!.value as T
    return result

    function updateCache(): void {
      // 填充缓存, 从而确保getter里的lazyStatic能够正确工作
      context.cache[index] = null
      context.cache[index] = {
        value: getter()
      , deps: Array.from(deps)
      }
    }
  } else {
    throw new Error('lazyStatic can only be called in the function wrapped by withlazyStatic.')
  }
}
