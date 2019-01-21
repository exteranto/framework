import { Container } from '@internal/ioc'
import { Event } from './Event'
import { Dispatcher } from './Dispatcher'

/**
 * The @Listen annotation. Create a hook for a specified event.
 *
 * @param {any} event
 * @return {(target: any, method: string) => void}
 */
export function Listen (event: any) : (target: any, method: string) => void {
  return (target: any, method: string) : void => {
    const dispatcher: Dispatcher = Container.resolve(Dispatcher)

    dispatcher.touch(event).addHook((payload: Event) => {
      return target[method](payload)
    })
  }
}
