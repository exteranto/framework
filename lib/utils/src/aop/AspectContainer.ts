
export class AspectContainer {

  /**
   * All aspects are stored in this container.
   */
  private static aspects: any = {}

  /**
   * Bind an aspect to provided method on an aspect class.
   *
   * @param pointcut The pointcut name
   * @param when Either 'before' or 'after'
   * @param target The target scope to assign the aspect too
   * @param method The method name to wrap
   */
  public static bind (
    pointcut: string,
    when: string,
    target: any,
    method: string,
  ) : void {
    if (this.aspects[pointcut] === undefined) {
      this.aspects[pointcut] = {}
    }

    this.aspects[pointcut][when] === undefined
      ? this.aspects[pointcut][when] = [{ target, method }]
      : this.aspects[pointcut][when].push({ target, method })
  }

  /**
   * Fire the before aspects for the provided pointcut.
   *
   * @param pointcut The pointcut name
   * @param payload The arguments to be passed to the aspect
   */
  public static before (pointcut: string, payload: any[]) : void {
    if (this.aspects[pointcut] && this.aspects[pointcut].before) {
      this.fire(this.aspects[pointcut].before, payload)
    }
  }

  /**
   * Fire the after aspects for the provided pointcut.
   *
   * @param pointcut The pointcut name
   * @param payload The arguments to be passed to the aspect
   */
  public static after (pointcut: string, payload: any[]) : void {
    if (this.aspects[pointcut] && this.aspects[pointcut].after) {
      this.fire(this.aspects[pointcut].after, payload)
    }
  }

  /**
   * Fire the all passed aspects with the payload.
   *
   * @param aspects The array of aspects to be triggered
   * @param payload The arguments to be passed to the aspect
   */
  private static fire (aspects: any[], payload: any[]) : void {
    aspects.forEach((aspect) => {
      aspect.target[aspect.method](payload)
    })
  }

}
