import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { AuthModule, OpenIDImplicitFlowConfiguration, OidcSecurityService } from 'angular-auth-oidc-client';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatToolbarModule,
    MatButtonModule,
} from '@angular/material';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpClientModule,
        AuthModule.forRoot(),
        FlexLayoutModule,
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
        Configuration
    ],
    bootstrap:    [AppComponent],
})

export class AppModule {
    constructor(public oidcSecurityService: OidcSecurityService) {

        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();

        openIDImplicitFlowConfiguration.stsServer = 'https://localhost:44318';
        openIDImplicitFlowConfiguration.redirect_url = 'https://localhost:44395';
        // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer
        // identified by the iss (issuer) Claim as an audience.
        // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
        // or if it contains additional audiences not trusted by the Client.
        openIDImplicitFlowConfiguration.client_id = 'angularclient';
        openIDImplicitFlowConfiguration.response_type = 'id_token token';
        openIDImplicitFlowConfiguration.scope = 'openid profile email';
        openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'https://localhost:44395/unauthorized';
        openIDImplicitFlowConfiguration.start_checksession = false;
        openIDImplicitFlowConfiguration.silent_renew = false;
        openIDImplicitFlowConfiguration.post_login_route = '/home';
        // HTTP 403
        openIDImplicitFlowConfiguration.forbidden_route = '/unauthorized';
        // HTTP 401
        openIDImplicitFlowConfiguration.unauthorized_route = '/unauthorized';
        openIDImplicitFlowConfiguration.log_console_warning_active = true;
        openIDImplicitFlowConfiguration.log_console_debug_active = true;
        // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
        // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

        this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);
    }
}
