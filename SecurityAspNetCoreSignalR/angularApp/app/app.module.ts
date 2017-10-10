import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { NewsModule } from './news/news.module';
import { SharedModule } from './shared/shared.module';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthModule, OidcSecurityService, OpenIDImplicitFlowConfiguration } from 'angular-auth-oidc-client';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutes,
        SharedModule,
        HttpModule,
        HttpClientModule,
        AuthModule.forRoot(),
        CoreModule.forRoot(),
        HomeModule,
        NewsModule,
        StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({
            maxAge: 25 //  Retains last 25 states
        }),
        EffectsModule.forRoot([])
    ],

    declarations: [
        AppComponent
    ],

    providers: [
        OidcSecurityService
    ],

    bootstrap: [AppComponent],
})

export class AppModule {
    clientConfiguration: any;

    constructor(public oidcSecurityService: OidcSecurityService,
        private http: Http
    ) {

        console.log('APP STARTING');
        this.configClient().subscribe(config => {

            console.log(this.clientConfiguration);
            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
            openIDImplicitFlowConfiguration.stsServer = this.clientConfiguration.urlStsServer;

            openIDImplicitFlowConfiguration.redirect_url = this.clientConfiguration.urlRedirect;
            openIDImplicitFlowConfiguration.client_id = 'angularclient';
            openIDImplicitFlowConfiguration.response_type = 'id_token token';
            openIDImplicitFlowConfiguration.scope = ' openid vmsscope profile email';
            openIDImplicitFlowConfiguration.post_logout_redirect_uri = this.clientConfiguration.urlRedirectPostLogout;
            openIDImplicitFlowConfiguration.start_checksession = false;
            openIDImplicitFlowConfiguration.silent_renew = true;
            openIDImplicitFlowConfiguration.startup_route = '/calculator';
            openIDImplicitFlowConfiguration.forbidden_route = '/unauthorized';
            openIDImplicitFlowConfiguration.unauthorized_route = '/unauthorized';
            openIDImplicitFlowConfiguration.trigger_authorization_result_event = true;
            openIDImplicitFlowConfiguration.log_console_warning_active = true;
            openIDImplicitFlowConfiguration.log_console_debug_active = true;
            openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);
        });
    }

    configClient() {

        // console.log('window.location', window.location);
        // console.log('window.location.href', window.location.href);
        // console.log('window.location.origin', window.location.origin);

        return this.http.get(window.location.origin + '/api/ClientAppSettings').map(res => {
            this.clientConfiguration = res.json();
        });
    }
}
