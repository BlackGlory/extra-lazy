interface IContext {
  cache: unknown[]
  index: number
}

const contexts: Array<IContext> = []

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
  const cache: unknown[] = []

  return (...args) => {
    contexts.push({ cache, index: 0 })
    try {
      return fn(...args)
    } finally {
      contexts.pop()
    }
  }
}

export function lazyStatic<T>(getter: () => T): T {
  if (contexts.length) {
    const context = contexts[contexts.length - 1]

    if (context.index === context.cache.length) {
      context.cache.push(getter())
    }

    const result = context.cache[context.index] as T
    context.index++
    return result
  } else {
    throw new Error('lazyStatic can only be called in the function wrapped by withlazyStatic.')
  }
}
