import { lazyStatic, withLazyStatic } from '@src/lazy-static'
import { getError } from 'return-style'

describe('lazyStatic', () => {
  test('lazy', () => {
    const getter1 = jest.fn(text => text)
    const getter2 = jest.fn(text => text)
    const fn = jest.fn((text1: string, text2) => {
      const result1 = lazyStatic(() => getter1(text1))
      const result2 = lazyStatic(() => getter2(text2))
      return result1 + ' ' + result2
    })

    const newFn = withLazyStatic(fn)
    const result1 = newFn('hello', 'world')
    const result2 = newFn('foo', 'bar')

    expect(fn).toBeCalledTimes(2)
    expect(getter1).toBeCalledTimes(1)
    expect(getter2).toBeCalledTimes(1)
    expect(result1).toBe('hello world')
    expect(result2).toBe('hello world')
  })

  test('nested', () => {
    const getter1 = jest.fn(text => text)
    const getter2 = jest.fn(text => text)
    const fn1 = jest.fn((text1: string, text2: string) => {
      const result1 = lazyStatic(() => getter1(text1))
      const result2 = fn2(text2)
      return result1 + ' ' + result2
    })
    const fn2 = jest.fn((text: string) => lazyStatic(() => getter2(text)))

    const newFn = withLazyStatic(fn1)
    const result1 = newFn('hello', 'world')
    const result2 = newFn('foo', 'bar')

    expect(fn1).toBeCalledTimes(2)
    expect(getter1).toBeCalledTimes(1)
    expect(getter2).toBeCalledTimes(1)
    expect(result1).toBe('hello world')
    expect(result2).toBe('hello world')
  })

  test('throws Error when `lazyStatic` is called outside `withLazyStatic`', () => {
    const getter = () => {}

    const err = getError(() => lazyStatic(getter))

    expect(err).toBeInstanceOf(Error)
  })
})
