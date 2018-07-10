import {ErrorHandler, Injectable, Injector} from '@angular/core'
import {NgLog} from './ng-log.service'

@Injectable()
export class NgLogErrorHandler extends ErrorHandler {
  private nglog: NgLog
  constructor(private injector: Injector) {
    super()
    this.nglog = this.injector.get(NgLog)
  }

  handleError(error: any) {
    error.ngErrorLogger = (console: Console, ...values: any[]) => {
      this.nglog.error(...values)
    }

    super.handleError(error)
  }
}

