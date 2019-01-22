
export interface Optional<T> {

  /**
   * Unwraps the value or throws an exception.
   *
   * @return {T}
   */
  unwrap () : T

  /**
   * Whether the option wraps value.
   *
   * @return {boolean}
   */
  isSome () : boolean

  /**
   * Whether the option has no value.
   *
   * @return {boolean}
   */
  isNone () : boolean

  /**
   * Returns None if the option is None,
   * otherwise calls predicate with the wrapped value and returns:
   * - Some(t) if predicate returns true (where t is the wrapped value)
   * - None if predicate returns false
   *
   * @param {(t: T) => boolean} predicate
   * @return {Optional}
   */
  filter (predicate: (t: T) => boolean) : Optional<T>

  /**
   * If the option is Some, unwrap it.
   * Otherwise throw an error.
   *
   * @param {any} e
   * @return {T}
   */
  expect (e: any) : T

  /**
   * If the option is Some, returns the value,
   * otherwise return the default.
   *
   * @param {any} def
   * @return {any}
   */
  unwrapOr (def: any) : any

  /**
   * If the option is Some, returns the value,
   * otherwise computes the closure and returns the result.
   *
   * @param {any} def
   * @return {any}
   */
  unwrapOrElse (closure: () => any) : any

}
