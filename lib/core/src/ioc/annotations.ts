import 'reflect-metadata'
import { Container } from './Container'
import { Abstract, InjectOptions, PropertyAnnotation } from './types'

/**
 * The @Inject annotation. Inject a dependency from the container to the
 * provided property.
 */
export function Inject<T> (options: InjectOptions<T> = {}) : PropertyAnnotation<any> {
  return (target: any, property: string) : void => {
    const type: Abstract<T> = options.type || Reflect.getMetadata('design:type', target, property)
    const resolveVia: string = options.optional ? 'resolveOptional' : 'resolve'
    const key: string = `__${property}`

    Object.defineProperty(target, property, {
      get () : T {
        return target[key] === undefined
          ? target[key] = Container.getInstance()[resolveVia](type, options.args)
          : target[key]
      },

      set (value: T) : void {
        target[key] = value
      },
    })
  }
}

/**
 * The @Autowired annotation. Automatically resolves a dependency from the
 * container when assigned to a class property.
 */
export function Autowired<T> (target: any, property: string) : void {
  Inject<T>()(target, property)
}

/**
 * The @Optionally annotation. Resolves a dependency from the container as an
 * optional, if not present, returns None.
 */
export function Optionally<T> (type: Abstract<T>) : PropertyAnnotation<any> {
  return Inject<T>({ type, optional: true })
}

/**
 * The @WiredWith annotation. Automatically resolves a dependency from the
 * container when assigned to a class property while injecting given properties
 * to the constructor.
 *
 * @param args Constructor arguments to be provided
 */
export function With<T> (args: any[]) : PropertyAnnotation<any> {
  return Inject<T>({ args })
}

/**
 * The @WiredWith annotation. Automatically resolves a dependency from the
 * container when assigned to a class property while injecting given properties
 * to the constructor.
 *
 * @param name The tag name
 * @param value The tag value
 */
export function Tagged<T> (name: string, value: string) : PropertyAnnotation<any> {
  return Inject<T>()
}

/**
 * The @Binding annotation. Registers a non-singleton dependency in the
 * container.
 *
 * @param Constructor The type constructor to be bound to the container
 */
export function Binding (Constructor: any) : any {
  //
}

/**
 * The @Param annotation. Automatically resolves a param from the container if
 * assigned to a class property.
 *
 * @param param The parameter key to be resolved
 */
export function Param (param: string) : (target: any, property: string) => void {
  return (target: any, property: string) : void => {
    //
  }
}

/**
 * The @Singleton annotation. Registers a singleton dependency in the container.
 *
 * @param Constructor The type constructor to be bound to the container
 */
export function Singleton (Constructor: any) : any {
  //
}
