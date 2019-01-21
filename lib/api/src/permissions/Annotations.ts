import { Container } from '@exteranto/core'
import { PermissionManager } from './PermissionManager'

/**
 * The @HasAccessTo annotation resolves if an extension
 * has permissions to access certain APIs.
 *
 * @param {string[]|string} permissions
 */
export function HasAccessTo (permissions: string[]|string) : any {
  return (target, method, descriptor) => {
    descriptor.value = new Proxy(target[method], {
      /**
       * @throws {PermissionNotGrantedException}
       * @return {Promise<any>}
       */
      apply: async (callable, scope, args) => {
        await Container.resolve(PermissionManager).assume(permissions)

        return Reflect.apply(callable, scope, args)
      },
    })

    return descriptor
  }
}
