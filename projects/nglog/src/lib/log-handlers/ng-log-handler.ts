import {NgLogLevel} from '../ng-log-level'

export interface INgLogHandlerOptions {
  logLevel?: NgLogLevel
}

export const defaultNgLogHandlerOptions: INgLogHandlerOptions = {
  logLevel: NgLogLevel.debug,
}

export interface INgLogHandler extends INgLogHandlerOptions {
  handleLog(logLevel: NgLogLevel, ...logParams: any[])
}
