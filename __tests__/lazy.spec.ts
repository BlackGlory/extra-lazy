import { lazy } from '@src/lazy'
import 'jest-extended'

test('lazy<T>(getter: () => T): () => T', () => {
  const value = 'value'
  const getter = jest.fn(() => value)

  const getValue = lazy(getter)
  expect(getter).toBeCalledTimes(0)
  const result1 = getValue()
  const result2 = getValue()

  expect(getValue).toBeFunction()
  expect(result1).toBe(value)
  expect(result2).toBe(value)
  expect(getter).toBeCalledTimes(1)
})
