import { Type } from './types'

/** @category Custom */
export type CustomType<T> = T

/** @hidden */
const customTypeChecks = new Map<CustomType<string>, (value: any) => CustomType<string>>()
/** @hidden */
const customTypeRoots = new Map<Type, Set<CustomType<string>>>()
/**
 * @default false
 * @hidden
 */
let ENABLE_CUSTOM_TYPES = false

/** Get the status or set custom types to enabled/disabled.
 * @category Custom Type
 */
export function enableCustomTypes (enable?: boolean) {
  if (typeof enable === 'undefined') return ENABLE_CUSTOM_TYPES

  return (ENABLE_CUSTOM_TYPES = enable)
}

/** Add a custom type globally to be used with the `typeOf` method.
 * Automatically sets custom types to enabled.
 * @category Custom Type
 */
export function addCustomType<T, Param> (
  rootType: Type,
  customType: CustomType<T>,
  typeCheck: (value: Param) => CustomType<T>
) {
  enableCustomTypes(true)
  customTypeChecks.set(customType as CustomType<any>, typeCheck as any)

  let customTypes = customTypeRoots.get(rootType)

  if (!customTypes) {
    customTypes = new Set<CustomType<string>>()
  }

  customTypes.add(customType as CustomType<any>)
  customTypeRoots.set(rootType, customTypes)
}

/** Get the custom types associated with a given built-in type.
 * @category Custom Type
 */
export function getCustomTypes (rootType: Type) {
  const customTypeMap = new Map<CustomType<string>, (value: any) => CustomType<string>>()
  const customTypes = customTypeRoots.get(rootType)

  if (customTypes) {
    for (const customType of customTypes) {
      customTypeMap.set(customType, customTypeChecks.get(customType))
    }
  }

  return customTypeMap
}

/** Set the custom types associated with a given built-in type.
 * Automatically sets custom types to enabled.
 * @category Custom Type
 */
export function setCustomTypes (
  rootType: Type,
  customTypes:
    | Array<[CustomType<string>, (value: any) => CustomType<string>]>
    | Map<CustomType<string>, (value: any) => CustomType<string>>
) {
  const entries = Array.isArray(customTypes) ? customTypes : customTypes.entries()

  for (const [customType, typeCheck] of entries) {
    addCustomType(rootType, customType, typeCheck)
  }
}
