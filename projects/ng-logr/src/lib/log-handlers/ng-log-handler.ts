import {NgLogLevel} from '../ng-log-level'

export interface INgLogHandlerOptions {
  logLevel?: NgLogLevel
}

export const defaultNgLogHandlerOptions: INgLogHandlerOptions = {
  logLevel: NgLogLevel.debug,
}

export abstract class NgLogHandler {
  logLevel?: NgLogLevel

  constructor(options: INgLogHandlerOptions = {}) {
    Object.assign(<any>this, options)
  }

  abstract async handleLog(logLevel: NgLogLevel, ...logParams: any[])
}
