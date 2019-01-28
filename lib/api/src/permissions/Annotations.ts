import { Permission } from './Permission'
import { Container } from '@exteranto/core'
import { PermissionManager } from './PermissionManager'

/**
 * The @HasAccessTo annotation resolves if an extension
 * has permissions to access certain APIs.
 *
 * @param needle Single or array of permissions
 * @return Function that returns a proxy
 */
export function HasAccessTo (needle: Permission|Permission[]) : any {
  return (target, method, descriptor) => {
    descriptor.value = new Proxy(target[method], {
      /**
       * @throws {PermissionNotGrantedException}
       */
      apply: async (callable, scope, args) => {
        await Container.resolve(PermissionManager).assume(needle)

        return Reflect.apply(callable, scope, args)
      },
    })

    return descriptor
  }
}
