import { objectIncludes } from '../src/utils'

describe('assertHave function', () => {
  it('works with one parameter', () => {
    expect(objectIncludes({ abc: 3 }, 'abc')).toBeTruthy()
    expect(objectIncludes({ abc: 3 }, 'asd')).toBeFalsy()
  })

  it('works with two parameter', () => {
    expect(
      objectIncludes({ abc: 3, second: 9 }, 'abc', 'second')
    ).toBeTruthy()

    expect(
      objectIncludes({ abc: 3, second: 9 }, 'abc', 'a')
    ).toBeFalsy()
  })
})
