
export class AspectContainer {
  /**
   * All aspect are stored in this container.
   *
   * @var {any}
   */
  private static aspects: any = {}

  /**
   * Bind an aspect to provided method on an aspect class.
   *
   * @param {string} pointcut
   * @param {string} when
   * @param {any} target
   * @param {string} method
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
   * @param {string} pointcut
   * @param {any[]} payload
   */
  public static before (pointcut: string, payload: any[]) : void {
    if (this.aspects[pointcut] && this.aspects[pointcut].before) {
      this.fire(this.aspects[pointcut].before, payload)
    }
  }

  /**
   * Fire the after aspects for the provided pointcut.
   *
   * @param {string} pointcut
   * @param {any[]} payload
   */
  public static after (pointcut: string, payload: any[]) : void {
    if (this.aspects[pointcut] && this.aspects[pointcut].after) {
      this.fire(this.aspects[pointcut].after, payload)
    }
  }

  /**
   * Fire the all passed aspects with the payload.
   *
   * @param {any[]} aspects
   * @param {any[]} payload
   */
  private static fire (aspects: any[], payload: any[]) : void {
    aspects.forEach((aspect) => {
      aspect.target[aspect.method](payload)
    })
  }
}
