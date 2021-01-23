import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { NewsModule } from './news/news.module';
import { Configuration } from './app.constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';
import { SharedModule } from './shared/shared.module';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AuthModule, OidcConfigService } from 'angular-auth-oidc-client';

import { map, switchMap } from 'rxjs/operators';

export function configureAuth(
  oidcConfigService: OidcConfigService,
  httpClient: HttpClient
) {
  const setupAction$ = httpClient
    .get<any>(`${window.location.origin}/api/ClientAppSettings`)
    .pipe(
      map((customConfig) => {
        return {
          stsServer: customConfig.stsServer,
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
          // autoUserinfo: false,
        };
      }),
      switchMap((config) => oidcConfigService.withConfig(config))
    );

  return () => setupAction$.toPromise();
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutes,
    SharedModule,
    HttpClientModule,
    AuthModule.forRoot(),
    CoreModule.forRoot(),
    HomeModule,
    NewsModule,
    DataEventRecordsModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25, //  Retains last 25 states
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
  ],

  declarations: [AppComponent],

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
