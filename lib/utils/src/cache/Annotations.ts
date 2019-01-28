import { Container } from '@exteranto/core'
import { Cache } from './Cache'

/**
 * The @Cached annotation. Automatically caches a method return value. Note that
 * any annotated method is automatically transformed to have a return type of
 * Promise<T>.
 *
 * @param params The parameters for the annotation, accepts 'key' and 'timeout' keys
 */
export function Cached (params: any = {}) : any {
  return (target, method, descriptor) => {
    const cache: Cache = Container.resolve(Cache)

    descriptor.value = new Proxy(target[method], {
      apply: (callable, scope, args) => {
        const timeout: number = resolveTimeout(params.timeout)
        const key: string = params.key || `${scope.constructor.name}.${method}.${JSON.stringify(args)}`

        return cache.store(key, () => {
          return Reflect.apply(callable, scope, args)
        }, timeout)
      },
    })

    return descriptor
  }
}

/**
 * Resolves cache timeout from the params object.
 *
 * @param timeout Timeout format to be resolved
 * @return The timeout in seconds
 */
function resolveTimeout (timeout: any) : number {
  if (!timeout || typeof timeout === 'number') {
    return timeout
  }

  const matches: any[] = timeout.match(/%([\w.-]+)%/)

  return matches === null ? timeout : Container.resolveParam(matches[1])
}
