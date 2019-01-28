import { None } from './None'
import { Optional } from './Optional'

export class Some<T> implements Optional<T> {

  /**
   * @param value The value to be wrapped in the option
   */
  constructor (private value: T) {
    //
  }

  /**
   * @inheritdoc
   */
  public unwrap () : T {
    return this.value
  }

  /**
   * @inheritdoc
   */
  public isSome () : boolean {
    return true
  }

  /**
   * @inheritdoc
   */
  public isNone () : boolean {
    return false
  }

  /**
   * @inheritdoc
   */
  public filter (predicate: (t: T) => boolean) : Optional<T> {
    return predicate(this.value) ? this : new None()
  }

  /**
   * @inheritdoc
   */
  public map<U, V> (u: Optional<U>, predicate: (t: T, u: U) => Optional<V>) : Optional<V> {
    if (u.isNone()) {
      return new None()
    }

    return predicate(this.value, u.unwrap())
  }

  /**
   * @inheritdoc
   */
  public expect () : T {
    return this.value
  }

  /**
   * @inheritdoc
   */
  public unwrapOr () : T {
    return this.value
  }

  /**
   * @inheritdoc
   */
  public unwrapOrElse () : T {
    return this.value
  }

  /**
   * @inheritdoc
   */
  public match<U> (some: (t: T) => U) : U {
    return some(this.value)
  }

}
