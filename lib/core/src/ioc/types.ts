
/**
 * Custom constructor types.
 */

export type Class<T> = new (...args: any[]) => T
export type Abstract<T> = Function & { prototype: T }

/**
 * Annotation types.
 */

export type PropertyAnnotation<T> = (target: T, property: string) => void

/**
 * Type interfaces.
 */

export interface InjectOptions<T> {
  type?: Abstract<T>
  args?: any[]
  optional?: boolean,
}
