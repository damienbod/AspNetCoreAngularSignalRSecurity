import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatToolbarModule,
    MatButtonModule,
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    AuthModule,
    OidcSecurityService,
    OpenIDImplicitFlowConfiguration,
    OidcConfigService,
    AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return () => oidcConfigService.load_using_stsServer('https://localhost:44318');
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        routing,
        HttpClientModule,
        AuthModule.forRoot(),
        FlexLayoutModule,
        StoreDevtoolsModule.instrument({
            maxAge: 25 //  Retains last 25 states
        }),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        MatToolbarModule,
        MatButtonModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        UnauthorizedComponent
    ],
    providers: [
        OidcSecurityService,
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [OidcConfigService],
            multi: true
        },
        Configuration
    ],
    bootstrap:    [AppComponent],
})

export class AppModule {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService,
    ) {
        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
            const config = new OpenIDImplicitFlowConfiguration();

            config.stsServer = 'https://localhost:44318';
            config.redirect_url = 'https://localhost:44395';
            config.client_id = 'angularclient2';
            config.response_type = 'code';
            config.scope = 'dataEventRecords openid profile email';
            config.post_logout_redirect_uri = 'https://localhost:44395/unauthorized';
            config.start_checksession = false;
            config.silent_renew = true;
            config.silent_renew_url = 'https://localhost:44395/silent-renew.html',
            //config.silent_redirect_url = 'https://localhost:44395/silent-renew.html',
            config.post_login_route = '/dm';
            config.forbidden_route = '/unauthorized';
            config.unauthorized_route = '/unauthorized';
            config.log_console_warning_active = true;
            config.log_console_debug_active = false;
            config.max_id_token_iat_offset_allowed_in_seconds = 10;

            const authWellKnownEndpoints = new AuthWellKnownEndpoints();
            authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

            this.oidcSecurityService.setupModule(config, authWellKnownEndpoints);

        });

        console.log('APP STARTING');
    }
}
