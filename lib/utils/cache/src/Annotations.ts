import { Container } from '@exteranto/ioc'
import { Cache } from './Cache'

/**
 * The @Cached annotation. Automatically caches a method return value.
 *
 * @param {any} params
 * @return {any}
 */
export function Cached (params: any = {}) : any {
  return (target, method, descriptor) => {
    const cache: Cache = Container.resolve(Cache)

    descriptor.value = new Proxy(target[method], {
      apply: (callable, scope, args) => {
        const timeout: number = resolveTimeout(params.timeout)
        const key: string = `${scope.constructor.name}.${method}.${JSON.stringify(args)}`

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
 * @param {any} timeout
 * @return {number}
 */
function resolveTimeout (timeout: any) : number {
  if (!timeout || typeof timeout === 'number') {
    return timeout
  }

  const matches: any[] = timeout.match(/%([\w.-]+)%/)

  return matches === null ? timeout : Container.resolveParam(matches[1])
}
