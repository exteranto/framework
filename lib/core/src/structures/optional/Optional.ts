
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
   * Maps this optional to the other one.
   * If either option is None, returns none as well.
   *
   * @param {Optional<any>} u
   * @param {(t: T, u: any) => Optional<any>} predicate
   */
  map (u: Optional<any>, predicate: (t: T, u: any) => Optional<any>) : Optional<any>

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
   * @param {T} def
   * @return {T}
   */
  unwrapOr (def: T) : T

  /**
   * If the option is Some, returns the value,
   * otherwise computes the closure and returns the result.
   *
   * @param {T} def
   * @return {T}
   */
  unwrapOrElse (closure: () => T) : T

  /**
   * If option is None, matches second callback,
   * otherwise passes option value to the first callback.
   *
   * @param {(t: T) => any} some
   * @param {none?: () => any} none
   * @return {any}
   */
  match (some: (t: T) => any, none?: () => any) : any

}
