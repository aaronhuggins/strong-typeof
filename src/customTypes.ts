/** @internal Custom Types are internal */

import { Type } from './types'

export type CustomType<T> = T

const customTypeChecks = new Map<CustomType<string>, (value: any) => CustomType<string>>()
const customTypeRoots = new Map<Type, CustomType<string>[]>()
/** @default false */
let ENABLE_CUSTOM_TYPES = false

/** Get the status or set custom types to enabled/disabled. */
export function enableCustomTypes (enable?: boolean) {
  if (typeof enable === 'undefined') return ENABLE_CUSTOM_TYPES

  return (ENABLE_CUSTOM_TYPES = enable)
}

/** Add a custom type globally to be used with the `typeOf` method. */
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

/** Get the custom types associated with a given built-in type. */
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
