# extra-lazy
Yet another lazy evaluation library.

## Install
```sh
npm install --save extra-lazy
# or
yarn add extra-lazy
```

## Usage
```ts
import { lazy } from 'extra-lazy'

const getValue = lazy(() => {
  // ...
  return value
})
const value = getValue()
```

## API
### lazy
```ts
function lazy<T>(getter: () => T): () => T
```

Create a value lazily.

which implicitly has memoization,
because the evaluation will only be performed once.

### weakLazy
```ts
function weakLazy<T extends object>(getter: () => T): () => T
```

### lazyFunction
```ts
function lazyFunction<Result, Args extends any[]>(
  getter: () => (...args: Args) => Result
): (...args: Args) => Result
```

Create a function lazily.

### lazyAsyncFunction
```ts
function lazyAsyncFunction<Result, Args extends any[]>(
  getter: () => PromiseLike<(...args: Args) => Result>
): (...args: Args) => Promise<Result>
```

Create a async function lazily.

### lazyStatic
```ts
function lazyStatic<T>(
  getter: () => T
, deps?: unknown[] = []
): T

/**
 * @param fn
 * The function must satisfy the following conditions, it's like React hooks very much:
 * - The function should not be an async function,
 *   it is impossible to ensure that `lazyStatic` works correctly in asynchronous flows.
 * - `lazyStatic` calls should not be in loops or branches.
 */
function withLazyStatic<Result, Args extends any[]>(
  fn: (...args: Args) => Result
): (...args: Args) => Result
```

Example:
```ts
const fn = withLazyStatic((text: string) => lazyStatic(() => text))

fn('hello') // 'hello'
fn('world') // 'hello'
```

#### Best practices
##### Loop
```ts
// bad
withLazyStatic(() => {
  while (condition) {
    const value = lazyStatic(() => {
      // ...
    })
    // ...
  }
})

// good
withLazyStatic(() => {
  const value = lazyStatic(() => {
    // ...
  })

  while (condition) {
    // ...
  }
})
```

##### Branch
```ts
// bad
withLazyStatic(() => {
  if (condition) {
    const value = lazyStatic(() => {
      // ...
    })
    // ...
  } else {
    // ...
  }
})

// good
withLazyStatic(() => {
  const value = lazyStatic(() => {
    // ...
  })

  if (condition) {
    // ...
  } else {
    // ...
  }
})
```

###### Assertion/Validation
``` ts
// bad
withLazyStatic((form: IForm) => {
  if (validate(form)) {
    const value = lazyStatic(() => {
      // ...
    })
    // ...
  } else {
    const value = lazyStatic(() => {
      // ...
    })
    return null // or throw an error
  }
})

// okay
withLazyStatic((form: IForm) => {
  if (validate(form)) {
    const value = lazyStatic(() => {
      // ...
    })
    // ...
  } else {
    return null // or throw an error
  }
})

// good, `lazyStatic` can always be called after guards
withLazyStatic((form: IForm) => {
  if (!validate(form)) return null // or throw an error

  const value = lazyStatic(() => {
    // ...
  })
  // ...
})
```
