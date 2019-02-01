import { AspectContainer } from './AspectContainer'

/**
 * The @After annotation for the aspect method.
 *
 * @param pointcut The name of the pointcut to assign the aspect to
 */
export function After (pointcut: string) : (target: any, method: string) => void {
  return (target: any, method: string) : void => {
    AspectContainer.bind(pointcut, 'after', target, method)
  }
}

/**
 * The @Before annotation for the aspect method.
 *
 * @param pointcut The name of the pointcut to assign the aspect to
 */
export function Before (pointcut: string) : (target: any, method: string) => void {
  return (target: any, method: string) : void => {
    AspectContainer.bind(pointcut, 'before', target, method)
  }
}

/**
 * The @Pointcut annotation. Creates a pointcut at provided method.
 *
 * @param pointcut The name of the pointcut to assign the aspect to
 */
export function Pointcut (pointcut: string) : (target: any, method: string, descriptor: any) => void {
  return (target: any, method: string, descriptor: any) : void => {
    descriptor.value = new Proxy(target[method], {
      apply: (callable, scope, args) => {
        AspectContainer.before(pointcut, args)

        Reflect.apply(callable, scope, args)

        AspectContainer.after(pointcut, args)
      },
    })

    return descriptor
  }
}
