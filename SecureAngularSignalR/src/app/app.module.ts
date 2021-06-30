import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthModule, LogLevel, StsConfigHttpLoader, StsConfigLoader } from 'angular-auth-oidc-client';
import { map, switchMap } from 'rxjs/operators';

import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { NewsModule } from './news/news.module';
import { Configuration } from './app.constants';
import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';
import { SharedModule } from './shared/shared.module';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const httpLoaderFactory = (httpClient: HttpClient) => {
  const config$ = httpClient
    .get<any>(`https://localhost:44390/api/ClientAppSettingsNewsApp`)
    .pipe(
      map((customConfig: any) => {
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
      })
    )
    .toPromise();

  return new StsConfigHttpLoader(config$);
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutes,
    SharedModule,
    HttpClientModule,
    CoreModule.forRoot(),
    HomeModule,
    NewsModule,
    DataEventRecordsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //  Retains last 25 states
    }),
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [Configuration],
  bootstrap: [AppComponent],
})
export class AppModule {}
