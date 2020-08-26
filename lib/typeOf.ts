import { TArray, TAsyncFunction, TFunction, TIterable, TNull, TPromise, getCustomTypes } from './types'
import type { CustomType, Type } from './types'

/** Returns the given type of a value. */
export function typeOf(value: string): 'string'
export function typeOf(value: number): 'number'
export function typeOf(value: bigint): 'bigint'
export function typeOf(value: boolean): 'boolean'
export function typeOf(value: symbol): 'symbol'
export function typeOf(value: undefined): 'undefined'
export function typeOf(value: Function): 'function'
export function typeOf(value: object): 'object'
export function typeOf(value: null): 'null'
export function typeOf(value: Array<any>): 'array'
export function typeOf(value: Promise<any>): 'promise'
export function typeOf(value: Iterable<any>): 'iterable'
export function typeOf(value: any): Type | CustomType<string>
export function typeOf (value: any): Type | CustomType<string> {
  let actualType: Type | CustomType<string> = typeof value

  switch (actualType) {
    case 'object':
      if (value === null) actualType = TNull
      if (Array.isArray(value)) actualType = TArray
      if (value.constructor.name === 'Promise') actualType = TPromise
      if (typeof value[Symbol.iterator] === TFunction) actualType = TIterable
    case TFunction:
      if (value.constructor.name === 'AsyncFunction') actualType = TAsyncFunction
  }

  const typeMap = getCustomTypes(actualType as Type)

  for (const [customType, typeCheck] of typeMap.entries()) {
    if (typeCheck(value) === customType) {
      actualType = customType

      break
    }
  }

  return actualType
}

/** Checks the given value against one or more types. */
export function isType (value: any, ...types: Type[] | CustomType<string>[]): boolean {
  const type: Type | CustomType<string> = typeOf(value)

  if (type === 'array' && types.includes('iterable')) return true

  return types.includes(type as any)
}

export function constrainTypes (types: Array<Type | Type[] | CustomType<string> | CustomType<string>[]>, ...values: any[]): Error | void {
  for (let i = 0; i < values.length; i += 0) {
    const value = values[i]
    const type = types[i]
    let result = false

    if (typeof type === 'undefined') {
      return new Error(`Argument at position ${i} is out of bounds and cannot be type-checked.`)
    } else if (typeof type === 'string') {
      result = isType(value, type)
    } else if (Array.isArray(type)) {
      result = isType(value, ...type)
    }

    if (!result) {
      return new TypeError(`Argument at position ${i} is not of type ${type}.`)
    }
  }
}

export function looseType (type: Type | Type[] | CustomType<string> | CustomType<string>[], ...values: any[]) {
  const types = typeof type === 'string' ? [type] : type

  for (let i = 0; i < values.length; i += 0) {
    const value = values[i]
    let result = isType(value, ...types)

    if (!result) {
      return new TypeError(`Argument at position ${i} is not of type ${type}.`)
    }
  }
}
