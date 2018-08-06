import {INgLogHandler, INgLogHandlerOptions} from './ng-log-handler'
import {NgLogLevel} from '../ng-log-level'

export class ConsoleLogHandler implements INgLogHandler {
  logLevel?: NgLogLevel

  constructor(options: INgLogHandlerOptions = {}) {
    Object.assign(<ConsoleLogHandler>this, options)
  }

  handleLog(logLevel: NgLogLevel, ...logParams: any[]) {
    if (this.logLevel <= logLevel) {
      const logLevelName = NgLogLevel[logLevel]

      console[logLevelName](...logParams)
    }
  }
}
