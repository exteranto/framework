import 'reflect-metadata'
import { Container } from './Container'

import {
  Class,
  Abstract,
  InjectOptions,
  PropertyAnnotation,
} from './types'

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
          ? target[key] = Container.getInstance()[resolveVia](type, options.args, options.tags)
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
export function Autowired<T> () : PropertyAnnotation<any> {
  return (target: any, property: string) : void => {
    Inject<T>()(target, property)
  }
}

/**
 * The @Optionally annotation. Resolves a dependency from the container as an
 * optional, if not present, returns None.
 */
export function Optionally<T> (type: Abstract<T>) : PropertyAnnotation<any> {
  return Inject<T>({ type, optional: true })
}

/**
 * The @With annotation. Automatically resolves a dependency from the
 * container when assigned to a class property while injecting given properties
 * to the constructor.
 *
 * @param args Constructor arguments to be provided
 */
export function With<T> (args: any[]) : PropertyAnnotation<any> {
  return Inject<T>({ args })
}

/**
 * The @Tagged annotation. Resolves a dependency based on a tag assigned to it.
 *
 * @param name The tag name
 * @param value The tag value
 */
export function Tagged<T> (tags: { [key: string]: string }) : PropertyAnnotation<any> {
  return Inject<T>({ tags })
}

/**
 * The @Self annotation. Assigns a container instance to the property.
 */
export function Self () : PropertyAnnotation<any> {
  return (target: any, property: string) : void => {
    Object.defineProperty(target, property, {
      get () : Container {
        return target.__container === undefined
          ? target.__container = Container.getInstance()
          : target.__container
      },

      set (value: Container) : void {
        target.__container = value
      },
    })
  }
}

/**
 * The @Param annotation. Automatically resolves a param from the container if
 * assigned to a class property.
 *
 * @param param The parameter key to be resolved
 */
export function Param<T> (name: string) : PropertyAnnotation<any> {
  return (target: any, property: string) : void => {
    const key: string = `__${property}`

    Object.defineProperty(target, property, {
      get () : T {
        return target[key] === undefined
          ? target[key] = Container.getInstance().resolveParam(name)
          : target[key]
      },

      set (value: T) : void {
        target[key] = value
      },
    })
  }
}

/**
 * The @Binding annotation. Registers a non-singleton dependency in the
 * container.
 *
 * @param Constructor The type constructor to be bound to the container
 */
export function Binding<T> (Constructor: Class<T>) : Class<T> {
  Container.getInstance().bind<T>(Constructor).toSelf()

  return Constructor
}

/**
 * The @Singleton annotation. Registers a singleton dependency in the container.
 *
 * @param Constructor The type constructor to be bound to the container
 */
export function Singleton<T> (Constructor: Class<T>) : Class<T> {
   Container.getInstance().bind<T>(Constructor).toSelf().asSingleton()

   return Constructor
}
