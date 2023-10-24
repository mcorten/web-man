import { NgModule, isDevMode, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from "@angular/material/toolbar";
import { DatabaseModule } from "@shared-kernel/database";
import { RouterModule } from "@angular/router";
import { AppRoutes } from "./app.routes";
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { pwaUpdate } from "./app-pwa.update";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DatabaseModule.forRoot(),
    MatToolbarModule,
    RouterModule.forRoot(AppRoutes),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (swUpdate: SwUpdate) => pwaUpdate(window, swUpdate),
      multi: true,
      deps: [SwUpdate]
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
