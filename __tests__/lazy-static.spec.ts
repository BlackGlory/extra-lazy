import { lazyStatic, withLazyStatic } from '@src/lazy-static'
import { getError } from 'return-style'

describe('lazyStatic', () => {
  test('multiple lazyStatic calls', () => {
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

  test('nested lazyStatic calls', () => {
    const getter1 = jest.fn(text => text)
    const getter2 = jest.fn(text => text)
    const fn = jest.fn((text: string) => {
      return lazyStatic(() => getter2(lazyStatic(() => getter1(text)).repeat(2)))
    })

    const newFn = withLazyStatic(fn)
    const result1 = newFn('hello')
    const result2 = newFn('world')

    expect(fn).toBeCalledTimes(2)
    expect(getter1).toBeCalledTimes(1)
    expect(getter2).toBeCalledTimes(1)
    expect(getter1).toBeCalledWith('hello')
    expect(getter2).toBeCalledWith('hellohello')
    expect(result1).toBe('hellohello')
    expect(result2).toBe('hellohello')
  })

  test('switch contexts', () => {
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

  describe('assertion/validation', () => {
    test('case 1', () => {
      const fn = withLazyStatic((num: number) => {
        if (num % 2 === 0) return null

        return lazyStatic(() => num)
      })

      const result1 = fn(1)
      const result2 = fn(2)
      const result3 = fn(1)
      const result4 = fn(2)

      expect(result1).toBe(1)
      expect(result2).toBe(null)
      expect(result3).toBe(1)
      expect(result4).toBe(null)
    })

    test('case 2', () => {
      const fn = withLazyStatic((num: number) => {
        if (num % 2 === 0) return null

        return lazyStatic(() => num)
      })

      const result1 = fn(2)
      const result2 = fn(1)
      const result3 = fn(2)
      const result4 = fn(1)

      expect(result1).toBe(null)
      expect(result2).toBe(1)
      expect(result3).toBe(null)
      expect(result4).toBe(1)
    })
  })

  test('throws Error when `lazyStatic` is called outside `withLazyStatic`', () => {
    const getter = () => {}

    const err = getError(() => lazyStatic(getter))

    expect(err).toBeInstanceOf(Error)
  })

  describe('deps', () => {
    it('does not re-run getter if deps are same', () => {
      const getter = jest.fn(text => text)
      const obj = {}
      const deps = [obj]
      const fn = jest.fn((text: string) => lazyStatic(() => getter(text), deps))

      const newFn = withLazyStatic(fn)
      const result1 = newFn('hello')
      const result2 = newFn('world')

      expect(fn).toBeCalledTimes(2)
      expect(getter).toBeCalledTimes(1)
      expect(result1).toBe('hello')
      expect(result2).toBe('hello')
    })

    it('re-runs getter if deps are different', () => {
      const getter = jest.fn(text => text)
      const obj = {}
      const deps = [obj]
      const fn = jest.fn((text: string) => lazyStatic(() => getter(text), deps))

      const newFn = withLazyStatic(fn)
      const result1 = newFn('hello')
      deps[0] = {}
      const result2 = newFn('world')

      expect(fn).toBeCalledTimes(2)
      expect(getter).toBeCalledTimes(2)
      expect(result1).toBe('hello')
      expect(result2).toBe('world')
    })
  })
})
