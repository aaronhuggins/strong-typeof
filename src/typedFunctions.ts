import { isType, constrainTypes, looseType } from './typeOf'
import { Type, TAsyncFunction, TFunction } from './types'
import { CustomType } from './customTypes'

/** @category Typed Function */
type ArgumentLike<T> = Array<T>
/** @category Typed Function */
type AsyncFunctionLike<A, T> = (...args: ArgumentLike<A>) => Promise<T>
/** @category Typed Function */
type FunctionLike<A, T> = (...args: ArgumentLike<A>) => T
/** @category Typed Function */
type TypedFunction<A, T> = FunctionLike<A, T> & {
  isStrongFunction?: boolean
  isWeakFunction?: boolean
  untypedFunction?: FunctionLike<A, T>
}
/** @category Typed Function */
type TypedAsyncFunction<A, T> = AsyncFunctionLike<A, T> & {
  isStrongFunction?: boolean
  isWeakFunction?: boolean
  untypedFunction?: AsyncFunctionLike<A, T>
}

/** StrongFunction accepts arguments of any type and throws an error for
 * the first argument which does not match its corresponding type, or that is out of bounds.
 *
 * ```js
 * const confirm = StrongFunction(['string', 'number'], function confirm (str, num = 1) {
 *   // Types matched!
 *   return str + num.toString()
 * })
 *
 * confirm('Number is :')     // Number is: 1
 * confirm('Number is :', 42) // Number is: 42
 * confirm(12)                // throws error.
 * ```
 * @category Factory
 */
export function StrongFunction<T> (
  types: Array<Type | Type[] | CustomType<string> | CustomType<string>[]>,
  fn: FunctionLike<any, T>
): TypedFunction<any, T>
export function StrongFunction<T> (
  types: Array<Type | Type[] | CustomType<string> | CustomType<string>[]>,
  fn: AsyncFunctionLike<any, T>
): TypedAsyncFunction<any, T>
export function StrongFunction<T> (
  types: Array<Type | Type[] | CustomType<string> | CustomType<string>[]>,
  fn: FunctionLike<any, T> | AsyncFunctionLike<any, T>
): TypedFunction<any, T> | TypedAsyncFunction<any, T> {
  if (!isType(fn, TFunction, TAsyncFunction)) throw new TypeError('Argument fn is required and must be a function.')
  let func: TypedFunction<any, T> | TypedAsyncFunction<any, T>

  if (isType(fn, TAsyncFunction)) {
    func = async function (...args: any[]) {
      const error = constrainTypes(types, ...args)

      if (error) throw error

      return await fn.call(this, ...args)
    }
  } else {
    func = function (...args: any[]) {
      const error = constrainTypes(types, ...args)

      if (error) throw error

      return fn.call(this, ...args)
    }
  }

  Object.defineProperty(func, 'name', { value: fn.name })
  Object.defineProperty(func, 'isStrongFunction', { value: true })
  Object.defineProperty(func, 'isWeakFunction', { value: false })
  Object.defineProperty(func, 'untypedFunction', { value: fn })

  return func
}

/** WeakFunction accepts one or more arguments of one or more types and
 * throws an error for the first argument which does not match the type(s).
 *
 * ```js
 * const confirm = WeakFunction(['string', 'number'], function confirm (...args) {
 *   // Types matched!
 *   return args.join(' ')
 * })
 *
 * confirm('Number is :')     // Number is:
 * confirm('Number is :', 42) // Number is: 42
 * confirm(12, 15, 'abc')     // 12 15 abc
 * confirm(42, 'abc', null)   // throws error.
 * ```
 * @category Factory
 */
export function WeakFunction<A, T> (
  type: Type | Type[] | CustomType<string> | CustomType<string>[],
  fn: FunctionLike<A, T>
): TypedFunction<A, T>
export function WeakFunction<A, T> (
  type: Type | Type[] | CustomType<string> | CustomType<string>[],
  fn: AsyncFunctionLike<A, T>
): TypedAsyncFunction<A, T>
export function WeakFunction<A, T> (
  type: Type | Type[] | CustomType<string> | CustomType<string>[],
  fn: FunctionLike<A, T> | AsyncFunctionLike<A, T>
): TypedFunction<A, T> | TypedAsyncFunction<A, T> {
  if (!isType(fn, TFunction, TAsyncFunction)) throw new TypeError('Argument fn is required and must be a function.')
  let func: TypedFunction<A, T> | TypedAsyncFunction<A, T>

  if (isType(fn, TAsyncFunction)) {
    func = async function (...args: any[]) {
      const error = looseType(type, ...args)

      if (error) throw error

      return await fn.call(this, ...args)
    }
  } else {
    func = function (...args: any[]) {
      const error = looseType(type, ...args)

      if (error) throw error

      return fn.call(this, ...args)
    }
  }

  Object.defineProperty(func, 'name', { value: fn.name })
  Object.defineProperty(func, 'isStrongFunction', { value: false })
  Object.defineProperty(func, 'isWeakFunction', { value: true })
  Object.defineProperty(func, 'untypedFunction', { value: fn })

  return func
}
