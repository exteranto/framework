import { None } from './None'
import { Optional } from './Optional'

export class Some<T> implements Optional<T> {

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
  public map (u: Optional<any>, predicate: (t: T, u: any) => Optional<any>) : Optional<any> {
    if (u.isNone()) {
      return new None()
    }

    return predicate(this.value, u.unwrap())
  }

  /**
   * @inheritdoc
   */
  public expect (_: any) : T {
    return this.value
  }

  /**
   * @inheritdoc
   */
  public unwrapOr (_: any) : any {
    return this.value
  }

  /**
   * @inheritdoc
   */
  public unwrapOrElse (_: () => any) : any {
    return this.value
  }

  /**
   * @constructor
   *
   * @param {T} value
   */
  constructor (private value: T) {
    //
  }

}
