import {Inject, Injectable} from '@angular/core'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from '../ng-log-options'
import {defaultNgLogHandlerOptions, NgLogHandler} from '../log-handlers/ng-log-handler'
import {NgLogLevel} from '../ng-log-level'

@Injectable({providedIn: 'root'})
export class NgLog {
  private readonly logHandlers: NgLogHandler[]

  constructor(@Inject(NgLogOptions) options: INgLogOptions) {
    options = Object.assign({}, defaultNgLogOptions, options)

    this.logHandlers = options.logHandlers

    for (const handler of this.logHandlers) {
      Object.assign(handler, defaultNgLogHandlerOptions, {...handler})
    }
  }

  debug(message?: any, ...params: any[]): void {
    this.handleLog(NgLogLevel.debug, message, ...params)
  }

  info(message?: any, ...params: any[]): void {
    this.handleLog(NgLogLevel.info, message, ...params)
  }

  log(message?: any, ...params: any[]): void {
    this.handleLog(NgLogLevel.log, message, ...params)
  }

  warn(message?: any, ...params: any[]): void {
    this.handleLog(NgLogLevel.warn, message, ...params)
  }

  error(message?: any, ...params: any[]) {
    this.handleLog(NgLogLevel.error, message, ...params)
  }

  private handleLog(level: NgLogLevel, ...params) {
    this.logHandlers.forEach((handler) => {
      if (handler.logLevel <= level) {
        handler.handleLog(level, ...params)
      }
    })
  }
}
