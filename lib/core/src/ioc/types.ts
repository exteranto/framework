
/**
 * Custom constructor types.
 */

export interface Class<T> extends Abstract<T> {

  /**
   * A constructor type.
   */
  new (...args: any[]) : T

}

export interface Abstract<T> {

  /**
   * The abstract type must have a prototype on it.
   */
  prototype: T

  /**
   * The name of the type.
   */
  name: string

}

/**
 * Annotation types.
 */

export type PropertyAnnotation<T> = (target: T, property: string) => void

/**
 * Type interfaces.
 */

export interface InjectOptions<T> {

  /**
   * The abstract type.
   */
  type?: Abstract<T>

  /**
   * The arguments to be passed to the dependency constructor.
   */
  args?: any[]

  /**
   * The tags to resolve by.
   */
  tags?: { [key: string]: string }

  /**
   * Whether to inject as an optional.
   */
  optional?: boolean,

}
