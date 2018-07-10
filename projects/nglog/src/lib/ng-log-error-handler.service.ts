import {ErrorHandler, Injectable, Injector} from '@angular/core'
import {HttpErrorResponse} from '@angular/common/http'
import {NgLog} from './ng-log.service'

@Injectable()
export class NgLogErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(error: Error | HttpErrorResponse) {
    const nglog = this.injector.get(NgLog)

    nglog.error(error)
  }
}

