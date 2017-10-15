import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './app.constants';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { NewsModule } from './news/news.module';
import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';
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
        DataEventRecordsModule,
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
        OidcSecurityService,
        Configuration
    ],

    bootstrap: [AppComponent],
})

export class AppModule {
    clientConfiguration: any;

    constructor(public oidcSecurityService: OidcSecurityService,
        private http: Http,
        private configuration: Configuration
    ) {

        console.log('APP STARTING');
        this.configClient().subscribe(config => {

            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
            openIDImplicitFlowConfiguration.stsServer = this.clientConfiguration.stsServer;
            openIDImplicitFlowConfiguration.redirect_url = this.clientConfiguration.redirect_url;
            openIDImplicitFlowConfiguration.client_id = this.clientConfiguration.client_id;
            openIDImplicitFlowConfiguration.response_type = this.clientConfiguration.response_type;
            openIDImplicitFlowConfiguration.scope = this.clientConfiguration.scope;
            openIDImplicitFlowConfiguration.post_logout_redirect_uri = this.clientConfiguration.post_logout_redirect_uri;
            openIDImplicitFlowConfiguration.start_checksession = this.clientConfiguration.start_checksession;
            openIDImplicitFlowConfiguration.silent_renew = this.clientConfiguration.silent_renew;
            openIDImplicitFlowConfiguration.startup_route = this.clientConfiguration.startup_route;
            openIDImplicitFlowConfiguration.forbidden_route = this.clientConfiguration.forbidden_route;
            openIDImplicitFlowConfiguration.unauthorized_route = this.clientConfiguration.unauthorized_route;
            openIDImplicitFlowConfiguration.log_console_warning_active = this.clientConfiguration.log_console_warning_active;
            openIDImplicitFlowConfiguration.log_console_debug_active = this.clientConfiguration.log_console_debug_active;
            openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds =
                this.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;

            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);
            configuration.Server = this.clientConfiguration.apiServer;
        });
    }

    configClient() {

        // console.log('window.location', window.location);
        // console.log('window.location.href', window.location.href);
        // console.log('window.location.origin', window.location.origin);

        return this.http.get(`${window.location.origin}/api/ClientAppSettings`).map(res => {
            this.clientConfiguration = res.json();
        });
    }
}
