# extra-lazy

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

### lazyFunction

```ts
function lazyFunction<Result, Args extends any[]>(
  getter: () => (...args: Args) => Result
): (...args: Args) => Result
```
