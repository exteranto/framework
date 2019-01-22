import { Optional } from './Optional'
import { OptionIsNoneException } from '@exteranto/exceptions'

export class None<T> implements Optional<T> {

  /**
   * @inheritdoc
   */
  public unwrap () : T {
    throw new OptionIsNoneException()
  }

  /**
   * @inheritdoc
   */
  public isSome () : boolean {
    return false
  }

  /**
   * @inheritdoc
   */
  public isNone () : boolean {
    return true
  }

  /**
   * @inheritdoc
   */
  public filter (_: (t: T) => boolean) : Optional<T> {
    return new None()
  }

  /**
   * @inheritdoc
   */
  public map (_: Optional<any>, _p: (t: T, u: any) => Optional<any>) : Optional<any> {
    return new None()
  }

  /**
   * @inheritdoc
   */
  public expect (e: any) : T {
    throw e
  }

  /**
   * @inheritdoc
   */
  public unwrapOr (def: any) : any {
    return def
  }

  /**
   * @inheritdoc
   */
  public unwrapOrElse (closure: () => any) : any {
    return closure()
  }

}
