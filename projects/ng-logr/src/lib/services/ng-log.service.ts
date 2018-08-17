import {Inject, Injectable} from '@angular/core'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from '../ng-log-options'
import {NgLogHandler} from '../log-handlers/ng-log-handler'
import {NgLogLevel} from '../ng-log-level'

@Injectable({providedIn: 'root'})
export class NgLog {
  private readonly logHandlers: NgLogHandler[]

  constructor(@Inject(NgLogOptions) options: INgLogOptions) {
    options = Object.assign({}, defaultNgLogOptions, options)

    this.logHandlers = options.logHandlers

    for (const handler of this.logHandlers) {
      Object.assign(handler, options, {...handler})
    }
  }

  async debug(message?: any, ...params: any[]): Promise<void> {
    return this.handleLog(NgLogLevel.debug, message, ...params)
  }

  async info(message?: any, ...params: any[]): Promise<void> {
    return this.handleLog(NgLogLevel.info, message, ...params)
  }

  async log(message?: any, ...params: any[]): Promise<void> {
    return this.handleLog(NgLogLevel.log, message, ...params)
  }

  async warn(message?: any, ...params: any[]): Promise<void> {
    return this.handleLog(NgLogLevel.warn, message, ...params)
  }

  async error(message?: any, ...params: any[]): Promise<void> {
    return this.handleLog(NgLogLevel.error, message, ...params)
  }

  private handleLog(level: NgLogLevel, ...params) {
    this.logHandlers.forEach((handler) => {
      if (handler.logLevel <= level) {
        handler.handleLog(level, ...params)
      }
    })
  }
}
