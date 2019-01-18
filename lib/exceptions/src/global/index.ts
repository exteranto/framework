
export class Exception extends Error {
  //
}

export class EmptyResponseException extends Error {
  //
}

export class NotImplementedException extends Error {
  constructor (...args: string[]) {
    super(args.join(','))
  }
}

export class InvalidUrlFormatException extends Error {
  //
}
