export type Type = 'object' | 'array' | 'null' | 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'function' | 'asyncfunction' | 'promise' | 'iterable'

export const TObject: Type = 'object'
export const TArray: Type = 'array'
export const TNull: Type = 'null'
export const TString: Type = 'string'
export const TNumber: Type = 'number'
export const TBigInt: Type = 'bigint'
export const TBoolean: Type = 'boolean'
export const TSymbol: Type = 'symbol'
export const TUndefined: Type = 'undefined'
export const TFunction: Type = 'function'
export const TAsyncFunction: Type = 'asyncfunction'
export const TPromise: Type = 'promise'
export const TIterable: Type = 'iterable'

export function supportedTypes (): Type[] {
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
