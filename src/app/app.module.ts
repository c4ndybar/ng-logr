import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import {NgLogOptions, INgLogOptions, NgLogLevel, NgLogModule} from 'nglog'

const options: INgLogOptions = {
  logLevel: NgLogLevel.debug
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
export class AppModule { }
