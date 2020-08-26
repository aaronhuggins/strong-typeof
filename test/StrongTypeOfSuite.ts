import { addCustomType, CustomType, isType } from '../index'
import { strictEqual } from 'assert'

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

    console.time('customTypeFalse')
    strictEqual(isType(notMyObject, customType), false)
    console.timeEnd('customTypeFalse')

    addCustomType('object', customType, customTypeCheck)

    console.time('customTypeTrue')
    strictEqual(isType(myObject, customType), true)
    console.timeEnd('customTypeTrue')
  })
})
