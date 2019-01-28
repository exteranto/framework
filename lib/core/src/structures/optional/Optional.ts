
export interface Optional<T> {

  /**
   * Unwraps the value or throws an exception if the option is None<T>.
   *
   * @return Returns the wrapped value from the option if the option is Some<T>
   * @throws {OptionIsNoneException}
   */
  unwrap () : T

  /**
   * Determines whether the option wraps value.
   *
   * @return Whether the option wraps value
   */
  isSome () : boolean

  /**
   * Determines whether the option has no value.
   *
   * @return Whether the option wraps value
   */
  isNone () : boolean

  /**
   * Returns None<T> if the option is None<T>, otherwise calls predicate with
   * the wrapped value and returns Some<T> if the predicate returns true, or
   * None<T> if the predicate returns false.
   *
   * @param predicate The predicate to decide based on
   * @return Either Some<T> or None<T> based on the predicate
   */
  filter (predicate: (t: T) => boolean) : Optional<T>

  /**
   * Maps this optional to the other one. If either option is None<T>, returns
   * None<T> as well.
   *
   * @param u Another optional to map this instance to
   * @param predicate The predicate that maps the optionals if both are Some<T>
   * @return The mapped optional
   */
  map<U, V> (u: Optional<U>, predicate: (t: T, u: U) => Optional<V>) : Optional<V>

  /**
   * If the option is Some<T>, unwrap it. Otherwise throw the provided error.
   *
   * @param e The error to be thrown
   * @return If the options is Some<T>, return the wrapped value, otherwise throw an error
   * @throws {Error}
   */
  expect (e: Error) : T

  /**
   * If the option is Some<T>, returns the value, otherwise return the default
   * value provided.
   *
   * @param def The default value
   * @return If option is Some<T>, return the value, otherwise return the default value
   */
  unwrapOr (def: T) : T

  /**
   * If the option is Some<T>, returns the wrapped value, otherwise computes the
   * closure and returns the result.
   *
   * @param closure The closure to be evaluated
   * @return The wrapped value if option in Some<T>, otherwise the return value from the provided closure
   */
  unwrapOrElse (closure: () => T) : T

  /**
   * If option is None<T>, matches second callback, otherwise passes option
   * value to the first callback.
   *
   * @param some Callback to be executed if option is Some<T> with the wrapped value as its parameter
   * @param none Optional callback to be executed if option is None<T>
   * @return Return the value matched from the callbacks
   */
  match<U> (some: (t: T) => U, none?: () => U) : U

}
