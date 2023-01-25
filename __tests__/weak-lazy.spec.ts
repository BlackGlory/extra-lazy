import { weakLazy } from '@src/weak-lazy'

test('weakLazy', () => {
  const getter = jest.fn(() => ['value'])

  const getValue = weakLazy(getter)
  expect(getter).toBeCalledTimes(0)
  const result1 = getValue()
  const result2 = getValue()

  expect(result1).toStrictEqual(['value'])
  expect(result2).toBe(result1)
  expect(getter).toBeCalledTimes(1)
})
