import {ErrorHandler, NgModule} from '@angular/core'
import {NgLogErrorHandler} from './services/ng-log-error-handler.service'
import {NgLogOptions} from './ng-log-options'
import {defaultNgLogOptions} from './ng-log-options'

@NgModule({
  imports: [],
  providers: [
    {
      provide: ErrorHandler,
      useClass: NgLogErrorHandler,
    },
    {provide: NgLogOptions, useValue: defaultNgLogOptions}
  ],
})
export class NgLogModule {
}
