import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  AuthModule,
  OidcConfigService,
  LogLevel,
} from 'angular-auth-oidc-client';
import { DirectMessagesModule } from './directmessages/directmessages.module';
import { AnyARecord } from 'dns';

export function configureAuth(oidcConfigService: OidcConfigService): any {
  return () =>
    oidcConfigService.withConfig({
      stsServer: 'https://localhost:44318',
      redirectUrl: window.location.origin,
      postLogoutRedirectUri: 'https://localhost:44395/unauthorized',
      clientId: 'angularclient2',
      scope: 'dataEventRecords openid profile email',
      responseType: 'code',
      silentRenew: true,
      silentRenewUrl: `${window.location.origin}/silent-renew.html`,
      renewTimeBeforeTokenExpiresInSeconds: 10,
      logLevel: LogLevel.Warn,
      postLoginRoute: '/dm',
      forbiddenRoute: '/unauthorized',
      unauthorizedRoute: '/unauthorized',
      historyCleanupOff: true,
    });
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    routing,
    HttpClientModule,
    DirectMessagesModule,
    AuthModule.forRoot(),
    FlexLayoutModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //  Retains last 25 states
    }),
    MatToolbarModule,
    MatButtonModule,
  ],
  declarations: [AppComponent, HomeComponent, UnauthorizedComponent],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService, HttpClient],
      multi: true,
    },
    Configuration,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
