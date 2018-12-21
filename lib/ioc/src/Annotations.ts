import 'reflect-metadata'
import { Container } from './Container'

/**
 * The @Autowired annotation. Automatically resolves a dependency from the
 * container when assigned to a class property.
 *
 * @param {any} target
 * @param {string} property
 */
export function Autowired (target: any, property: string) : void {
  const type: any = Reflect.getMetadata('design:type', target, property)

  inject(target, property, 'resolve', [type])
}

/**
 * The @Binding annotation. Registers a non-singleton dependency in the
 * container.
 *
 * @param {any} Constructor
 * @return {any}
 */
export function Binding (Constructor: any) : any {
  Container.bind(Constructor).toSelf()

  return Constructor
}

/**
 * The @Param annotation. Automatically resolves a param from the container if
 * assigned to a class property.
 *
 * @param {string} param
 * @return {(target: any, property: string) => void}
 */
export function Param (param: string) : (target: any, property: string) => void {
  return (target: any, property: string) : void => {
    inject(target, property, 'resolveParam', [param])
  }
}

/**
 * The @Singleton annotation. Registers a singleton dependency in the container.
 *
 * @param {any} Constructor
 * @return {any}
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
 * @param {any[]} args
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
 * @param {any} target
 * @param {any} property
 * @param {any} method
 * @param {any[]} args
 */
function inject (target: any, property: any, method: any, args: any[]) : void {
  const key: string = `__${property}`

  Object.defineProperty(target, property, {
    get () : any {
      return target[key] ? target[key] : target[key] = Container[method](...args)
    },

    set (value: any) : void {
      target[key] = value
    },
  })
}
