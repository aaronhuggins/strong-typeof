import { isType, constrainTypes, looseType } from './typeOf'
import type { CustomType, Type } from './types'

type ArgumentLike<T> = Array<T>
type AsyncFunctionLike<A, T> = (...args: ArgumentLike<A>) => Promise<T>
type FunctionLike<A, T> = (...args: ArgumentLike<A>) => T

/** StrongFunction accepts arguments of any type and throws an error for
 * the first argument which does not match its corresponding type, or that is out of bounds.
 */
export function StrongFunction<T>(types: Array<Type | Type[] | CustomType<string> | CustomType<string>[]>, fn: FunctionLike<any, T>): FunctionLike<any, T>
export function StrongFunction<T>(types: Array<Type | Type[] | CustomType<string> | CustomType<string>[]>, fn: AsyncFunctionLike< any, T>): AsyncFunctionLike<any, T>
export function StrongFunction<T>(types: Array<Type | Type[] | CustomType<string> | CustomType<string>[]>, fn: FunctionLike<any, T> | AsyncFunctionLike< any, T>): FunctionLike<any, T> | AsyncFunctionLike<any, T> {
  if (!isType(fn, 'function', 'asyncfunction')) throw new TypeError('Argument fn is required and must be a function.')
  const self = this
  let func: FunctionLike<any, T> | AsyncFunctionLike<any, T>

  if (isType(fn, 'asyncfunction')) {
    func = async function (...args: any[]) {
      const error = constrainTypes(types, ...args)

      if (error) throw error

      return await fn.call(self, ...args)
    }
  } else {
    func = function (...args: any[]) {
      const error = constrainTypes(types, ...args)
  
      if (error) throw error
  
      return fn.call(self, ...args)
    }
  }

  Object.defineProperty(func, 'name', { value: fn.name })

  return func
}

/** WeakFunction accepts one or more arguments of one or more types and
 * throws an error for the first argument which does not match the type(s).
 */
export function WeakFunction<A, T>(type: Type | Type[] | CustomType<string> | CustomType<string>[], fn: FunctionLike<A, T>): FunctionLike<A, T>
export function WeakFunction<A, T>(type: Type | Type[] | CustomType<string> | CustomType<string>[], fn: AsyncFunctionLike<A, T>): AsyncFunctionLike<A, T>
export function WeakFunction<A, T>(type: Type | Type[] | CustomType<string> | CustomType<string>[], fn: FunctionLike<A, T> | AsyncFunctionLike<A, T>): FunctionLike<A, T> | AsyncFunctionLike<A, T> {
  if (!isType(fn, 'function', 'asyncfunction')) throw new TypeError('Argument fn is required and must be a function.')
  const self = this
  let func: FunctionLike<A, T> | AsyncFunctionLike<A, T>

  if (isType(fn, 'asyncfunction')) {
    func = async function (...args: any[]) {
      const error = looseType(type, ...args)

      if (error) throw error

      return await fn.call(self, ...args)
    }
  } else {
    func = function (...args: any[]) {
      const error = looseType(type, ...args)
  
      if (error) throw error
  
      return fn.call(self, ...args)
    }
  }

  Object.defineProperty(func, 'name', { value: fn.name })

  return func
}
