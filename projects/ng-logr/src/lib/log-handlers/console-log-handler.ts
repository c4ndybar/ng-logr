import {NgLogLevel} from '../ng-log-level'
import {NgLogHandler} from './ng-log-handler'

export class ConsoleLogHandler extends NgLogHandler {

  handleLog(logLevel: NgLogLevel, ...logParams: any[]) {
    const logLevelName = NgLogLevel[logLevel]

    console[logLevelName](...logParams)
  }
}
