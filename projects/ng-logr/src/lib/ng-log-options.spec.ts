import {defaultNgLogOptions} from './ng-log-options'
import {NgLogLevel} from './ng-log-level'
import {ConsoleLogHandler} from './log-handlers/console-log-handler'

describe('defaultNgLogHandlerOptions', () => {
  it('defaults log level to debug', () => {
    expect(defaultNgLogOptions.logLevel).toEqual(NgLogLevel.debug)
  })

  it('defaults the handlers to the ConsoleLogHandler', () => {
    expect(defaultNgLogOptions.logHandlers).toContain(jasmine.any(ConsoleLogHandler))
    expect(defaultNgLogOptions.logHandlers.length).toEqual(1)
  })
})
