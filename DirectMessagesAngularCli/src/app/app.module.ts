import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthModule, LogLevel, StsConfigHttpLoader, StsConfigLoader } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';
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

import { DirectMessagesModule } from './directmessages/directmessages.module';

export const httpLoaderFactory = (httpClient: HttpClient) => {
  const config$ = httpClient.get<any>(`https://localhost:44390/api/ClientAppSettingsDirectMessage`).pipe(
    map((customConfig: any) => {
        return {
          authority: customConfig.stsServer,
          redirectUrl: customConfig.redirect_url,
          clientId: customConfig.client_id,
          responseType: customConfig.response_type,
          scope: customConfig.scope,
          postLogoutRedirectUri: customConfig.post_logout_redirect_uri,
          startCheckSession: customConfig.start_checksession,
          silentRenew: true,
          silentRenewUrl: customConfig.redirect_url + '/silent-renew.html',
          postLoginRoute: customConfig.startup_route,
          forbiddenRoute: customConfig.forbidden_route,
          unauthorizedRoute: customConfig.unauthorized_route,
          logLevel: 0, // LogLevel.Debug, // customConfig.logLevel
          maxIdTokenIatOffsetAllowedInSeconds:
          customConfig.max_id_token_iat_offset_allowed_in_seconds,
          historyCleanupOff: true,
          // autoUserInfo: false,
        };
      })
    );

    return new StsConfigHttpLoader(config$);
  };


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    routing,
    HttpClientModule,
    DirectMessagesModule,
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
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
  providers: [Configuration],
  bootstrap: [AppComponent],
})
export class AppModule {}
