import {INgLogHandler} from './ng-log-handler'
import {NgLogLevel} from '../ng-log-level'
import {INgLogOptions} from '../ng-log-options'

export class ConsoleLogHandler implements INgLogHandler {
  logLevel?: NgLogLevel

  constructor(options: INgLogOptions = {}) {
    Object.assign(<ConsoleLogHandler>this, options)
  }

  debug(message?: any, ...params: any[]): void {
    if (this.logLevel === NgLogLevel.debug) {
      console.debug(message, ...params)
    }
  }

  info(message?: any, ...params: any[]): void {
    if (this.logLevel <= NgLogLevel.info) {
      console.info(message, ...params)
    }
  }

  log(message?: any, ...params: any[]): void {
    if (this.logLevel <= NgLogLevel.log) {
      console.log(message, ...params)
    }
  }

  warn(message?: any, ...params: any[]): void {
    if (this.logLevel <= NgLogLevel.warn) {
      console.warn(message, ...params)
    }
  }

  error(message?: any, ...params: any[]) {
    console.error(message, ...params)
  }
}
