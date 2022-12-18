import { lazyAsyncFunction } from '@src/lazy-async-function'

test(`
  lazyAsyncFunction<Result, Args extends any[]>(
    getter: () => PromiseLike<(...args: Args) => Result>
  ): (...args: Args) => Promise<Result>
`, async () => {
  const fn = jest.fn((text: string) => text)
  const getter = jest.fn(async () => fn)

  const newFn = lazyAsyncFunction(getter)
  expect(getter).toBeCalledTimes(0)
  const result1 = await newFn('foo')
  const result2 = await newFn('bar')

  expect(result1).toBe('foo')
  expect(result2).toBe('bar')
  expect(getter).toBeCalledTimes(1)
  expect(fn).toBeCalledTimes(2)
})
