import {Inject, Injectable} from '@angular/core'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from './ng-log-options'
import {defaultNgLogHandlerOptions, INgLogHandler} from './log-handlers/ng-log-handler'

export interface INgLog {
  debug(message?: any, ...params: any[]): void

  info(message?: any, ...params: any[]): void

  log(message?: any, ...params: any[]): void

  warn(message?: any, ...params: any[]): void

  error(message?: any, ...params: any[]): void
}

@Injectable({providedIn: 'root'})
export class NgLog implements INgLog {
  private readonly logHandlers: INgLogHandler[]

  constructor(@Inject(NgLogOptions) options: INgLogOptions) {
    options = Object.assign({}, defaultNgLogOptions, options)

    this.logHandlers = options.logHandlers

    for (const handler of this.logHandlers) {
      Object.assign(handler, defaultNgLogHandlerOptions, {...handler})
    }
  }

  debug(message?: any, ...params: any[]): void {
    this.logHandlers.forEach((handler) => {
      handler.debug(message, ...params)
    })
  }

  info(message?: any, ...params: any[]): void {
    this.logHandlers.forEach((handler) => {
      handler.info(message, ...params)
    })
  }

  log(message?: any, ...params: any[]): void {
    this.logHandlers.forEach((handler) => {
      handler.log(message, ...params)
    })
  }

  warn(message?: any, ...params: any[]): void {
    this.logHandlers.forEach((handler) => {
      handler.warn(message, ...params)
    })
  }

  error(message?: any, ...params: any[]) {
    this.logHandlers.forEach((handler) => {
      handler.error(message, ...params)
    })
  }
}
