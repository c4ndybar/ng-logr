import {NgLogLevel} from './ng-log-level'
import {InjectionToken} from '@angular/core'
import {defaultNgLogHandlerOptions, INgLogHandler, INgLogHandlerOptions} from './log-handlers/ng-log-handler'
import {ConsoleLogHandler} from './log-handlers/console-log-handler'

export interface INgLogOptions extends INgLogHandlerOptions {
  logHandlers?: INgLogHandler[]
}

export const defaultNgLogOptions: INgLogOptions = Object.assign(
  {
    logHandlers: [new ConsoleLogHandler()]
  },
  defaultNgLogHandlerOptions)

export const NgLogOptions = new InjectionToken<INgLogOptions>('INgLogOptions injection token')
