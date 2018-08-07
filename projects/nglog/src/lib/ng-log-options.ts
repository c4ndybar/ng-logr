import {NgLogLevel} from './ng-log-level'
import {InjectionToken} from '@angular/core'
import {defaultNgLogHandlerOptions, NgLogHandler, INgLogHandlerOptions} from './log-handlers/ng-log-handler'
import {ConsoleLogHandler} from './log-handlers/console-log-handler'

export interface INgLogOptions extends INgLogHandlerOptions {
  logHandlers?: NgLogHandler[]
}

export const defaultNgLogOptions: INgLogOptions = Object.assign(
  {
    logHandlers: [new ConsoleLogHandler()]
  },
  defaultNgLogHandlerOptions)

export const NgLogOptions = new InjectionToken<INgLogOptions>('INgLogOptions injection token')
