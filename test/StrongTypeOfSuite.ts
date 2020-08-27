import {
  typeOf,
  addCustomType,
  setCustomTypes,
  CustomType,
  isType,
  constrainTypes,
  getBuiltinTypes,
  StrongFunction,
  WeakFunction,
  TArray,
  TAsyncFunction,
  TBigInt,
  TBoolean,
  TFunction,
  TIterable,
  TNull,
  TNumber,
  TObject,
  TPromise,
  TString,
  TSymbol,
  TUndefined
} from '../src/index'
import { strictEqual, throws, rejects, doesNotThrow } from 'assert'

describe('StrongTypeOf', () => {
  it('should validate custom type', () => {
    const customType: CustomType<'myobject'> = 'myobject'
    const customTypeCheck = function (value: any) {
      if (typeof value.duck === 'string') {
        return customType
      }
    }

    const myObject = {
      duck: 'type'
    }
    const notMyObject = {}
    const customTypeEntries: Array<[CustomType<string>, (value: any) => CustomType<string>]> = [
      ['custom1', (val: any) => { return val === 'kirk' ? 'custom1' : undefined }],
      ['custom2', (val: any) => { return val === 'spock' ? 'custom2' : undefined }]
    ]

    strictEqual(isType(notMyObject, customType), false)

    addCustomType('object', customType, customTypeCheck)

    strictEqual(isType(myObject, customType), true)

    doesNotThrow(() => {
      setCustomTypes('string', customTypeEntries)
    })
    doesNotThrow(() => {
      setCustomTypes('string', new Map(customTypeEntries))
    })
  })

  it('should type check function arguments at runtime', async () => {
    const success = 'success'
    const unwrapped = (...args: any[]) => success
    const typeArray = [
      TArray,
      TAsyncFunction,
      TBigInt,
      TBoolean,
      TFunction,
      TIterable,
      TNull,
      TNumber,
      TObject,
      TPromise,
      TString,
      TSymbol,
      TUndefined
    ]
    const argArray: any[] = [
      [],
      async () => {},
      // @ts-ignore
      10n,
      true,
      () => {},
      new Set(),
      null,
      10,
      {},
      new Promise(() => {}),
      success,
      Symbol.iterator,
      undefined
    ]
    const strongFunction = StrongFunction(typeArray, function confirm (a, b, c, d, e, f, g, h, i, j, k, l, m) {
      return success
    })
    const strongAsyncFunction = StrongFunction(typeArray, async function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
      return await Promise.resolve(success)
    })
    const weakFunction = WeakFunction(TIterable, unwrapped)
    const weakAsyncFunction = WeakFunction(TUndefined, async (...args: any[]) => await Promise.resolve(success))
    const multiTypeStrongFunction = StrongFunction([[TString, TNumber], TBoolean], unwrapped)
    const multiTypeWeakFunction = WeakFunction([TObject, TUndefined], unwrapped)

    const result = strongFunction(...argArray)
    const weakResult = weakFunction([], new Map())
    const asyncResult = await strongAsyncFunction(...argArray)
    const weakAsyncResult = await weakAsyncFunction()
    const multiResult = multiTypeStrongFunction('hello, world!', false)
    const multiWeakResult = multiTypeWeakFunction()

    strictEqual(result, success)
    strictEqual(weakResult, success)
    strictEqual(asyncResult, success)
    strictEqual(multiResult, success)
    strictEqual(weakAsyncResult, success)
    strictEqual(multiWeakResult, success)
    strictEqual(strongFunction.name, 'confirm')
    strictEqual(strongFunction.isStrongFunction, true)
    strictEqual(strongFunction.isWeakFunction, false)
    strictEqual(weakFunction.untypedFunction, unwrapped)
    strictEqual(weakFunction.isStrongFunction, false)
    strictEqual(weakFunction.isWeakFunction, true)

    throws(() => {
      StrongFunction([], ({} as unknown) as () => {})
    })
    throws(() => {
      WeakFunction([], ({} as unknown) as () => {})
    })
    throws(() => {
      strongFunction(...[...argArray, 12])
    })
    throws(() => {
      strongFunction(1)
    })
    throws(() => {
      weakFunction(1)
    })

    rejects(async () => {
      await strongAsyncFunction(1)
    })
    rejects(async () => {
      await weakAsyncFunction(1)
    })
  })

  it('should cover remaining scenarios', () => {
    const supported = getBuiltinTypes()
    const badThis = getBuiltinTypes.call(false)

    // Adds one more thing to custom object check
    doesNotThrow(() => {
      addCustomType('object', 'customType', () => {
        return 'customType'
      })
    })

    // Validates last branch of type constraints
    doesNotThrow(() => {
      constrainTypes([(12 as unknown) as string], 'check')
    })

    strictEqual(typeOf(supported), 'array')
    strictEqual(badThis.length, 13)
  })
})
