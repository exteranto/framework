import { Exception } from '@internal/Exception'

export class IocException extends Exception {
  //
}

export class DependencyNotFoundException extends IocException {

  /**
   * @param name The dependency name
   */
  constructor (name: string) {
    super(`The dependency [${name}] was not found in the container.`)
  }

}

export class MoreDependenciesMatchedException extends IocException {

  /**
   * @param name The dependency name
   */
  constructor (name: string) {
    super(`The abstract [${name}] has more than one fitting concretes bound. Consider tagging the concretes.`)
  }

}

export class ParameterNotFoundException extends IocException {

  /**
   * @param name The parameter name
   */
  constructor (name: string) {
    super(`The parameter [${name}] was not found in the container.`)
  }

}
