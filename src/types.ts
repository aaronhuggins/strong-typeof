/** @category Built-In */
export type Type =
  | 'object'
  | 'array'
  | 'null'
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'function'
  | 'asyncfunction'
  | 'promise'
  | 'iterable'

/** @category Built-In Type */
export const TObject: Type = 'object'
/** @category Built-In Type */
export const TArray: Type = 'array'
/** @category Built-In Type */
export const TNull: Type = 'null'
/** @category Built-In Type */
export const TString: Type = 'string'
/** @category Built-In Type */
export const TNumber: Type = 'number'
/** @category Built-In Type */
export const TBigInt: Type = 'bigint'
/** @category Built-In Type */
export const TBoolean: Type = 'boolean'
/** @category Built-In Type */
export const TSymbol: Type = 'symbol'
/** @category Built-In Type */
export const TUndefined: Type = 'undefined'
/** @category Built-In Type */
export const TFunction: Type = 'function'
/** @category Built-In Type */
export const TAsyncFunction: Type = 'asyncfunction'
/** @category Built-In Type */
export const TPromise: Type = 'promise'
/** @category Built-In Type */
export const TIterable: Type = 'iterable'

/** Export the list of built-in types.
 * @category Built-In Type
 */
export function getBuiltinTypes (): Type[] {
  const result: Type[] = []
  let thisModule = this

  if (!thisModule) {
    // @ts-ignore
    thisModule = exports || {}
  }

  for (const prop of Object.keys(thisModule)) {
    if (Object.prototype.hasOwnProperty.call(thisModule, prop) && prop[0] === 'T') {
      result.push(thisModule[prop])
    }
  }

  return result
}
