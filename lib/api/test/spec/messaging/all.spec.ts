import generate from '../../utils/generate'
import { mock, instance, when, deepEqual, verify } from 'ts-mockito'

import chrome from './chrome'
import extensions from './extensions'
import safari from './safari'

import { Dispatcher } from '@exteranto/core'
import { Message } from '@internal/messaging'
import { Messaging as ChromeMessaging } from '@internal/messaging/chrome/Messaging'

describe('Messaging', () => {
  it('dispatches an appropriate event', () => {
    const messaging = new ChromeMessaging
    const dispatcher = mock(Dispatcher)

    ;(messaging as any).dispatcher = instance(dispatcher)

    when(dispatcher.type('TestMessage')).thenReturn(TestMessage)

    ;(messaging as any).dispatch('TestMessage', 'hello', 1, null)

    let message = new TestMessage('hello')

    message.context = 1
    message.respond = null

    verify(dispatcher.fire(deepEqual(message))).once()
  })

  generate({ chrome, extensions, safari })
})

class TestMessage extends Message {
  //
}
