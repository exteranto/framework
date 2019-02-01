import 'reflect-metadata'
import { Container } from './Container'

/**
 * The @Autowired annotation. Automatically resolves a dependency from the
 * container when assigned to a class property.
 */
export function Autowired (target: any, property: string) : void {
  const type: any = Reflect.getMetadata('design:type', target, property)

  inject(target, property, 'resolve', [type])
}

/**
 * The @Binding annotation. Registers a non-singleton dependency in the
 * container.
 *
 * @param Constructor The type constructor to be bound to the container
 */
export function Binding (Constructor: any) : any {
  Container.bind(Constructor).toSelf()

  return Constructor
}

/**
 * The @Param annotation. Automatically resolves a param from the container if
 * assigned to a class property.
 *
 * @param param The parameter key to be resolved
 */
export function Param (param: string) : (target: any, property: string) => void {
  return (target: any, property: string) : void => {
    inject(target, property, 'resolveParam', [param])
  }
}

/**
 * The @Singleton annotation. Registers a singleton dependency in the container.
 *
 * @param Constructor The type constructor to be bound to the container
 */
export function Singleton (Constructor: any) : any {
  Container.bind(Constructor).toSelf().singleton(true)

  return Constructor
}

/**
 * The @WiredWith annotation. Automatically resolves a dependency from the
 * container when assigned to a class property while injecting given properties
 * to the constructor.
 *
 * @param args Constructor arguments to be provided
 */
export function WiredWith (args: any[]) : (target: any, property: any) => void {
  return (target: any, property: string) : void => {
    const type: any = Reflect.getMetadata('design:type', target, property)

    inject(target, property, 'resolve', [type, args])
  }
}

/**
 * Inject a value to a property using the container.
 *
 * @param target The target scope
 * @param property The property name
 * @param method The container method to be used
 * @param args The container method arguments
 */
function inject (target: any, property: any, method: any, args: any[]) : void {
  const key: string = `__${property}`

  Object.defineProperty(target, property, {
    get () : any {
      return target[key] === undefined ? target[key] = Container[method](...args) : target[key]
    },

    set (value: any) : void {
      target[key] = value
    },
  })
}
