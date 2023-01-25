import { lazyFunction } from '@src/lazy-function.js'
import { jest } from '@jest/globals'

test(`
  lazyFunction<Result, Args extends any[]>(
    getter: () => (...args: Args) => Result
  ): (...args: Args) => Result
`, () => {
  const fn = jest.fn((text: string) => text)
  const getter = jest.fn(() => fn)

  const newFn = lazyFunction(getter)
  expect(getter).toBeCalledTimes(0)
  const result1 = newFn('foo')
  const result2 = newFn('bar')

  expect(result1).toBe('foo')
  expect(result2).toBe('bar')
  expect(getter).toBeCalledTimes(1)
  expect(fn).toBeCalledTimes(2)
})
