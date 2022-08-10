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
function lazyStatic<T>(getter: () => T): T

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

```ts
const fn = withLazyStatic((text: string) => lazyStatic(() => text))

fn('hello') // 'hello'
fn('world') // 'hello'
```
