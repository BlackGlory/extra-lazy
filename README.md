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
