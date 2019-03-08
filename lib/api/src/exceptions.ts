import { Exception } from '@exteranto/core'

export class EmptyResponseException extends Exception {
  //
}

export class NotImplementedException extends Exception {

  /**
   * @param args The exception arguments
   */
  constructor (...args: string[]) {
    super(args.join(','))
  }

}

export class InvalidUrlFormatException extends Exception {
  //
}
