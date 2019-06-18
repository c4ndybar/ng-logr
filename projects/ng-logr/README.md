
# Ng-logr

Angular logger that is designed to be simple and configurable.  Ships with the following features.
- Two log handlers are provided.
  - ConsoleLogHandlder (enabled by default) - Prints logs to the console
  - HttpLogHandler - Posts logs to an http endpoint.  Handles circular references and removes Angular debugging objects.
- Uncaught exception handling
  - Provides an exception handler by default that extends Angular's built in ErrorHandler but uses NgLog to log the errors.
- Cascading configuration.
- Ability to provide custom log handlers or extend existing ones.

## Quick Start

#### Install the library

`npm install --save ng-logr`

#### Import `NgLogModule` into your app's root module.
```typescript
import {NgModule} from '@angular/core'
import {NgLogModule} from 'ng-logr'

@NgModule({
  imports: [
    NgLogModule,
  ],
})
export class AppModule {
}
```

#### Use the `NgLog` service in your app to log stuff

```typescript
import {Injectable} from '@angular/core'
import {NgLog} from 'ng-logr'

@Injectable()
export class MyService {

  constructor(nglog: NgLog) { 
    nglog.log('I made a log!')
  }
}
```

#### The NgLog interface is simple and provides only 5 logging methods.

```typescript
interface NgLog {
  debug(message?: any, ...params: any[]): void
  info(message?: any, ...params: any[]): void
  log(message?: any, ...params: any[]): void
  warn(message?: any, ...params: any[]): void
  error(message?: any, ...params: any[]): void
}
```

## Configuration

The default configuration for NgLog is below.  The default global log level is `debug` and the only log handler is the `ConsoleLogHandler`, which logs to the console.

```typescript
{
  logLevel: NgLogLevel.debug,
  logHandlers: [new ConsoleLogHandler()]
}
```

To override the configuration, provide `NgLogOptions` when declaring your root module.

```typescript
import {NgModule} from '@angular/core'
import {INgLogOptions, NgLogLevel, NgLogModule, NgLogOptions,} from 'ng-logr'
import {ConsoleLogHandler} from 'ng-logr'

const options: INgLogOptions = {
  logLevel: NgLogLevel.error,
  logHandlers: [new ConsoleLogHandler()]
}

@NgModule({
  imports: [
    NgLogModule,
  ],
  providers: [{provide: NgLogOptions, useValue: options}]
})

export class AppModule {
}
```

## Use Cases

#### Send logs to the server

Include the `HttpLogHandler` when defining your log handlers in your configuration options.  This log handler posts logs to your sever at the endpoint `/log`.  You can override the log post route by defining the option `httpPostRoute` as shown in the example below.
```typescript
import {ConsoleLogHandler, HttpLogHandler} from 'ng-logr'

const httpHandler = new HttpLogHandler({
  httpPostRoute: 'serverLogRoute'
})
const options: INgLogOptions = {
  logHandlers: [new ConsoleLogHandler(), httpHandler]
}
```
#### Restricing the log level

The default log level for NgLog is `debug`.  You can override this globally by providing the option `logLevel` in the `NgLogOptions`.  You can also provide the `logLevel` option to a handler to override the log level for that particular handler.
```typescript
import {ConsoleLogHandler, HttpLogHandler} from 'ng-logr'

const httpHandler = new HttpLogHandler({
  logLevel: NgLogLevel.error
})
const options: INgLogOptions = {
  logLevel: NgLogLevel.debug,
  logHandlers: [new ConsoleLogHandler(), httpHandler]
}
```

#### Creating a log handler

Just create a class that extends `NgLogHandler` and include it as a `logHandler` in your configuration.

```typescript
class AwesomeHandler extends NgLogHandler {
  async handleLog(logLevel: NgLogLevel, ...logParams: any[]) {
    const logLevelName = NgLogLevel[logLevel]

    console[logLevelName]('AWESOME', ...logParams)
  }
}

const options: INgLogOptions = {
  logHandlers: [new AwesomeHandler()]
}
```

#### Extending a log handler

Extend any included log handler

```typescript
import {ConsoleLogHandler} from 'ng-logr'

class TimestampConsoleLogHandler extends ConsoleLogHandler {
  async handleLog(level: NgLogLevel, ...params: any[]) {
    super.handleLog(level, (new Date()).toLocaleString(), ...params)
  }
}

const options: INgLogOptions = {
  logHandlers: [new TimestampConsoleLogHandler()]
}
```

## Contributing

This library is still in beta.  Contributions are more than welcome.  Some things to focus on...
- Bug fixes.
- Add support for other Angular versions (currently supports 6 - 8)
- Make the logs fail silently (or log debug statements to the console if not in production mode).
- Add a way to include contextual information posting logs from `HttpLogHandler` (i.e. browser version, device, os version, etc.)
- Additional log handlers that are useful.
