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

    addCustomType('object', customType, customTypeCheck)

    const myObject = {
      duck: 'type'
    }
    const notMyObject = {}

    strictEqual(isType(myObject, customType), true)
    strictEqual(isType(notMyObject, customType), false)
  })
})
