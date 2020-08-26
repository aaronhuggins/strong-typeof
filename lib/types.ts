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
export type CustomType<T> = T

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

let ENABLE_CUSTOM_TYPES = false

export function enableCustomTypes (enable?: boolean) {
  if (typeof enable === 'undefined') return ENABLE_CUSTOM_TYPES

  return (ENABLE_CUSTOM_TYPES = enable)
}

export const customTypeChecks = new Map<CustomType<string>, (value: any) => CustomType<string>>()
export const customTypeRoots = new Map<Type, CustomType<string>[]>()

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

export function addCustomType<T, Param> (
  rootType: Type,
  customType: CustomType<T>,
  typeCheck: (value: Param) => CustomType<T>
) {
  enableCustomTypes(true)
  customTypeChecks.set(customType as CustomType<any>, typeCheck as any)

  let customTypes = customTypeRoots.get(rootType)

  if (!Array.isArray(customTypes)) {
    customTypes = []
  }

  customTypes.push(customType as CustomType<any>)
  customTypeRoots.set(rootType, customTypes)
}

export function getCustomTypes (rootType: Type) {
  const customTypeMap = new Map<CustomType<string>, (value: any) => CustomType<string>>()
  const customTypes = customTypeRoots.get(rootType)

  if (Array.isArray(customTypes)) {
    for (const customType of customTypes) {
      customTypeMap.set(customType, customTypeChecks.get(customType))
    }
  }

  return customTypeMap
}
