import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {AppComponent} from './app.component'
import {ConsoleLogHandler, INgLogOptions, NgLogLevel, NgLogModule, NgLogOptions} from 'nglog'
import {HttpLogHandler} from 'nglog'

const options: INgLogOptions = {
  logLevel: NgLogLevel.debug,
  logHandlers: [
    new ConsoleLogHandler(),
    new HttpLogHandler({logLevel: NgLogLevel.error, httpPostRoute: 'http://localhost:4201/logError'})
  ]
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgLogModule,
  ],
  providers: [{provide: NgLogOptions, useValue: options}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
